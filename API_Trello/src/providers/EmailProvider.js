
import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    })

    const mailOptions = {
      from: '"Boardify Support" <no-reply@boardify.com>',
      to: to,
      subject: subject,
      html: htmlContent
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Message sent: %s', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Error sending email')
  }
}

export const EmailProvider = {
  sendEmail
}
