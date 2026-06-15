import type { APIRoute } from 'astro';

const COOKIE_NAME = 'msoit_admin';
const TOKEN = Buffer.from('Manchester74!!!').toString('base64');

const VALID_STATUSES = ['new', 'contacted', 'closed'];

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get(COOKIE_NAME)?.value !== TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id, status } = await request.json();
  if (!id || !VALID_STATUSES.includes(status)) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  const res = await fetch(
    `${supabaseUrl?.replace(/\/$/, '')}/rest/v1/lead_submissions?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        apikey: serviceRoleKey!,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
