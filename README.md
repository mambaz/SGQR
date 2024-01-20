# Singapore Quick Response Code (SGQR)

Effortlessly generate your Singapore Quick Response Code (SGQR) Code for PayNow transactions. Quickly set predefined amounts and reference numbers for seamless peer-to-peer transfers across major banks and non-financial institutions in Singapore.

A Node.js package to generate Singapore Quick Response Code (SGQR) for PayNow transactions.

## Installation

```bash
npm install sgqr-code --save
```

## Usage

```bash
const { getPaynowQRCode } = require('sgqr-code');

// Example Usage
try {
    const qrCode = getPaynowQRCode({
        phone: '+6512345678'
    });

    console.log(qrCode);
} catch (error) {
    console.log(error);
    console.error('Error generating QR code:', error.message);
}

// Example Usage: 1
const qrCode = getPaynowQRCode({
  merchantName: 'MyMerchant',
  amount: 25.99,
  uen: '123456789A',
});

// Example Usage: 2
const qrCode = getPaynowQRCode({
  amount: 25.99,
  phone: '+6512345678',
});

// Example Usage: 3
const qrCode = getPaynowQRCode({
  uen: '123456789A',
});

// Example Usage: 4
const qrCode = getPaynowQRCode({
  initiationMethod: '12',
  referenceNumber: '123456',
  merchantName: 'MyMerchant',
  amount: 25.99,
  amountEditable: '0',
  uen: '123456789A',
  transactionCurrency: '702',
  countryCode: 'SG',
  merchantCity: 'Singapore',
  uniqueIdentifier: 'SG.PAYNOW',
  expiryDate: '20230101120000', // Optional, format: YYYYMMDD or YYYYMMDDHHMMSS
});

console.log(qrCode);

```

## `getPaynowQRCode` Object Param Values


| Parameter          | Description                                     | Default Value     | Maximum Length | Mandatory |
| ------------------- | ----------------------------------------------- | ------------------| ---------------| ----------|
| `initiationMethod`  | Initiation method for the transaction. `'11'` Static or `'12'` Dynamic          | `'12'` (Dynamic)  | N/A            | Yes       |
| `referenceNumber`   | Reference number for the transaction.           | Auto-generated    | 99             | Yes       |
| `merchantName`      | Name of the merchant.                            | `'NA'`            | 25             | Yes       |
| `amount`            | Transaction amount.                             | `null`            | N/A            | No        |
| `amountEditable`    | Whether the amount is editable or not.          | `'0'`             | N/A            | Yes       |
| `uen`               | UEN (Unique Entity Number) of the merchant.     | `null`            | 16             | No        |
| `phone`             | SG Phone number including `+65`                 | `null`            | 16             | No        |
| `transactionCurrency`| Currency code for the transaction.               | `'702'`           | 3              | Yes       |
| `countryCode`       | Country code of the merchant.                   | `'SG'`            | 2              | Yes       |
| `merchantCity`      | City of the merchant.                           | `'Singapore'`     | 15             | Yes       |
| `uniqueIdentifier`  | Unique identifier for PayNow transactions.     | `'SG.PAYNOW'`     | 9              | Yes       |
| `expiryDate`        | Expiry date for the QR code.                    | `null` (Optional) | 14             | No        |

**Note:**
- `initiationMethod` should be either `'11'` for Static or `'12'` for Dynamic QR code.
- If `amount` is `null`, `amountEditable` will be set to `'0'` (non-editable).
- Either `uen` or `phone` can be provided. If both are provided, `uen` will be considered by default.
- `phone` should be a Singapore phone number starting with `+65` and followed by 8 digits.
- `expiryDate` (if provided) should be in the format `YYYYMMDD` or `YYYYMMDDHHMMSS` and must be greater than the current date and time.

