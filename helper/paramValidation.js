const { isValidExpiryDate } = require("./qrHelper");

function validateParam(param, maxLimit, type = 'alphanumeric-special') {
    if (param === null || param === undefined) {
      return null;
    }
  
    if (type === 'alphanumeric' && !/^[a-zA-Z0-9\s]*$/.test(param)) {
      throw new Error(`Invalid value for parameter: ${param}`);
    }
  
    if (type === 'number' && !/^\d+(\.\d{1,2})?$/.test(param)) {
      throw new Error(`Invalid value for parameter: ${param}`);
    }
  
    if (type === 'alphanumeric-special' && !/^[a-zA-Z0-9+_.-]*$/.test(param)) {
      throw new Error(`Invalid value for parameter: ${param}`);
    }

    if (type === 'expiry-date' && !isValidExpiryDate(param)) {
      throw new Error(`Invalid value for parameter: ${param}`);
    }
  
    if (type === 'string' && typeof param !== 'string') {
      throw new Error(`Invalid value for parameter: ${param}`);
    }
  
    if (param.length > maxLimit) {
      throw new Error(`Exceeded maximum length for parameter: ${param}`);
    }

    return param;
  }

function removeDataObject(array, mainId, dataId) {
    // Find the index of the object with the mainId
    const indexToRemove = array.findIndex(obj => obj.id === mainId);
  
    if (indexToRemove !== -1) {
      // If dataId is provided, remove the dataObject with dataId
      if (dataId !== undefined) {
        const dataIndexToRemove = array[indexToRemove].dataObjects.findIndex(obj => obj.id === dataId);
  
        if (dataIndexToRemove !== -1) {
          array[indexToRemove].dataObjects.splice(dataIndexToRemove, 1);
        }
      }
  
      // If either dataId is not provided or there are no more dataObjects, remove the entire object with mainId
      if (dataId === undefined || array[indexToRemove].dataObjects.length === 0) {
        array.splice(indexToRemove, 1);
      }
    }
  
    return array;
}

module.exports = {
    validateParam,
    removeDataObject
}
