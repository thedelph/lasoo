import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

export const createClient = (request: NextRequest) => {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          'x-client-info': `nextjs-middleware`,
        },
      },
    }
  );

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
};