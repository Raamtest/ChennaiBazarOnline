const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lqsswdliviecpudrebno.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxc3N3ZGxpdmllY3B1ZHJlYm5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTYyMzkzNiwiZXhwIjoyMDY1MTk5OTM2fQ.S36zmWOW1EcBt6DF7iXkUtg3LhGJ9q2ax_JtQrQVdps'
);

async function test() {
  const email = `testuser${Date.now()}@example.com`;
  const password = "TestPassword123!"; // Strong password

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error('Supabase admin API error:', error);
  } else {
    console.log('Supabase admin API success:', data);
  }
}

test();