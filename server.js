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
  res.sendFile(__dirname + "./public/index.html");
});

app.post("/", (req, res) => {
  const userEmail = req.body.email;
});

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS,
    type: "OAuth2",
    user: process.env.EMAIL_ADDRESS,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.TOKEN,
  },
});

// Define the email options
const mailOptions = {
  from: process.env.EMAIL_ADDRESS,
  to: "",
  subject: "Welcome ",
  text: "This is a test",
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Email send: " + info.response);
  }
});

app.listen(process.env.PORT | 8000, () => {
  console.log("Server is running on port 8000");
});
