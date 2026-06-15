import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ cookies, redirect }) => {
  cookies.delete('msoit_admin', { path: '/' });
  return redirect('/admin', 302);
};
