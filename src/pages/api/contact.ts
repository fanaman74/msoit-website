import type { APIRoute } from 'astro';

interface ContactForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  area: string;
  message: string;
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

    // Validate required fields
    if (!name) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'A valid email address is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Store submission (can be extended to send email via SMTP/API)
    const submission: ContactForm & { submittedAt: string } = {
      name,
      company,
      email,
      phone,
      area,
      message,
      submittedAt: new Date().toISOString(),
    };

    // Log submission — replace with email service or database when ready
    console.log('[Contact Form Submission]', JSON.stringify(submission, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Your request has been received. I will be in touch within 1–2 business days.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[Contact Form Error]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong. Please try again or email directly.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
