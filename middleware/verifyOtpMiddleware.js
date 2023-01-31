const otpService = require("../services/otpService");
const errors = require("../exceptions/");

const verifyOtp = async (req, res, next) => {
  const { emailId, otp } = req.body
  if (!emailId || !otp) {
    throw new errors.BadRequestError('Please provide email and otp');
  }
  const isVerified = await otpService.verifyOtp(emailId, otp)
  if (!isVerified) {
    throw new errors.ForbiddenError('OTP invalid !!')
  }
  delete req.body.otp
  next()
}

module.exports = verifyOtp