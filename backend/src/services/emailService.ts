import nodemailer from 'nodemailer';
import { config } from '../config/env';

interface ContactEmailPayload {
  senderName: string;
  senderEmail: string;
  message: string;
}

/**
 * Creates a reusable nodemailer transporter authenticated via Gmail App Password.
 * The App Password is a 16-char token generated at myaccount.google.com/apppasswords.
 * It is NOT your regular Gmail password and can be revoked independently.
 */
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.gmailUser,
      pass: config.gmailAppPassword,
    },
  });

/**
 * Sends an inbound contact form submission to the portfolio owner's inbox.
 * Fires after the message is persisted to MongoDB so a DB failure never blocks the user,
 * and an email failure never prevents the DB save.
 */
export const sendContactNotification = async ({
  senderName,
  senderEmail,
  message,
}: ContactEmailPayload): Promise<void> => {
  if (!config.gmailUser || !config.gmailAppPassword) {
    console.warn('[EmailService] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email notification.');
    return;
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Portfolio Contact" <${config.gmailUser}>`,
    to: config.gmailUser,
    replyTo: `"${senderName}" <${senderEmail}>`,
    subject: `[Portfolio] New message from ${senderName}`,
    text: `You received a new contact form submission:\n\nName: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: monospace; background: #050505; color: #00f3ff; padding: 32px; border: 1px solid #00f3ff33;">
        <h2 style="color: #00f3ff; text-transform: uppercase; letter-spacing: 4px; margin: 0 0 24px;">// New Contact Received</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #888; padding: 8px 0; width: 80px; text-transform: uppercase; font-size: 11px; letter-spacing: 2px;">NAME</td>
            <td style="color: #fff; padding: 8px 0;">${senderName}</td>
          </tr>
          <tr>
            <td style="color: #888; padding: 8px 0; text-transform: uppercase; font-size: 11px; letter-spacing: 2px;">EMAIL</td>
            <td style="padding: 8px 0;"><a href="mailto:${senderEmail}" style="color: #00f3ff;">${senderEmail}</a></td>
          </tr>
        </table>
        <div style="margin-top: 24px; border-top: 1px solid #00f3ff33; padding-top: 24px;">
          <p style="color: #888; text-transform: uppercase; font-size: 11px; letter-spacing: 2px; margin: 0 0 12px;">MESSAGE</p>
          <p style="color: #ccc; white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <p style="margin-top: 24px; color: #333; font-size: 11px;">Sent via Ashley Thomas Roy's Portfolio</p>
      </div>
    `,
  });

  console.log(`[EmailService] Contact notification sent to ${config.gmailUser} from ${senderEmail}`);
};
