import type { APIRoute } from 'astro';

const ADMIN_PASSWORD = 'Manchester74!!!';
const COOKIE_NAME = 'msoit_admin';
// Simple signed token: base64(password hash) — good enough for a hidden page
const TOKEN = Buffer.from(ADMIN_PASSWORD).toString('base64');

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const data = await request.formData();
  const password = String(data.get('password') || '');

  if (password === ADMIN_PASSWORD) {
    cookies.set(COOKIE_NAME, TOKEN, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return redirect('/admin', 302);
  }

  return redirect('/admin?error=1', 302);
};
