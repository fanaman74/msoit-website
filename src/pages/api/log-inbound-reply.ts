import type { APIRoute } from 'astro';

const WEBHOOK_SECRET = import.meta.env.ZAPIER_WEBHOOK_SECRET || process.env.ZAPIER_WEBHOOK_SECRET || '';

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('x-webhook-secret') || '';
  if (WEBHOOK_SECRET && authHeader !== WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const rawFrom   = (body.from_email  || '').trim();
  const inReplyTo = (body.in_reply_to || '').trim();
  const subject   = (body.subject     || '(no subject)').trim();
  // Strip quoted reply chain — everything from "On ... wrote:" onwards
  const rawBody = (body.body || '').trim();
  const message = rawBody.replace(/\r\n/g, '\n').split(/\n(?=On .+wrote:)/)[0].trim();

  // Extract plain email from "Name <email>" format
  const emailMatch = rawFrom.match(/<([^>]+)>/) || rawFrom.match(/([^\s]+@[^\s]+)/);
  const fromEmail  = (emailMatch ? emailMatch[1] : rawFrom).toLowerCase();

  if (!fromEmail) {
    return new Response(JSON.stringify({ error: 'from_email required' }), { status: 400 });
  }

  const supabaseUrl    = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), { status: 500 });
  }

  const base = supabaseUrl.replace(/\/$/, '');
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };

  let leadId: string | null = null;

  // 1. Try matching via In-Reply-To message ID (most accurate)
  if (inReplyTo) {
    const replyRes = await fetch(
      `${base}/rest/v1/lead_replies?message_id=eq.${encodeURIComponent(inReplyTo)}&order=sent_at.desc&limit=1&select=lead_id`,
      { headers }
    );
    if (replyRes.ok) {
      const rows: { lead_id: string }[] = await replyRes.json();
      if (rows.length) leadId = rows[0].lead_id;
    }
  }

  // 2. Fall back to matching by sender email address
  if (!leadId) {
    const leadRes = await fetch(
      `${base}/rest/v1/lead_submissions?email=ilike.${encodeURIComponent(fromEmail)}&order=submitted_at.desc&limit=1&select=id`,
      { headers }
    );
    if (leadRes.ok) {
      const leads: { id: string }[] = await leadRes.json();
      if (leads.length) leadId = leads[0].id;
    }
  }

  if (!leadId) {
    return new Response(JSON.stringify({ ok: false, reason: 'no_matching_lead' }), { status: 200 });
  }

  const insertRes = await fetch(`${base}/rest/v1/lead_replies`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify({ lead_id: leadId, subject, message, direction: 'inbound' }),
  });

  if (!insertRes.ok) {
    const err = await insertRes.text();
    console.error('[log-inbound-reply] Insert failed:', err);
    return new Response(JSON.stringify({ error: 'Failed to store reply' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, lead_id: leadId }), { status: 200 });
};
