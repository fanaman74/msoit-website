create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  submitted_at timestamptz not null,
  name text not null,
  company text,
  email text not null,
  phone text,
  area text,
  message text,
  language text,
  page_url text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  user_agent text,
  ip_address text,
  status text not null default 'new',
  notes text
);

alter table public.lead_submissions enable row level security;

create policy "No public lead reads"
  on public.lead_submissions
  for select
  using (false);

create index if not exists lead_submissions_created_at_idx
  on public.lead_submissions (created_at desc);

create index if not exists lead_submissions_email_idx
  on public.lead_submissions (email);

create index if not exists lead_submissions_status_idx
  on public.lead_submissions (status);
