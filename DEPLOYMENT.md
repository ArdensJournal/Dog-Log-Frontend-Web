# Deployment Guide for Dog Log Frontend

## Production Environment Setup

### Required Environment Variables in Vercel

You need to set the following environment variables in your Vercel project dashboard:

1. **Go to your Vercel Dashboard**
2. **Select your project** (Dog-Log-Frontend-Web)
3. **Go to Settings > Environment Variables**
4. **Add the following variables:**

#### Backend Configuration
- **Variable Name:** `BACKEND_URL`
- **Value:** `https://your-backend-domain.com/graphql`
- **Environment:** Production

#### Google OAuth Configuration  
- **Variable Name:** `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- **Value:** `1074123819196-61huh092jnf2586drkumr9p81d9ri2fj.apps.googleusercontent.com`
- **Environment:** Production

### Current Issue Resolution

The 500 error on the `/weight` page is caused by the production environment trying to connect to `localhost:3456`, which doesn't exist in Vercel's production environment.

#### Steps to Fix:

1. **Set the correct `BACKEND_URL`** in Vercel environment variables
   - Replace `http://localhost:3456/graphql` with your actual backend URL
   - Ensure it uses HTTPS to avoid mixed content warnings

2. **Update environment variables** for any other services your backend might need

3. **Redeploy** the application after setting environment variables

### Local Development vs Production

- **Local Development:** Uses `.env.local` file with `localhost:3456`
- **Production:** Uses Vercel environment variables with actual backend URL

### Troubleshooting

#### Mixed Content Warnings
These occur when:
- Backend URL uses HTTP instead of HTTPS in production
- Solution: Ensure `BACKEND_URL` uses HTTPS

#### 500 Errors
Usually caused by:
- Missing or incorrect `BACKEND_URL` environment variable
- Backend server not accessible from production environment
- Authentication token issues

#### Authentication Issues
- Tokens are stored in HTTP-only cookies
- Make sure the backend accepts the JWT tokens being sent
- Check that the authentication flow works end-to-end

### Monitoring

The application now includes enhanced logging to help debug production issues:
- Backend URL configuration is logged on startup
- API requests include detailed logging
- Error responses include backend URL for debugging

Check Vercel's Function Logs to see what's happening in production.

### Example Backend URLs

Replace these with your actual backend deployment:

- **Development:** `http://localhost:3456/graphql`
- **Staging:** `https://staging-api.doglog.com/graphql`
- **Production:** `https://api.doglog.com/graphql`

### Post-Deployment Verification

After setting the environment variables and redeploying:

1. Check that weight tracking works
2. Verify no mixed content warnings in browser console
3. Confirm authentication flow works properly
4. Test all API endpoints function correctly
