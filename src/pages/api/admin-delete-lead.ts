import type { APIRoute } from 'astro';

const COOKIE_NAME = 'msoit_admin';
const TOKEN = Buffer.from('Manchester74!!!').toString('base64');

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get(COOKIE_NAME)?.value !== TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }

  const supabaseUrl    = import.meta.env.SUPABASE_URL    || process.env.SUPABASE_URL;
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

  // Delete replies first (FK constraint)
  await fetch(`${base}/rest/v1/lead_replies?lead_id=eq.${id}`, { method: 'DELETE', headers });

  // Delete lead
  const res = await fetch(`${base}/rest/v1/lead_submissions?id=eq.${id}`, { method: 'DELETE', headers });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Delete failed' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
