const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.DEST_EMAIL,
  from: process.env.FROM_EMAIL,
  subject: "Test SendGrid Email",
  text: "This is a test email from SendGrid.",
};

sgMail
  .send(msg)
  .then(() => console.log("Test email sent!"))
  .catch((error) => console.error("SendGrid error:", error.response?.body || error));
