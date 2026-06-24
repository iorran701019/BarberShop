import { createBrowserClient } from "@supabase/ssr";

// Cliente Supabase para uso no browser.
// Lê as credenciais das variaveis de ambiente (ver .env.local).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  // Ajuda a diagnosticar quando o .env.local ainda nao foi preenchido.
  console.warn(
    "Supabase: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no .env.local"
  );
}

export function createClient() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}

// Instancia compartilhada, pronta pra uso simples.
export const supabase = createClient();
