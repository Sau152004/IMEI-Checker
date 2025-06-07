// Luhn algorithm implementation for IMEI validation
function validateIMEI(imei) {
  if (!imei || imei.length !== 15 || !/^\d+$/.test(imei)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(imei[i], 10);
    
    // Double every other digit starting from the right
    if ((i + 1) % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + Math.floor(digit / 10);
      }
    }
    
    sum += digit;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(imei[14], 10);
}

// Mock device information based on IMEI
function getDeviceInfo(imei) {
  // Extract TAC (Type Allocation Code - first 8 digits)
  const tac = imei.substring(0, 8);
  
  // Mock database of TACs (in real app, this would be from a database or API)
  const tacDatabase = {
    '35678901': { manufacturer: 'Apple', model: 'iPhone 13' },
    '86456702': { manufacturer: 'Samsung', model: 'Galaxy S21' },
    '12345678': { manufacturer: 'Google', model: 'Pixel 6' },
    '87654321': { manufacturer: 'OnePlus', model: '9 Pro' },
    '11223344': { manufacturer: 'Xiaomi', model: 'Mi 11' }
  };

  const device = tacDatabase[tac] || { 
    manufacturer: 'Unknown Manufacturer', 
    model: 'Unknown Model' 
  };

  return {
    manufacturer: device.manufacturer,
    model: device.model,
    serialNumber: imei.substring(8, 14),
    checkDigit: imei[14],
    tac: tac
  };
}

module.exports = {
  validateIMEI,
  getDeviceInfo
};