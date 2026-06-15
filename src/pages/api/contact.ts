import type { APIRoute } from 'astro';

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
  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

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
