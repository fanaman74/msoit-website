import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const COOKIE_NAME = 'msoit_admin';
const TOKEN = Buffer.from('Manchester74!!!').toString('base64');

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get(COOKIE_NAME)?.value !== TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { to, name, subject, message, leadId } = await request.json();

  if (!to || !subject || !message) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Email not configured' }), { status: 500 });
  }

  const resend = new Resend(apiKey);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#111111;padding:24px 32px;border-bottom:3px solid #ff4f00;">
            <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:.05em;">MSOIT</span>
            <span style="color:#ff4f00;font-size:11px;font-weight:600;margin-left:12px;">Making Sense of IT</span>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:32px;border:1px solid #e5e5e5;border-top:none;">
            ${name ? `<p style="margin:0 0 20px;font-size:15px;color:#444;">Hi ${name},</p>` : ''}
            <div style="font-size:15px;color:#333333;line-height:1.7;white-space:pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
            <div style="border-top:1px solid #eeeeee;margin:28px 0 24px;"></div>
            <p style="margin:0;font-size:13px;color:#777777;line-height:1.6;">
              — Fred<br>
              <span style="color:#ff4f00;font-weight:600;">MSOIT</span> · msoit.eu
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#aaaaaa;">
              © ${new Date().getFullYear()} MSOIT — Making Sense of IT &nbsp;·&nbsp; Belgium
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const sent = await resend.emails.send({
      from: 'MSOIT <hello@msoit.eu>',
      to,
      replyTo: 'hello@msoit.eu',
      subject,
      html,
    });

    // Store reply in Supabase if leadId provided
    if (leadId) {
      const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
      const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && serviceRoleKey) {
        // Resend returns message ID formatted as UUID — store with angle brackets as per RFC 5322
        const messageId = sent.data?.id ? `<${sent.data.id}@resend.dev>` : null;
        await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/lead_replies`, {
          method: 'POST',
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ lead_id: leadId, subject, message, direction: 'outbound', message_id: messageId }),
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('[Admin Reply] Resend error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
};
