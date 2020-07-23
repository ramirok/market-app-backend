const sgMail = require("@sendgrid/mail");
const config = require("../utils/config");

sgMail.setApiKey(config.SENDGRID_API_KEY);

// sends account activation link to new users
const sendActivateAccount = (email, token) => {
  sgMail.send({
    from: "krupoviesaramiro@gmail.com",
    to: email,
    subject: "Activate account",
    html: `<a href="http://localhost:3000/auth/activate/${token}">Activate account</a>`,
  });
};

// sends welcome email to new users
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "krupoviesaramiro@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}.`,
  });
};

// sends changed password alert
const sendPasswordChangedEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "krupoviesaramiro@gmail.com",
    subject: "Password has changed",
    text: `Hi, ${name}, yo just changed your password.`,
  });
};

// sends resetpassword link when user forgot password
const sendPasswordResetEmail = (email, token) => {
  sgMail.send({
    from: "krupoviesaramiro@gmail.com",
    to: email,
    subject: "Password reset",
    html: `<a href="http://localhost:3000/auth/reset/${token}">Reset Password</a>`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendActivateAccount,
};
