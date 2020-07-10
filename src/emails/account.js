const sgMail = require("@sendgrid/mail");
const config = require("../utils/config");

sgMail.setApiKey(config.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "krupoviesaramiro@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}.`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "krupoviesaramiro@gmail.com",
    subject: "Sorry to see you go!",
    text: `Goodby, ${name}. We hope to see you back sometime soon.`,
  });
};

const sendPasswordChangedEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "krupoviesaramiro@gmail.com",
    subject: "Password has changed",
    text: `Hi, ${name}, yo just changed your password.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
  sendPasswordChangedEmail,
};
