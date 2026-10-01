-- Envoie un e-mail (via l'Edge Function notify-contact) à chaque nouvelle demande de contact.
-- À coller dans Supabase → SQL Editor → Run (projet DevSurMesure).

create extension if not exists pg_net with schema extensions;

alter table public.contact_submissions add column if not exists notified_at timestamptz;

create or replace function public.notify_contact_submission()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform net.http_post(
    url := 'https://zhzxsrjctdpntbqtsdts.supabase.co/functions/v1/notify-contact',
    body := jsonb_build_object('id', new.id),
    headers := '{"Content-Type": "application/json"}'::jsonb,
    timeout_milliseconds := 5000
  );
  return new;
end;
$$;

revoke all on function public.notify_contact_submission() from public, anon, authenticated;

drop trigger if exists contact_submissions_notify on public.contact_submissions;
create trigger contact_submissions_notify
  after insert on public.contact_submissions
  for each row execute function public.notify_contact_submission();
