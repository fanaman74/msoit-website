import type { APIRoute } from 'astro';

// Shared secret so only Zapier can post here — set ZAPIER_WEBHOOK_SECRET in Railway env vars
const WEBHOOK_SECRET = import.meta.env.ZAPIER_WEBHOOK_SECRET || process.env.ZAPIER_WEBHOOK_SECRET || '';

export const POST: APIRoute = async ({ request }) => {
  // Verify secret if configured
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

  // Extract plain email from "Name <email@example.com>" format
  const rawFrom = (body.from_email || '').trim();
  const emailMatch = rawFrom.match(/<([^>]+)>/) || rawFrom.match(/([^\s]+@[^\s]+)/);
  const fromEmail = (emailMatch ? emailMatch[1] : rawFrom).toLowerCase();
  const subject   = (body.subject   || '(no subject)').trim();
  const message   = (body.body      || '').trim();

  if (!fromEmail) {
    return new Response(JSON.stringify({ error: 'from_email required' }), { status: 400 });
  }

  const supabaseUrl     = import.meta.env.SUPABASE_URL     || process.env.SUPABASE_URL;
  const serviceRoleKey  = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), { status: 500 });
  }

  const base = supabaseUrl.replace(/\/$/, '');
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };

  // Find lead by email address
  const leadRes = await fetch(
    `${base}/rest/v1/lead_submissions?email=eq.${encodeURIComponent(fromEmail)}&order=submitted_at.desc&limit=1`,
    { headers }
  );

  if (!leadRes.ok) {
    return new Response(JSON.stringify({ error: 'Failed to query leads' }), { status: 500 });
  }

  const leads: { id: string }[] = await leadRes.json();

  if (!leads.length) {
    // No matching lead — still return 200 so Zapier doesn't retry
    return new Response(JSON.stringify({ ok: false, reason: 'no_matching_lead' }), { status: 200 });
  }

  const leadId = leads[0].id;

  // Store inbound reply
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
