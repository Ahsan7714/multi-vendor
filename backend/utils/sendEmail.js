const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secure: false, // true for 465, false for other ports
        service:"gmail",
        auth: {
          user: process.env.SMPT_MAIL, // generated ethereal user
          pass: process.env.SMPT_PASSWORD, // generated ethereal password
        },
      });


  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
