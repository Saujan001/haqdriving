// ============================================
// PROJECT CONFIGURATION
// Client: Driving School Sydney (Demo)
// Supabase Project: Drivingschool
// Supabase Region: Singapore
// Vercel Project: drivingschoolsydney
// Credentials loaded from: /api/config
// Last Updated: June 2026
// ============================================
// Serves public Supabase credentials to frontend HTML files.
// These are public values (anon key + URL) protected by RLS — safe to expose.

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY
  });
}
