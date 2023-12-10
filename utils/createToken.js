const jwt = require('jsonwebtoken');

const createToken = (payload) =>
    jwt.sign({ userId: payload }, "secrethany");

module.exports = createToken;