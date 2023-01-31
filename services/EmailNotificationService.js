const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendEmail = async ({ to, subject, html, attachments }) => {
  const accessToken = await oAuth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SENDER_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  return transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html,
    attachments,
  });
};

const sendOtpEmail = async (email, otp) => {
  const message = `<p>OTP is: ${otp}</p>`;
  return sendEmail({
    to: email,
    subject: "OTP Email",
    html: `<h4>Hello,</h4>
        ${message}
        `,
  });
};

const sendSignUpSuccessEmail = async (
  to,
  firstName,
) => {
  const message = `<p>
  Welcome to 3dspot. 
  Your account is now created, 
  Visit 3dspot.io to get your awesome 3dmodels. 
  </p>`;

  return sendEmail({
    to: to,
    subject: "Welcome to 3dspot",
    html: `<h4>Hello, ${firstName}</h4>
        ${message}
        `,
    // attachments: files.map((file) => {
    //   return {
    //     filename: file.name,
    //     content: file.data,
    //     contentType: file.mimeType,
    //   };
    // }),
  });
};

const sendOrderCreationEmail = async (to, orderId) => {
  const message = `<p>We have received your order. Your orderId is ${orderId}. </p>`;
  return sendEmail({
    to: to,
    subject: "Order Received",
    html: `<h4>Hello,</h4>
        ${message}
        `,
  });
};
const sendOrderReviewEmail = async (to, orderId) => {
  const message = `<p>
  We have reviewed your order id ${orderId}.
  It will cost yout $${price}.
  Please make the payment to proceed further
  </p>`;
  return sendEmail({
    to: to,
    subject: "Price Quoted",
    html: `<h4>Hello,</h4>
        ${message}
        `,
  });
};

module.exports = {
  sendEmail,
  sendOtpEmail,
  sendOrderCreationEmail,
  sendSignUpSuccessEmail,
  sendOrderReviewEmail
};
