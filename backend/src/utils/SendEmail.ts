import nodemailer from "nodemailer";

export async function sendMail(to: string, subject: string, text: string) {
  // let testAccount = await nodemailer.createTestAccount(); // testing

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_DATA,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((err) => {
    if (err) {
      console.log(err);
    }
  });

  let info = await transporter.sendMail({
    from: "Filip at P!",
    to: to,
    subject: subject,
    text,
    html: text,
  });

  //console.log("Message sent: %s", info.messageId); //testing
}
