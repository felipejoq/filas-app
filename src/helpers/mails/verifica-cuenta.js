"use strict";
const nodemailer = require("nodemailer");

require("../../config/global");

const mails = {};

mails.enviarVerificacion = async (user_id, email, token_verifica) => {
  return new Promise((resolve, reject) => {

    const url = `${ process.env.URL_BASE }/verifica/${user_id}/${token_verifica}`;

    const htmlbody = `
    Hola, verifique su cuenta presionando en el siguiente enlace: <a href="${url}" target="_blank">Verificar cuenta</a>
`;

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP,
        port: process.env.EMAIL_SMTP_PORT,
        tls: {
          rejectUnauthorized: false
        },
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_ACCOUNT, // generated ethereal user
          pass: process.env.EMAIL_PASS // generated ethereal password
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Filas APP (Beta)" <test@test.com>', // sender address
        to: email, // list of receivers
        subject: "Verifique su cuenta", // Subject line
        text: `
        Hola, verifique su cuenta presionando en el siguiente enlace: <a href="${url}" target="_blank">Verificar cuenta</a>
    `, // plain text body
        html: htmlbody // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(false);
        }
        if (info) {
          resolve(true);
        }
      });
    });
  });
};

module.exports = mails;
