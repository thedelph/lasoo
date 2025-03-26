-- Check if test user and profile already exist
do $$
declare
  test_user_id uuid := '11111111-1111-1111-1111-111111111111';
begin
  -- Only proceed if neither user nor profile exists
  if not exists (select 1 from auth.users where id = test_user_id) 
     and not exists (select 1 from public.profiles where id = test_user_id) then
    
    -- Insert test user
    insert into auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data
    ) values (
      test_user_id,
      'test@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      jsonb_build_object('company_name', 'Test Locksmith Ltd')
    );

    -- The profile will be created automatically via the handle_new_user trigger
    -- No need to manually insert the profile as it's handled by the trigger
    
  end if;
end $$;