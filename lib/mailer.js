import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || 'SwiftBit <onboarding@resend.dev>';

function baseTemplate(content) {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#07090d;color:#fff;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden">
      <div style="background:linear-gradient(135deg,rgba(34,197,94,0.12),rgba(34,197,94,0.04));padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06)">
        <span style="font-size:26px;font-weight:900;letter-spacing:-0.5px">Swift<span style="color:#4ade80">Bit</span></span>
      </div>
      <div style="padding:36px">
        ${content}
      </div>
      <div style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);text-align:center">
        <p style="color:#374151;font-size:11px;margin:0">SwiftBit Technologies Ltd · 15 Finsbury Square, London EC2A 1BT</p>
        <p style="color:#374151;font-size:11px;margin:6px 0 0">Regulated by the FCA &amp; MiCA compliant</p>
      </div>
    </div>
  `;
}

function fmtQty(qty, symbol) {
  const n = parseFloat(qty);
  if (n >= 1000) return `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${symbol}`;
  if (n >= 1)    return `${n.toFixed(4)} ${symbol}`;
  return `${n.toFixed(8)} ${symbol}`;
}

function fmtUsd(amount) {
  return `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function sendWelcomeEmail(email, name) {
  resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Welcome to SwiftBit 🎉',
    html: baseTemplate(`
      <h2 style="font-size:22px;font-weight:800;margin:0 0 8px">Welcome to SwiftBit, ${name}!</h2>
      <p style="color:#9ca3af;font-size:14px;margin:0 0 28px">Your account has been created. Here's what you can do next:</p>

      <div style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15);border-radius:12px;padding:24px;margin-bottom:28px">
        ${[
          ['🔐', 'Complete KYC', 'Verify your identity to unlock full trading limits.'],
          ['💰', 'Fund your wallet', 'Deposit crypto or buy directly with your card.'],
          ['⚡', 'Start trading', 'Buy, sell, and swap 100+ cryptocurrencies instantly.'],
        ].map(([icon, title, desc]) => `
          <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:18px;last-child:margin-bottom:0">
            <span style="font-size:20px;line-height:1">${icon}</span>
            <div>
              <p style="color:#fff;font-weight:700;font-size:14px;margin:0 0 2px">${title}</p>
              <p style="color:#9ca3af;font-size:12px;margin:0">${desc}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <p style="color:#6b7280;font-size:12px;text-align:center;margin:0">
        Need help? Reach us at <a href="mailto:swiftbitsuport@outlook.com" style="color:#4ade80;text-decoration:none">swiftbitsuport@outlook.com</a>
      </p>
    `),
  }).catch(console.error);
}

export async function sendTransactionPendingEmail(email, name, tx) {
  const typeLabel = {
    buy:        'Purchase',
    sell:       'Sale',
    send:       'Withdrawal',
    withdrawal: 'Withdrawal',
    deposit:    'Deposit',
  }[tx.type] || 'Transaction';

  resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your ${typeLabel.toLowerCase()} is pending review — SwiftBit`,
    html: baseTemplate(`
      <p style="color:#9ca3af;font-size:14px;margin:0 0 24px">Hi ${name},</p>
      <h2 style="font-size:22px;font-weight:800;margin:0 0 6px">${typeLabel} submitted</h2>
      <p style="color:#9ca3af;font-size:14px;margin:0 0 28px">
        Your ${typeLabel.toLowerCase()} is under review. We'll notify you once it's processed — usually within a few hours.
      </p>

      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;margin-bottom:28px">
        ${[
          ['Type',    typeLabel],
          ['Asset',   `${tx.coin} (${tx.symbol})`],
          tx.qty    ? ['Quantity', fmtQty(tx.qty, tx.symbol)] : null,
          tx.amount ? ['Value',    fmtUsd(tx.amount)]          : null,
          ['Status',  'Pending Review'],
        ].filter(Boolean).map(([label, value], i) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px;${i > 0 ? 'border-top:1px solid rgba(255,255,255,0.05)' : ''}">
            <span style="color:#9ca3af;font-size:13px">${label}</span>
            <span style="color:${label === 'Status' ? '#facc15' : '#fff'};font-weight:600;font-size:13px">${value}</span>
          </div>
        `).join('')}
      </div>

      <p style="color:#6b7280;font-size:12px;text-align:center;margin:0">
        Questions? Contact us at <a href="mailto:swiftbitsuport@outlook.com" style="color:#4ade80;text-decoration:none">swiftbitsuport@outlook.com</a>
      </p>
    `),
  }).catch(console.error);
}

export async function sendOtpEmail(email, otp) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your SwiftBit password reset code',
    html: baseTemplate(`
      <h2 style="font-size:20px;font-weight:700;margin:0 0 8px;text-align:center">Password Reset Code</h2>
      <p style="color:#9ca3af;font-size:14px;text-align:center;margin:0 0 28px">
        Use the code below to reset your password. It expires in <strong style="color:#fff">15 minutes</strong>.
      </p>
      <div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:28px;text-align:center;margin-bottom:28px">
        <span style="font-size:44px;font-weight:900;letter-spacing:14px;color:#4ade80">${otp}</span>
      </div>
      <p style="color:#6b7280;font-size:12px;text-align:center;margin:0">
        If you did not request a password reset, you can safely ignore this email.
      </p>
    `),
  });
}

export async function sendKycStatusEmail(email, name, status) {
  const approved = status === 'verified';
  const reset    = status === 'unverified';

  const subject = approved ? 'Your identity has been verified — SwiftBit'
    : reset ? 'Your KYC status has been reset — SwiftBit'
    : 'KYC application update — SwiftBit';

  const heading = approved ? 'Identity Verified ✓'
    : reset ? 'KYC Status Reset'
    : 'KYC Application Rejected';

  const body = approved
    ? 'Your identity verification has been approved. You now have full access to all SwiftBit trading features.'
    : reset
    ? 'Your KYC verification status has been reset by our compliance team. Please log in and resubmit your identity documents to regain full access.'
    : 'Unfortunately your KYC application was not approved. Please resubmit with accurate information or contact support for assistance.';

  const accent = approved ? 'rgba(74,222,128' : reset ? 'rgba(251,191,36' : 'rgba(248,113,113';
  const emoji  = approved ? '🎉' : reset ? '🔄' : '⚠️';
  const label  = approved ? 'Approved' : reset ? 'Reset — Resubmission Required' : 'Rejected';

  resend.emails.send({
    from: FROM,
    to: email,
    subject,
    html: baseTemplate(`
      <p style="color:#9ca3af;font-size:14px;margin:0 0 24px">Hi ${name},</p>
      <h2 style="font-size:22px;font-weight:800;margin:0 0 6px">${heading}</h2>
      <p style="color:#9ca3af;font-size:14px;margin:0 0 28px">${body}</p>
      <div style="background:${accent},0.06);border:1px solid ${accent},0.2);border-radius:12px;padding:20px;margin-bottom:28px;text-align:center">
        <span style="font-size:32px">${emoji}</span>
        <p style="color:${accent},1);font-weight:700;font-size:15px;margin:10px 0 0">KYC Status: ${label}</p>
      </div>
      <p style="color:#6b7280;font-size:12px;text-align:center;margin:0">
        Questions? Contact us at <a href="mailto:swiftbitsuport@outlook.com" style="color:#4ade80;text-decoration:none">swiftbitsuport@outlook.com</a>
      </p>
    `),
  }).catch(console.error);
}

export async function sendEmailVerificationEmail(email, name, otp) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your SwiftBit account',
    html: baseTemplate(`
      <h2 style="font-size:20px;font-weight:700;margin:0 0 8px;text-align:center">Welcome, ${name}!</h2>
      <p style="color:#9ca3af;font-size:14px;text-align:center;margin:0 0 28px">
        Enter the code below to verify your email and activate your account. It expires in <strong style="color:#fff">15 minutes</strong>.
      </p>
      <div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:28px;text-align:center;margin-bottom:28px">
        <span style="font-size:44px;font-weight:900;letter-spacing:14px;color:#4ade80">${otp}</span>
      </div>
      <p style="color:#6b7280;font-size:12px;text-align:center;margin:0">
        If you did not create a SwiftBit account, you can safely ignore this email.
      </p>
    `),
  });
}

export async function sendDepositEmail(email, name, qty, symbol, coinName, usdAmount) {
  resend.emails.send({
    from: FROM,
    to: email,
    subject: `You've received ${fmtQty(qty, symbol)} — SwiftBit`,
    html: baseTemplate(`
      <p style="color:#9ca3af;font-size:14px;margin:0 0 24px">Hi ${name},</p>
      <h2 style="font-size:22px;font-weight:800;margin:0 0 6px">Crypto received</h2>
      <p style="color:#9ca3af;font-size:14px;margin:0 0 28px">Your SwiftBit wallet has been credited.</p>

      <div style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15);border-radius:12px;padding:24px;margin-bottom:28px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span style="color:#9ca3af;font-size:13px">Asset</span>
          <span style="color:#fff;font-weight:700">${coinName} (${symbol})</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span style="color:#9ca3af;font-size:13px">Amount received</span>
          <span style="color:#4ade80;font-weight:800;font-size:18px">${fmtQty(qty, symbol)}</span>
        </div>
        ${usdAmount > 0 ? `
        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.06);padding-top:12px">
          <span style="color:#9ca3af;font-size:13px">Approx. value</span>
          <span style="color:#fff;font-weight:600">${fmtUsd(usdAmount)}</span>
        </div>` : ''}
      </div>

      <p style="color:#6b7280;font-size:12px;text-align:center;margin:0">
        This credit is now available in your SwiftBit wallet. Log in to view your balance.
      </p>
    `),
  }).catch(console.error);
}

export async function sendTransactionStatusEmail(email, name, tx) {
  const isApproved = tx.status === 'completed';
  const isRejected = tx.status === 'failed';

  const typeLabel = {
    buy:        'Purchase',
    sell:       'Sale',
    send:       'Withdrawal',
    withdrawal: 'Withdrawal',
    deposit:    'Deposit',
    swap:       'Swap',
  }[tx.type] || 'Transaction';

  const statusColor  = isApproved ? '#4ade80' : isRejected ? '#f87171' : '#facc15';
  const statusLabel  = isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending';
  const subject      = isApproved
    ? `Your ${typeLabel.toLowerCase()} has been approved — SwiftBit`
    : `Transaction update — SwiftBit`;

  const detailRows = [
    ['Type',   typeLabel],
    ['Asset',  `${tx.coin} (${tx.symbol})`],
    tx.qty  ? ['Quantity', fmtQty(tx.qty, tx.symbol)] : null,
    tx.amount ? ['Value',  fmtUsd(tx.amount)]          : null,
    ['Status', statusLabel],
  ].filter(Boolean);

  resend.emails.send({
    from: FROM,
    to: email,
    subject,
    html: baseTemplate(`
      <p style="color:#9ca3af;font-size:14px;margin:0 0 24px">Hi ${name},</p>
      <h2 style="font-size:22px;font-weight:800;margin:0 0 6px">${typeLabel} ${statusLabel.toLowerCase()}</h2>
      <p style="color:#9ca3af;font-size:14px;margin:0 0 28px">
        ${isApproved
          ? `Your ${typeLabel.toLowerCase()} has been approved and your wallet has been updated.`
          : isRejected
          ? `Your ${typeLabel.toLowerCase()} has been rejected. No funds have been moved.`
          : `Your ${typeLabel.toLowerCase()} is being processed.`}
      </p>

      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;margin-bottom:28px">
        ${detailRows.map(([label, value], i) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px;${i > 0 ? 'border-top:1px solid rgba(255,255,255,0.05)' : ''}">
            <span style="color:#9ca3af;font-size:13px">${label}</span>
            <span style="color:${label === 'Status' ? statusColor : '#fff'};font-weight:${label === 'Status' ? '700' : '600'};font-size:13px">${value}</span>
          </div>
        `).join('')}
      </div>

      <p style="color:#6b7280;font-size:12px;text-align:center;margin:0">
        Questions? Contact us at <a href="mailto:swiftbitsuport@outlook.com" style="color:#4ade80;text-decoration:none">swiftbitsuport@outlook.com</a>
      </p>
    `),
  }).catch(console.error);
}
