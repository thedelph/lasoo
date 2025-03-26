# Supabase-Clerk Integration Documentation

## Overview

This document outlines the integration between Clerk (authentication provider) and Supabase (database) in the Lasoo application, focusing on Row Level Security (RLS) policies and profile management.

## Authentication Flow

1. **Clerk Authentication**: Users authenticate through Clerk
2. **JWT Token**: Clerk provides a JWT token with the user's ID in the `sub` claim
3. **Supabase Authorization**: The JWT token is passed to Supabase for authorization
4. **RLS Policies**: Supabase uses Row Level Security policies to restrict data access based on the user's ID

## Row Level Security (RLS) Policies

The following RLS policies have been implemented for the `profiles` table:

### Policy Configuration

```sql
-- Enable Row Level Security on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
CREATE POLICY "Users can read their own profile" 
ON profiles FOR SELECT 
USING (id = auth.uid()::text);

-- Policy for users to insert their own profile
CREATE POLICY "Users can create their own profile" 
ON profiles FOR INSERT 
WITH CHECK (id = auth.uid()::text);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (id = auth.uid()::text);
```

### Important Notes

- The `profiles` table uses `id` column of type `text` to store user IDs
- Supabase's `auth.uid()` function returns a UUID, so we convert it to text with `auth.uid()::text`
- Each policy ensures users can only access, create, or update their own profile

## Clerk JWT Template

Ensure your Clerk JWT template includes the following claims:

```json
{
  "sub": "{{user.id}}",
  "role": "authenticated",
  "email": "{{user.primary_email_address}}"
}
```

The `sub` claim is critical as it maps to the user ID that Supabase will use for authorization.

## Profile Management Implementation

The profile management logic in `useProfile.ts` follows these steps:

1. **Authentication Setup**:
   ```typescript
   const setupAuth = async () => {
     // Get JWT token from Clerk
     const token = await getToken({ 
       template: 'supabase',
       skipCache: true
     });
     
     // Create Supabase client with auth token
     const authClient = createSupabaseWithAuth(token);
     setSupabaseClient(authClient);
   };
   ```

2. **Profile Loading**:
   ```typescript
   // Check if profile exists
   const { data: existingProfile, error: fetchError } = await supabaseClient
     .from('profiles')
     .select('*')
     .eq('id', user.id)
     .single();

   // Only create if it doesn't exist
   if (!existingProfile) {
     // Create new profile
     const { data: newProfile, error: createError } = await supabaseClient
       .from('profiles')
       .insert([newProfileData])
       .select()
       .single();
   }
   ```

## Debugging Tools

A debugging function has been created to help troubleshoot authentication issues:

```sql
CREATE OR REPLACE FUNCTION public.debug_auth_state()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN jsonb_build_object(
    'auth_uid', auth.uid(),
    'auth_uid_type', pg_typeof(auth.uid())::text,
    'auth_role', auth.role(),
    'current_setting_role', current_setting('request.jwt.claims', true)::jsonb->>'role'
  );
END;
$$;
```

Call this function from your application to see the current authentication state:

```typescript
const { data: debugData } = await supabaseClient.rpc('debug_auth_state');
console.log('Auth debug info:', debugData);
```

## Common Issues and Solutions

### 1. JWSError JWSInvalidSignature

**Cause**: JWT token from Clerk doesn't match what Supabase expects.  
**Solution**: Ensure the JWT template in Clerk is correctly configured.

### 2. Row Level Security Policy Violations

**Cause**: User trying to access data they don't own or type mismatch between `auth.uid()` and `id` column.  
**Solution**: Convert `auth.uid()` to text with `auth.uid()::text` in RLS policies.

### 3. Duplicate Key Violations

**Cause**: Trying to create a profile that already exists.  
**Solution**: Check if profile exists before creating a new one.

## Best Practices

1. **Type Consistency**: Ensure the data type of user IDs is consistent across the application
2. **Error Handling**: Implement proper error handling for authentication and database operations
3. **JWT Claims**: Keep JWT claims minimal and only include what's necessary
4. **Testing**: Test authentication flow with different user scenarios
