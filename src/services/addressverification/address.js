// src/services/addressverification/address.js
const { queryDatabase } = require('../../db');

async function checkAddressValid(address) {
  const query = 'SELECT * FROM wm_address WHERE address = ?';
  
  try {
    const results = await queryDatabase(query, [address]);
    if (results.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error('Database query failed: ' + error.message);
  }
}

module.exports = { checkAddressValid };
