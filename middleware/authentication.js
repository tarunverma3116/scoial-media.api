const jwt = require('jsonwebtoken')
const {UnauthorizedError, ForbiddenError} = require('../exceptions')

const authenticate = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  console.log("authHeader", authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthorizedError('Access token not found')
  }
  const token = authHeader.split(' ')[1]
  try {
    req.payload = jwt.verify(token, process.env.JWT_SECRET)
    console.log("req.payload", req.payload)
    next()
  } catch (error) {
    throw new ForbiddenError('Access token Invalid/Expired')
  }
}

module.exports = authenticate
