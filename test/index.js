const { expect } = require("chai");
const { getPaynowQRCode } = require("../index");

describe("getPaynowQRCode function", () => {
  it("should generate a valid Paynow QR code with UEN", () => {
    const qrCode = getPaynowQRCode({
      initiationMethod: "12",
      referenceNumber: "123",
      merchantName: "MyMerchant",
      amount: 12.34,
      amountEditable: "0",
      uen: "123456789A",
      transactionCurrency: "702",
      countryCode: "SG",
      merchantCity: "Singapore",
      uniqueIdentifier: "SG.PAYNOW",
      expiryDate: "20250101120000", // Adjust with a valid expiry date
    });

    expect(qrCode).to.be.a("string");
  });

  it("should generate a valid Paynow QR code with Phone", () => {
    const qrCode = getPaynowQRCode({
      initiationMethod: "12",
      referenceNumber: "123",
      merchantName: "MyMerchant",
      amount: 12.34,
      amountEditable: "0",
      phone: "+6512345678",
      transactionCurrency: "702",
      countryCode: "SG",
      merchantCity: "Singapore",
      uniqueIdentifier: "SG.PAYNOW",
      expiryDate: "20250101120000", // Adjust with a valid expiry date
    });

    expect(qrCode).to.be.a("string");
  });

  it("should generate a valid Paynow QR code without amount and expiryDate", () => {
    const qrCode = getPaynowQRCode({
      initiationMethod: "12",
      referenceNumber: "123",
      merchantName: "MyMerchant",
      uen: "123456789A",
      transactionCurrency: "702",
      countryCode: "SG",
      merchantCity: "Singapore",
      uniqueIdentifier: "SG.PAYNOW",
    });

    expect(qrCode).to.be.a("string");
  });

  // Add more test cases as needed
});

describe("getPaynowQRCode function - Unhappy Flow", () => {
    it("should throw an error for invalid UEN", () => {
        expect(() => getPaynowQRCode()).to.throw("Invalid value for UEN or Phone");
      });
    it("should throw an error for invalid initiationMethod", () => {
      expect(() => getPaynowQRCode({ initiationMethod: "invalid" })).to.throw("Invalid value for initiationMethod");
    });
  
    it("should throw an error for invalid amountEditable", () => {
      expect(() => getPaynowQRCode({ initiationMethod: "12", amountEditable: "invalid" })).to.throw("Invalid value for amountEditable");
    });
  
    it("should throw an error for invalid UEN", () => {
      expect(() => getPaynowQRCode({ initiationMethod: "12"})).to.throw("Invalid value for UEN or Phone");
    });
  
    it("should throw an error for invalid expiryDate", () => {
      expect(() => getPaynowQRCode({ uen: "123456789A", initiationMethod: "12", expiryDate: "invalid" })).to.throw("Invalid value for parameter: invalid");
    });
  
    it("should throw an error for invalid referenceNumber length", () => {
      expect(() => getPaynowQRCode({ uen: "123456789A", initiationMethod: "12", referenceNumber: "a".repeat(100) })).to.throw("Exceeded maximum length for parameter: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    });
  
    // Add more test cases as needed
  });
