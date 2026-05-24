import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || 'SwiftBit <onboarding@resend.dev>';

export async function sendOtpEmail(email, otp) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your SwiftBit password reset code',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#07090d;color:#fff;padding:40px;border-radius:16px;border:1px solid rgba(255,255,255,0.08)">
        <div style="text-align:center;margin-bottom:32px">
          <span style="font-size:28px;font-weight:900">Swift<span style="color:#4ade80">Bit</span></span>
        </div>
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;text-align:center">Password Reset Code</h2>
        <p style="color:#9ca3af;font-size:14px;text-align:center;margin-bottom:32px">
          Use the code below to reset your SwiftBit password. It expires in <strong style="color:#fff">15 minutes</strong>.
        </p>
        <div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:24px;text-align:center;margin-bottom:32px">
          <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#4ade80">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:12px;text-align:center">
          If you did not request a password reset, you can safely ignore this email. Your password will not change.
        </p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0"/>
        <p style="color:#374151;font-size:11px;text-align:center">
          SwiftBit Technologies Ltd · 15 Finsbury Square, London EC2A 1BT
        </p>
      </div>
    `,
  });
}
