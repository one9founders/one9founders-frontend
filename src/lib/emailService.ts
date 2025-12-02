import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendWelcomeEmail(email: string) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Welcome to One9Founders!',
    html: `
      <h1>Welcome to One9Founders!</h1>
      <p>Thanks for subscribing to our newsletter. You'll be the first to know about new AI tools and features.</p>
      <p>Best regards,<br>The One9Founders Team</p>
    `,
  };

  return await transporter.sendMail(mailOptions);
}