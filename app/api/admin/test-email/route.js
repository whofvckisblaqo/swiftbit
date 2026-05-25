import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(req) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { to } = await req.json();
  if (!to) return NextResponse.json({ error: 'to email required' }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const from   = process.env.RESEND_FROM || 'SwiftBit <onboarding@resend.dev>';

  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY is not set in environment variables' }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      subject: 'SwiftBit email test',
      html: '<p>This is a test email from SwiftBit. If you received this, email sending is working correctly.</p>',
    });
    return NextResponse.json({ success: true, resendId: result.data?.id, from, to });
  } catch (err) {
    return NextResponse.json({ error: err.message, from, apiKeyPrefix: apiKey.slice(0, 8) + '...' }, { status: 500 });
  }
}
