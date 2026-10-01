/**
 * notify-contact — Edge Function triggered by a database webhook on contact_submissions inserts.
 * Emails each new lead to the owner through Resend.
 *
 * Access model (verify_jwt disabled): the request body only carries a row id. The function
 * atomically claims that row (exists, < 10 minutes old, not yet notified) with the service role,
 * so a forged call can never send mail for anything other than a genuine, fresh submission.
 */
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const NOTIFY_TO = 'contact98hicham@gmail.com';
const NOTIFY_FROM = 'DevSurMesure <onboarding@resend.dev>';
const FRESHNESS_MS = 10 * 60 * 1000;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json(405, { error: 'Method Not Allowed' });
  if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: 'Missing server configuration' });
  }

  let id: unknown;
  try {
    ({ id } = await req.json());
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }
  if (typeof id !== 'string' || !UUID_REGEX.test(id)) return json(400, { error: 'Invalid id' });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  // Atomic claim: only one call can flip notified_at from null for a fresh row
  const { data: row, error: claimError } = await supabase
    .from('contact_submissions')
    .update({ notified_at: new Date().toISOString() })
    .eq('id', id)
    .is('notified_at', null)
    .gte('created_at', new Date(Date.now() - FRESHNESS_MS).toISOString())
    .select('id, name, email, phone, need, message, created_at')
    .maybeSingle();

  if (claimError) {
    console.error('Claim failed:', claimError);
    return json(500, { error: 'Database error' });
  }
  if (!row) return json(200, { skipped: true });

  const receivedAt = new Date(row.created_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  const text =
    `Nouvelle demande reçue depuis devsurmesure.com\n\n` +
    `Nom : ${row.name}\n` +
    `Email : ${row.email}\n` +
    `Téléphone : ${row.phone ?? 'Non renseigné'}\n` +
    `Besoin : ${row.need ?? 'Non précisé'}\n` +
    `Reçue le : ${receivedAt}\n\n` +
    `Message :\n${row.message}\n\n` +
    `— Répondez directement à cet email pour contacter ${row.name}.`;

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        reply_to: row.email,
        subject: `Nouvelle demande : ${row.name}${row.need ? ` — ${row.need}` : ''}`.slice(0, 200),
        text
      })
    });

    if (!resendResponse.ok) {
      throw new Error(`Resend ${resendResponse.status}: ${await resendResponse.text()}`);
    }
  } catch (sendError) {
    console.error('Email dispatch failed:', sendError);
    // Release the claim so a retry can send it
    await supabase.from('contact_submissions').update({ notified_at: null }).eq('id', row.id);
    return json(502, { error: 'Email dispatch failed' });
  }

  return json(200, { sent: true });
});
