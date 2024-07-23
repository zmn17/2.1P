const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Create a transporter object with OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_ADDRESS,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.TOKEN,
  },
});

app.post("/", async (req, res) => {
  const userEmail = req.body.email;

  try {
    await sendEmailToSubscribers(userEmail);
    res.status(200).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Subscription failed. Try again!" });
  }
});

const sendEmailToSubscribers = async (user_email) => {
  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: user_email,
    subject: "Welcome to DEV@Deakin",
    text: "We're excited to have you on board. At Deakin, we strive to provide the best experience possible, and we are confident that you'll love what we have to offer.",
  };

  // Send the email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
