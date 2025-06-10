# Troubleshooting Guide for Supabase-Clerk Integration

## Common Errors and Solutions

### Authentication Errors

#### JWSError JWSInvalidSignature

**Error Message:**
```
JWSError JWSInvalidSignature
```

**Cause:**
The JWT token from Clerk doesn't have a valid signature that Supabase can verify.

**Solutions:**
1. Verify that your Clerk JWT template includes the correct claims:
   ```json
   {
     "sub": "{{user.id}}",
     "role": "authenticated",
     "email": "{{user.primary_email_address}}"
   }
   ```
2. Check that the JWT signing secret in Clerk matches what Supabase expects
3. Ensure the token is being passed correctly to Supabase

#### No Token Received

**Error Message:**
```
Failed to get Supabase token
```

**Cause:**
Clerk is not providing a token when requested.

**Solutions:**
1. Check that the Clerk instance is properly initialized
2. Verify that the user is authenticated before requesting a token
3. Make sure the JWT template exists in Clerk

### Row Level Security (RLS) Errors

#### Row Level Security Policy Violation

**Error Message:**
```
new row violates row-level security policy for table "profiles"
```

**Cause:**
The user is trying to access or modify data that they don't have permission to under the RLS policies.

**Solutions:**
1. Verify that the RLS policies are correctly set up:
   ```sql
   CREATE POLICY "Users can read their own profile" 
   ON profiles FOR SELECT 
   USING (id = auth.uid()::text);
   ```
2. Check that the user ID in the JWT token matches the ID in the database
3. Ensure that type conversion is being handled correctly (UUID to text)

#### Duplicate Key Violation

**Error Message:**
```
duplicate key value violates unique constraint "profiles_pkey"
```

**Cause:**
Trying to create a profile with an ID that already exists in the database.

**Solutions:**
1. Implement an "upsert" pattern to check if a profile exists before creating it:
   ```typescript
   const { data: existingProfile } = await supabaseClient
     .from('profiles')
     .select('*')
     .eq('id', user.id)
     .single();

   if (!existingProfile) {
     // Only create if it doesn't exist
     // ...
   }
   ```
2. Use Supabase's `upsert` method if appropriate for your use case

## Debugging Techniques

### Using the debug_auth_state Function

Call this function to see the current authentication state:

```typescript
const { data: debugData } = await supabaseClient.rpc('debug_auth_state');
console.log('Auth debug info:', debugData);
```

The output will show:
- The current user ID from `auth.uid()`
- The data type of `auth.uid()`
- The current auth role
- The role from the JWT claims

### Temporary Permissive Policy

For debugging purposes only, you can temporarily create a permissive policy:

```sql
-- TEMPORARY DEBUG POLICY - REMOVE IN PRODUCTION
CREATE POLICY "Debug policy - allow all operations"
ON profiles
USING (true)
WITH CHECK (true);
```

**Important:** Always remove this policy before deploying to production!

## Database Structure Changes

### Metadata Column Migration

**Issue:**
As of May 2025, the `metadata` JSONB column from the `users` table has been moved to a dedicated `user_metadata` table. This might cause issues if code directly references the old column structure.

**Symptoms:**
- Missing profile information (address, website, etc.)
- Errors when updating user profiles
- Android app registration/login issues

**Solutions:**
1. Update any code that directly accesses the `metadata` column to use the new `user_metadata` table instead
2. Use proper join syntax when querying user data:
   ```typescript
   const { data } = await supabase
     .from('users')
     .select(`
       *,
       user_metadata (id, website, address_line1, address_line2, city, county, country)
     `)
     .filter('user_id', 'eq', userId);
   ```
3. For more details, refer to the [Metadata Migration Guide](./metadata-migration-guide.md)

## Performance Considerations

### Multiple Supabase Client Instances

**Warning Message:**
```
Multiple GoTrueClient instances detected in the same browser context
```

**Cause:**
Creating multiple Supabase client instances in the same application.

**Solutions:**
1. Create a single Supabase client instance and reuse it
2. If you need different auth contexts, use a state management solution to track the current auth state

### JWT Token Caching

To improve performance, consider caching the JWT token:

```typescript
// Only skip cache when necessary
const token = await getToken({ 
  template: 'supabase',
  skipCache: false  // Allow caching when appropriate
});
```

## Deployment Issues

### 404 Errors on Vercel Deployment

**Error Message:**
```
NOT_FOUND
The requested resource was not found. This is a deployment error.
```

**Cause:**
When deploying a single-page application (SPA) to Vercel, direct requests to routes like `/sign-in/factor-one` result in 404 errors because Vercel is looking for actual files at those paths.

**Solutions:**
1. Ensure your `vercel.json` file is correctly configured:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
2. Verify that the `vercel.json` file is included in your Git repository and not in `.gitignore`
3. Remove any conflicting deployment configurations (e.g., `netlify.toml` or `_redirects` files)
4. Check Vercel deployment logs for any build or configuration errors

### Clerk Authentication Route Issues

**Error Message:**
```
404 error when accessing /sign-in/factor-one
```

**Cause:**
Clerk's authentication flow uses specific routes like `/sign-in/factor-one` for multi-factor authentication, which need to be properly handled in the deployment configuration.

**Solutions:**
1. Ensure the Clerk `SignIn` component has the correct props:
   ```tsx
   <SignIn routing="path" path="/sign-in" />
   ```
2. Configure Vercel to handle all routes with the rewrite rule in `vercel.json`
3. Test the authentication flow locally before deploying to production

### Environment Variable Issues

**Error Message:**
```
Clerk: Missing publishable key
```

**Cause:**
Environment variables are not properly set in the Vercel deployment.

**Solutions:**
1. Verify that all required environment variables are set in your Vercel project settings
2. Check that the variable names match what your application expects
3. Ensure that the environment variables are accessible during build time if needed

## Locksmith Search Issues

### Intermittent "No Locksmiths Found" Error

**Error Description:**
When clicking "View Home Locksmiths" button, the search occasionally returns "No Locksmiths Found" even when locksmiths exist in the area. Users may need to click the button multiple times before results appear.

**Cause:**
This was caused by a race condition where the results pane was rendering before the search completed, showing empty results prematurely.

**Solution Applied:**
1. **Fixed race condition in state management:**
   - Moved `setHasSearched(true)` to only execute after search completes
   - This prevents the ResultsPane from rendering with empty results while search is in progress

2. **Added retry logic to database queries:**
   - Both users and locations queries now retry up to 3 times with exponential backoff
   - Helps handle transient database connection issues

3. **Added retry logic to geocoding API calls:**
   - Mapbox geocoding requests retry on server errors (5xx status codes)
   - Uses same exponential backoff pattern (1s, 2s, 3s)

4. **Fixed Supabase client configuration:**
   - Enabled `autoRefreshToken` and `persistSession` for better connection stability
   - Prevents authentication session timeouts

5. **Made mapboxToken initialization synchronous:**
   - Prevents race conditions during component initialization
   - Ensures token is available immediately when needed

**Code Changes:**
- `src/hooks/useLocksmiths.ts`: Added retry logic to database queries and geocoding
- `src/components/LocksmithFinder.tsx`: Fixed race condition in search state management
- `src/utils/supabase.ts`: Enabled session persistence and auto-refresh
- `src/hooks/useMapbox.ts`: Made token initialization synchronous

## Security Best Practices

1. **Least Privilege:** Only grant the minimum permissions necessary in RLS policies
2. **Type Safety:** Always handle type conversions explicitly in RLS policies
3. **Error Handling:** Don't expose detailed error messages to users
4. **JWT Claims:** Keep JWT claims minimal and only include what's necessary
5. **Testing:** Test authentication flow with different user scenarios
