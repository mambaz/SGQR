const {
    generateRandomCode,
    defaultDataObj,
    updateQrObj,
    getQrValue,
} = require("./qrHelper");

const { validateParam, removeDataObject } = require("./paramValidation");

/**
 * Validates the UEN or phone number based on the provided value and type.
 *
 * @param {string} value - The UEN or phone number value.
 * @param {string} type - The type, either 'uen' or 'phone'.
 */
function validateUenOrPhone(value, type) {
    if (type === 'uen') {
        validateParam(value, 16, 'alphanumeric-special');
    } else if (type === 'phone') {
        validateParam(value, 16, 'alphanumeric-special');
    } else {
        throw new Error('Invalid type for UEN or phone validation');
    }
}

/**
 * Generates a PayNow QR Code for a transaction.
 *
 * @param {Object} options - The options object for configuring the QR Code.
 * @param {string} options.initiationMethod - Initiation method for the transaction. Should be either '11' (Static) or '12' (Dynamic).
 * @param {string} [options.referenceNumber] - Reference number for the transaction. Auto-generated if not provided. Maximum length: 99.
 * @param {string} [options.merchantName='NA'] - Name of the merchant. Maximum length: 25. Alphanumeric and special characters allowed.
 * @param {number | null} options.amount - Transaction amount. Set to `null` if not applicable.
 * @param {string} options.amountEditable - Whether the amount is editable or not. Should be '0' (non-editable) or '1' (editable).
 * @param {string} [options.uen=null] - UEN (Unique Entity Number) of the merchant. Maximum length: 16. Alphanumeric and special characters allowed.
 * @param {string} [options.phone=null] - SG Phone number including '+65'. Maximum length: 16. Alphanumeric and special characters allowed.
 * @param {number} [options.expiryDate=null] - Expiry date for the QR code. Format: 'YYYYMMDD' or 'YYYYMMDDHHMMSS'. Must be greater than the current date and time.
 * @param {string} options.transactionCurrency - Currency code for the transaction. Maximum length: 3. Alphanumeric.
 * @param {string} options.countryCode - Country code of the merchant. Maximum length: 2. Alphanumeric.
 * @param {string} options.merchantCity - City of the merchant. Maximum length: 15. Alphanumeric.
 * @param {string} options.uniqueIdentifier - Unique identifier for PayNow transactions. Maximum length: 9. Alphanumeric and special characters allowed.
 *
 * @returns {string} - The generated PayNow QR Code.
 *
 * @throws {Error} - Throws an error if any parameter is invalid or if the initiationMethod is not '11' or '12'.
 */
function generateQRCode({
    initiationMethod = '12',
    referenceNumber = generateRandomCode(7) + '-' + new Date().getTime(),
    merchantName = 'NA',
    amount = null,
    amountEditable = '0',
    uen = null,
    phone = null,
    expiryDate = null,
    transactionCurrency = '702',
    countryCode = 'SG',
    merchantCity = 'Singapore',
    uniqueIdentifier = 'SG.PAYNOW',
} = {}) {
    const options = {
        merchantCategoryCode: '0000',
    };
    const updateQrData = updateQrObj('01', initiationMethod, defaultDataObj);

    // Validation
    if (!['11', '12'].includes(initiationMethod)) {
        throw new Error('Invalid value for initiationMethod');
    }

    validateParam(referenceNumber, 99);
    validateParam(merchantName, 25, 'alphanumeric-special');

    if (!['0', '1'].includes(amountEditable)) {
        throw new Error('Invalid value for amountEditable');
    }

    if (uen) {
        validateUenOrPhone(uen, 'uen');
        updateQrObj('26', '2', updateQrData, '01'); // proxyType: '2' means UEN 
        updateQrObj('26', uen, updateQrData, '02');
    } else if (phone) {
        validateUenOrPhone(phone, 'phone');
        updateQrObj('26', '0', updateQrData, '01'); // proxyType: '0' means Phone 
        updateQrObj('26', phone, updateQrData, '02');
    } else {
        throw new Error('Invalid value for UEN or Phone');
    }

    if (amount !== null) {
        validateParam(amount.toString(), 13, 'number');
        updateQrObj('26', amountEditable, updateQrData, '03');
        updateQrObj('54', amount.toString(), updateQrData);
    } else {
        updateQrObj('26', '1', updateQrData, '03');
        removeDataObject(updateQrData, "54");
    }

    validateParam(transactionCurrency, 3, 'number');
    validateParam(countryCode, 2, 'alphanumeric');
    validateParam(merchantCity, 15, 'alphanumeric');
    validateParam(uniqueIdentifier, 9, 'alphanumeric-special');

    updateQrObj('26', uniqueIdentifier, updateQrData, '00');

    // Check if expiry is required
    if (expiryDate !== null) {
        validateParam(expiryDate, 14, 'expiry-date');
        updateQrObj('26', expiryDate, updateQrData, '04');
    } else {
        // If expiry is not required, delete object id 26 
        removeDataObject(updateQrData, "26", "04");
    }

    updateQrObj('52', options.merchantCategoryCode, updateQrData);
    updateQrObj('53', transactionCurrency, updateQrData);
    updateQrObj('58', countryCode, updateQrData);
    updateQrObj('59', merchantName, updateQrData);
    updateQrObj('60', merchantCity, updateQrData);
    updateQrObj('62', referenceNumber, updateQrData, '01');

    return getQrValue(updateQrData);
}

module.exports = {
    generateQRCode,
};
