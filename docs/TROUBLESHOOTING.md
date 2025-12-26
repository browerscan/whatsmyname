# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the whatsmyname application.

## Table of Contents

- [API Issues](#api-issues)
- [Build Errors](#build-errors)
- [Runtime Errors](#runtime-errors)
- [Search Problems](#search-problems)
- [Deployment Issues](#deployment-issues)

---

## API Issues

### WhatsMyName API Not Responding

**Symptoms:**

- Search results don't appear
- "WhatsMyName search failed" error message
- Results stream stops unexpectedly

**Solutions:**

1. **Verify API Key**

   ```bash
   # Check if API key is set
   echo $WHATSMYNAME_API_KEY
   ```

2. **Test API Directly**

   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.whatsmyname.app/v1/search?username=test"
   ```

3. **Check API Status**
   - Visit the WhatsMyName API status page
   - Verify service availability

4. **Restart Development Server**
   ```bash
   # Stop server (Ctrl+C) and restart
   npm run dev
   ```

### Google Custom Search Quota Exceeded

**Symptoms:**

- Google search returns errors
- "Google search failed" message
  - Quota limit warnings

**Solutions:**

1. **Check Quota Usage**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to APIs & Services > Dashboard
   - Check Custom Search API usage

2. **Add Multiple API Keys**

   ```env
   # .env.local - Add multiple keys for rotation
   GOOGLE_CUSTOM_SEARCH_API_KEYS=key1,key2,key3
   ```

3. **Increase Quota**
   - Go to Google Cloud Console > APIs & Services > Quotas
   - Request quota increase for Custom Search API

### AI Analysis Not Working

**Symptoms:**

- AI button doesn't respond
- "Failed to get AI response" error
- AI analysis times out

**Solutions:**

1. **Verify OpenRouter API Key**

   ```bash
   # Check if API key is set
   echo $OPENROUTER_API_KEY
   ```

2. **Test OpenRouter Connection**

   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://openrouter.ai/api/v1/models"
   ```

3. **Check Model Availability**
   ```env
   # .env.local - Verify model setting
   OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free
   ```

---

## Build Errors

### TypeScript Compilation Errors

**Symptoms:**

- Build fails with TypeScript errors
- Type errors in VS Code

**Solutions:**

1. **Run TypeScript Check**

   ```bash
   npm run build
   ```

2. **Fix Type Errors**
   - Read error messages carefully
   - Add proper type annotations
   - Check imports and exports

3. **Clear Build Cache**
   ```bash
   rm -rf .next
   npm run build
   ```

### Module Not Found Errors

**Symptoms:**

- "Module not found" errors during build
- Import statement failures

**Solutions:**

1. **Reinstall Dependencies**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check File Paths**
   - Verify import paths are correct
   - Use relative imports appropriately
   - Check for case sensitivity

3. **Verify tsconfig Paths**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

---

## Runtime Errors

### Page Not Found (404)

**Symptoms:**

- Seeing 404 errors on valid routes
- Pages not loading after deployment

**Solutions:**

1. **Check Route Configuration**
   - Verify file structure in `app/` directory
   - Ensure `[locale]` dynamic route is correct

2. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear browser cache completely

3. **Verify Deployment**
   ```bash
   # Check if build succeeded
   npm run build
   ```

### Hydration Mismatch Errors

**Symptoms:**

- "Hydration failed" errors in console
- Content flickers on page load

**Solutions:**

1. **Check Server/Client Consistency**
   - Ensure `useEffect` for client-only logic
   - Use `useState` properly
   - Check conditional rendering

2. **Add Suppress Hydration Warning (if appropriate)**
   ```tsx
   <div suppressHydrationWarning>
     {typeof window !== "undefined" && clientOnlyData}
   </div>
   ```

---

## Search Problems

### No Results Returned

**Symptoms:**

- Search completes but shows no results
- All platforms show "Not Found"

**Possible Causes:**

1. Username may not exist on any checked platforms
2. Username formatting issue
3. API connection problem

**Solutions:**

1. **Try a Common Username**
   - Search for "test" or "admin"
   - Verify tool is working correctly

2. **Check Username Format**
   - No spaces allowed
   - Only letters, numbers, underscores, hyphens
   - Minimum 3 characters

3. **Verify Network Connection**
   - Check internet connectivity
   - Try a different browser

### Slow Search Performance

**Symptoms:**

- Search takes a long time to complete
- Results stream very slowly

**Solutions:**

1. **Check Network Speed**
   - Run speed test
   - Try different network

2. **Filter Results**
   - Use status filters to focus on found results
   - Filter by category

3. **Check API Response Times**
   - Slow results may indicate API throttling
   - Consider rate limiting

---

## Deployment Issues

### Environment Variables Missing

**Symptoms:**

- API calls fail in production
- Features not working after deployment

**Solutions:**

1. **Verify Environment Variables**

   ```bash
   # For Vercel
   vercel env ls

   # For Cloudflare Pages
   # Check dashboard > Settings > Environment variables
   ```

2. **Add Missing Variables**
   - Go to deployment platform dashboard
   - Add all required environment variables
   - Redeploy application

3. **Use Correct Variable Names**
   ```env
   # Required variables
   WHATSMYNAME_API_KEY
   GOOGLE_CUSTOM_SEARCH_API_KEYS
   GOOGLE_CUSTOM_SEARCH_CX
   OPENROUTER_API_KEY
   ```

### Build Fails During Deployment

**Symptoms:**

- Deployment fails during build step
- Build errors in deployment logs

**Solutions:**

1. **Test Build Locally**

   ```bash
   npm run build
   ```

2. **Check Node Version**

   ```bash
   # Verify Node version
   node --version  # Should be 20.9+
   ```

3. **Review Deployment Logs**
   - Check GitHub Actions logs
   - Check Vercel/Cloudflare build logs
   - Address specific errors

---

## Getting Additional Help

If you continue to experience issues:

1. **Check GitHub Issues**
   - Search existing issues
   - Create new issue with details

2. **Enable Debug Mode**

   ```env
   # .env.local
   DEBUG=true
   NODE_ENV=development
   ```

3. **Provide Diagnostic Information**
   - Error messages (full text)
   - Steps to reproduce
   - Environment details (OS, Node version, browser)
   - Screenshots if applicable

---

## Common Error Messages Reference

| Error Message             | Cause                       | Solution                        |
| ------------------------- | --------------------------- | ------------------------------- |
| `NEXT_PUBLIC_NOT_DEFINED` | Missing public env variable | Add to `.env.local` and rebuild |
| `Module not found`        | Import path issue           | Check file path and restructure |
| `404 Not Found`           | Route doesn't exist         | Check app directory structure   |
| `Hydration failed`        | Server/client mismatch      | Review conditional rendering    |
| `API rate limit exceeded` | Too many API calls          | Wait or add more API keys       |
| `Invalid API key`         | Incorrect or expired key    | Verify and update API key       |
