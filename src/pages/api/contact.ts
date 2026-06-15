import type { APIRoute } from 'astro';
import { Resend } from 'resend';

interface ContactForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  area: string;
  message: string;
  language?: string;
  page_url?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const jsonHeaders = { 'Content-Type': 'application/json' };

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim();
  return request.headers.get('x-real-ip') || null;
}

async function storeLead(submission: ContactForm & {
  submitted_at: string;
  user_agent: string | null;
  ip_address: string | null;
}) {
  const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('[Contact Form] Supabase env vars are missing. Lead was not stored in database.');
    return { stored: false, reason: 'missing_supabase_config' };
  }

  const endpoint = `${String(supabaseUrl).replace(/\/$/, '')}/rest/v1/lead_submissions`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      ...jsonHeaders,
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(submission),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[Contact Form] Supabase insert failed', {
      status: res.status,
      body: errorText,
    });
    throw new Error('Lead storage failed.');
  }

  return { stored: true };
}

async function sendConfirmationEmail({
  name, email, company, phone, area, message,
}: { name: string; email: string; company: string; phone: string; area: string; message: string }) {
  const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Contact Form] RESEND_API_KEY missing — confirmation email not sent.');
    return;
  }

  const resend = new Resend(apiKey);

  const rows = [
    company && `<tr><td style="padding:6px 0;color:#777;font-size:13px;width:120px;">Company</td><td style="padding:6px 0;font-size:13px;">${company}</td></tr>`,
    phone   && `<tr><td style="padding:6px 0;color:#777;font-size:13px;">Phone</td><td style="padding:6px 0;font-size:13px;">${phone}</td></tr>`,
    area    && `<tr><td style="padding:6px 0;color:#777;font-size:13px;">Area</td><td style="padding:6px 0;font-size:13px;">${area}</td></tr>`,
  ].filter(Boolean).join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:24px 32px;border-bottom:3px solid #ff4f00;">
            <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:.05em;">MSOIT</span>
            <span style="color:#ff4f00;font-size:11px;font-weight:600;margin-left:12px;">Making Sense of IT</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;border:1px solid #e5e5e5;border-top:none;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Thanks, ${name}.</p>
            <p style="margin:0 0 24px;font-size:15px;color:#444444;line-height:1.6;">
              Your request has been received. I'll review the details and be in touch within <strong>1–2 business days</strong>.
            </p>

            <!-- Divider -->
            <div style="border-top:1px solid #eeeeee;margin-bottom:24px;"></div>

            <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:.08em;color:#111111;text-transform:uppercase;">Your submission</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              ${rows}
              ${message ? `
              <tr>
                <td style="padding:12px 0 6px;color:#777;font-size:13px;vertical-align:top;width:120px;">Message</td>
                <td style="padding:12px 0 6px;font-size:13px;"></td>
              </tr>
              <tr>
                <td colspan="2" style="padding:12px 16px;background:#f9f9f9;border-left:3px solid #ff4f00;font-size:13px;color:#333;line-height:1.6;">${message.replace(/\n/g, '<br>')}</td>
              </tr>` : ''}
            </table>

            <!-- Divider -->
            <div style="border-top:1px solid #eeeeee;margin:28px 0 24px;"></div>

            <p style="margin:0;font-size:13px;color:#777777;line-height:1.6;">
              If you have any additional information to share in the meantime, reply directly to this email.<br><br>
              — Fred<br>
              <span style="color:#ff4f00;font-weight:600;">MSOIT</span> · msoit.eu
            </p>
          </td>
        </tr>

        <!-- Footer -->
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
    await resend.emails.send({
      from: 'MSOIT <hello@msoit.eu>',
      to: email,
      replyTo: 'hello@msoit.eu',
      subject: `Got your request, ${name} — MSOIT`,
      html,
    });
    console.log('[Contact Form] Confirmation email sent to', email);
  } catch (err) {
    console.error('[Contact Form] Resend error:', err);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const company = String(data.company || '').trim();
    const phone = String(data.phone || '').trim();
    const area = String(data.area || '').trim();
    const message = String(data.message || '').trim();
    const language = String(data.language || '').trim().slice(0, 8);
    const page_url = String(data.page_url || '').trim().slice(0, 1024);
    const referrer = String(data.referrer || '').trim().slice(0, 1024);
    const utm_source = String(data.utm_source || '').trim().slice(0, 255);
    const utm_medium = String(data.utm_medium || '').trim().slice(0, 255);
    const utm_campaign = String(data.utm_campaign || '').trim().slice(0, 255);
    const utm_term = String(data.utm_term || '').trim().slice(0, 255);
    const utm_content = String(data.utm_content || '').trim().slice(0, 255);

    if (!name) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name is required.' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'A valid email address is required.' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const submission = {
      name,
      company,
      email,
      phone,
      area,
      message,
      language,
      page_url,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      user_agent: request.headers.get('user-agent'),
      ip_address: getClientIp(request),
      submitted_at: new Date().toISOString(),
    };

    console.log('[Contact Form Submission]', JSON.stringify(submission, null, 2));
    const storage = await storeLead(submission);
    await sendConfirmationEmail({ name, email, company, phone, area, message });

    return new Response(
      JSON.stringify({
        success: true,
        stored: storage.stored,
        message: 'Thank you! Your request has been received. I will be in touch within 1–2 business days.',
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err) {
    console.error('[Contact Form Error]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong. Please try again or email directly.' }),
      { status: 500, headers: jsonHeaders }
    );
  }
};
