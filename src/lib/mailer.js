// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");
// const { OAuth2 } = google.auth;

// const oauth_link = "https://developers.google.com/oauthplayground";
// const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRET } = process.env;

// const auth = new OAuth2(
//     MAILING_ID,
//     MAILING_SECRET,
//     MAILING_REFRESH,
//     oauth_link
// );

// // send welcome mail
// const sendMail = (mailOptions) => {
//     auth.setCredentials({
//         refresh_token: MAILING_REFRESH,
//     });
//     const accessToken = auth.getAccessToken();
//     const smtp = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             type: "OAuth2",
//             user: EMAIL,
//             clientId: MAILING_ID,
//             clientSecret: MAILING_SECRET,
//             refreshToken: MAILING_REFRESH,
//             accessToken,
//         },
//     });
//     // const mailOptions = {
//     //     from: EMAIL,
//     //     to: email,
//     //     subject: "Welcome to Instagram",
//     //     html: `Welcome ${name} to our intagram community`,
//     // };
//     smtp.sendMail(mailOptions, (err, res) => {
//         if (err) return err;
//         return res;
//     });
// };

// // send password reset mail
// exports.passwordResetMail = (email, url) => {
//     const options = {
//         from: EMAIL,
//         to: email,
//         subject: "Password rest link",
//         html: `To rest your password click on this link: ${url}`,
//     };
//     return sendMail(options);
// };

const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const sendMail = (to, subject, body) => {
    const from = "working.abdullahmia@gmail.com";
    mailTransporter.sendMail({ from, to, subject, text: body });
};

module.exports = sendMail;
