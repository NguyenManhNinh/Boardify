import * as nodemailer from 'nodemailer'
import { env } from '~/config/environment'

const isProduction = env.BUILD_MODE === 'production'

/** ---------- GỬI MAIL QUA BREVO (PRODUCTION) ---------- **/

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

async function sendEmailViaBrevo({ toEmail, subject, htmlContent }) {
  if (!env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is missing')
  }
  if (!env.BREVO_SENDER_EMAIL) {
    throw new Error('BREVO_SENDER_EMAIL is missing')
  }

  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: {
        email: env.BREVO_SENDER_EMAIL,
        name: env.BREVO_SENDER_NAME || 'Boardify'
      },
      to: [{ email: toEmail }],
      subject,
      htmlContent
    })
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('Brevo API error:', res.status, text)
    throw new Error(`Brevo API error ${res.status}`)
  }

  console.log('✅ Email sent via Brevo successfully to:', toEmail)
}

/** ---------- GỬI MAIL QUA GMAIL SMTP (LOCAL/DEV) ---------- **/

let smtpTransporter = null

if (!isProduction) {
  smtpTransporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  })
}

/** ---------- HÀM GỬI MAIL CHUNG ---------- **/

async function sendEmail({ toEmail, subject, htmlContent }) {
  if (isProduction) {
    // Render -> dùng Brevo
    return sendEmailViaBrevo({ toEmail, subject, htmlContent })
  }

  // Local -> dùng Gmail SMTP
  if (!smtpTransporter) {
    // Fallback if smtpTransporter init failed or env missing in dev
    console.warn('SMTP transporter not initialized in dev. Skipping email.')
    return
  }

  await smtpTransporter.sendMail({
    from: `"${env.BREVO_SENDER_NAME || 'Boardify'}" <${env.SMTP_USER}>`,
    to: toEmail,
    subject,
    html: htmlContent
  })
  console.log('✅ Email sent via SMTP successfully to:', toEmail)
}

/** ---------- CÁC HÀM CỤ THỂ (INVITE / RESET PASSWORD ...) ---------- **/

const sendBoardInvitationEmail = async ({ to, inviterName, boardName, inviteLink, expiryDays = 7 }) => {
  const subject = `[Boardify] ${inviterName} mời bạn cùng làm việc trên board “${boardName}”`
  const html = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f4f5f7; padding:24px; color:#172b4d;">
        <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">

          <!-- Header -->
          <div style="padding:16px 24px; background:#0c66e4; color:#fff;">
            <div style="font-size:18px; font-weight:600;">Boardify</div>
            <div style="font-size:13px; opacity:.9;">Không gian quản lý công việc của bạn</div>
          </div>

          <!-- Content -->
          <div style="padding:24px;">
            <p style="margin:0 0 12px; font-size:15px;">Xin chào,</p>

            <p style="margin:0 0 12px; font-size:15px; line-height:1.5;">
              <strong>${inviterName}</strong> vừa mời bạn cùng tham gia board:
            </p>

            <div style="margin:8px 0 20px; padding:10px 16px; background:#f1f5ff; border-radius:6px;">
              <div style="font-size:14px; color:#172b4d; font-weight:600;">${boardName}</div>
            </div>

            <p style="margin:0 0 16px; font-size:14px; line-height:1.5;">
              Board này sẽ được sử dụng để cùng theo dõi công việc, trao đổi và cập nhật tiến độ với nhau.
            </p>

            <p style="margin:0 0 20px; font-size:14px; line-height:1.5;">
              Nếu bạn đồng ý tham gia, hãy bấm nút bên dưới để vào board nhé.
            </p>

            <!-- CTA button -->
            <div style="text-align:center; margin-bottom:24px;">
              <a href="${inviteLink}"
                 style="display:inline-block; padding:10px 24px; border-radius:6px; background:#0c66e4; color:#fff; text-decoration:none; font-size:14px; font-weight:600;">
                Tham gia board
              </a>
            </div>

            <!-- Fallback link -->
            <p style="margin:0 0 8px; font-size:12px; color:#6b778c;">
              Nếu nút không bấm được, bạn có thể copy link dưới đây và dán vào trình duyệt:
            </p>
            <p style="margin:0 0 16px; font-size:12px; color:#0c66e4; word-break:break-all;">
              ${inviteLink}
            </p>

            <p style="margin:0 0 4px; font-size:12px; color:#6b778c;">
              Link mời này có hiệu lực trong <strong>${expiryDays} ngày</strong>.
            </p>
            <p style="margin:0; font-size:12px; color:#6b778c;">
              Nếu bạn không có nhu cầu tham gia, chỉ cần bỏ qua email này.
            </p>
          </div>

          <!-- Footer -->
          <div style="padding:12px 24px; border-top:1px solid #e4e6ea; font-size:11px; color:#97a0af; text-align:center;">
            Email được gửi tự động từ Boardify thay mặt cho ${inviterName}.
          </div>
        </div>
      </div>
    `

  return sendEmail({
    toEmail: to,
    subject,
    htmlContent: html
  })
}

export const emailService = {
  sendBoardInvitationEmail
}
