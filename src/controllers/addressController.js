// controllers/addressController.js

const { checkAddressValid } = require('../services/addressverification/address');
const { generateErrorResponse, generateSuccessResponse } = require('../utils/response');

async function checkingAddress(req, res) {
  const address = req.query.address;

  if (!address) {
    return res.status(400).json(generateErrorResponse('Address is required'));
  }

  try {
    const isValid = await checkAddressValid(address);
    return res.status(200).json(generateSuccessResponse({ valid: isValid }));
  } catch (error) {
    return res.status(500).json(generateErrorResponse('Internal server error', error.message));
  }
}

module.exports = { checkingAddress };
