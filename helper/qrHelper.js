const crc16 = require('./crc16Lib');

const generateRandomCode = (length = 7) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters.charAt(randomIndex);
  }

  return randomCode;
}

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

const isValidExpiryDate = (expiryDate) => {
  const currentDate = new Date();
  const formattedCurrentDate = formatDate(currentDate);

  if (/^\d{8}$/.test(expiryDate) || /^\d{14}$/.test(expiryDate)) {
    // Check if expiryDate is greater than current date
    return expiryDate > formattedCurrentDate;
  }

  return false;
}

// If there are only 1 number, append a leading ‘0’ before the 1 number.
const pad2 = n => (n < 10 ? '0' : '') + n;

// If there are only 3 characters, append a leading ‘0’ before the 3 characters.
const pad3 = n => (n.length < 4 ? '0' : '') + n;

// PAYNOW => MAPPING FIELDS WITH REFERENCE
const defaultDataObj = [
  {
    id: '00',
    name: 'Payload Format Indicator',
    length: '02',
    value: '01',
    comment:
      'Shall be the 1st data object in QR code. Shall contain value of 01.',
  },
  {
    id: '01',
    name: 'Point of Initiation Method',
    length: '',
    value: '',
    comment:
      'Value of 11 used when same QR code used for more than 1 transaction. Value of 12 used when a new QR code is shown for each transaction.',
  },
  {
    id: '26',
    name: 'Merchant Account Information',
    length: '',
    value: '',
    comment: 'Templates reserved for additional payment networks.',
    dataObjects: [
      {
        id: '00',
        name: 'Globally Unique Identifier',
        length: '',
        value: '',
        comment:
          'Value can be one of the following - an Application Identifier (AID), a UUID without hyphens, a reverse domain name.',
      },
      {
        id: '01',
        name: 'Proxy type',
        length: '',
        value: '',
        comment: '0 - Mobile number, 2 – UEN',
      },
      {
        id: '02',
        name: 'Proxy Value',
        length: '',
        value: '',
        comment: 'Mobile/UEN number',
      },
      {
        id: '03',
        name: 'Editable Transaction amount indicator',
        length: '',
        value: '',
        comment: '0 – amount cannot be edited, 1 – amount can be edited;',
      },
      {
        id: '04',
        name: 'QR Expiry Date',
        length: '',
        value: '',
        comment:
          'Optional - YYYYMMDD , If QR Expiry Date is not provided, no validation required',
      },
    ],
  },
  {
    id: '52',
    name: 'Merchant Category Code',
    length: '',
    value: '',
    comment: 'As defined by ISO 18245.',
  },
  {
    id: '53',
    name: 'Transaction Currency',
    length: '',
    value: '',
    comment:
      '3-digit numeric representation of currency according to ISO 4217. USD is 840, SGD is 702.',
  },
  {
    id: '54',
    name: 'Transaction Amount',
    length: '',
    value: '',
    comment:
      'Absent if the mobile application is to prompt the consumer to enter the transaction amount. Present otherwise.',
  },
  {
    id: '58',
    name: 'Country Code',
    length: '',
    value: '',
    comment: 'As defined by ISO 3166-1 alpha 2.',
  },
  {
    id: '59',
    name: 'Merchant Name',
    length: '',
    value: '',
    comment:
      'This is the trade name/store name/ doing-business-as name. Default to NA if not applicable',
  },
  {
    id: '60',
    name: 'Merchant City',
    length: '',
    value: '',
    comment: 'It will be filled with default Singapore.',
  },
  {
    id: '62',
    name: 'Additional Data Field Template',
    length: '',
    value: '',
    comment: '',
    dataObjects: [
      {
        id: '01',
        name: 'Bill Number',
        length: '',
        value: '',
        comment: 'Bill Number to be used to reflect transaction reference.',
      },
    ],
  },
  {
    id: '63',
    name: 'CRC',
    length: '04',
    value: '',
    comment:
      'Checksum calculated over all the data objects included in the QR Code and will be the last object under the root and allows the mobile application to check the integrity of the data scanned without having to parse all of the data objects.',
  },
];


const getQrValue = (arrObj) => {
  let countData = '';

  arrObj.forEach((obj) => {
    if (obj.dataObjects && obj.dataObjects.length > 0) {
      obj.value = '';
      obj.dataObjects.forEach((dataObj) => {
        obj.value += `${dataObj.id}${pad2(dataObj.value.length)}${dataObj.value}`;
      });
      obj.length = pad2(obj.value.length);
    }
    countData += `${obj.id}${obj.length}${obj.value}`;
  });

  return `${countData}${pad3(crc16(countData))}`;
};

const updateQrObj = (findId, newValue, arrData, innerDataObjId) => {
  var item = {
    id: findId,
    length: pad2(newValue.length),
    value: newValue.toString(),
    comment: '',
  };
  var foundIndex = arrData.findIndex(x => x.id === item.id);

  if (innerDataObjId) {
    var innerItem = {
      id: innerDataObjId,
      length: pad2(newValue.length),
      value: newValue.toString(),
      comment: '',
    };
    var foundInnerIndex = arrData[foundIndex].dataObjects.findIndex(
      i => i.id === innerItem.id,
    );
    innerItem.comment =
      arrData[foundIndex].dataObjects[foundInnerIndex].comment;
    arrData[foundIndex].dataObjects[foundInnerIndex] = innerItem;
  } else {
    item.comment = arrData[foundIndex].comment;
    arrData[foundIndex] = item;
  }
  return arrData;
};

module.exports = {
  generateRandomCode,
  isValidExpiryDate,
  defaultDataObj,
  updateQrObj,
  getQrValue,
}
