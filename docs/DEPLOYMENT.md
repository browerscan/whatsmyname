# Deployment Guide for whatismyname

This guide covers deploying the whatismyname application to Cloudflare Pages with GitHub Actions CI/CD.

## Prerequisites

- GitHub account with repository access
- Cloudflare account (Account ID: `9cb8d6ec0f6094cf4f0cd6b3ee5a17a3`)
- Required API keys (WhatsMyName, Google Custom Search, OpenRouter)

## Step 1: Configure GitHub Secrets

Navigate to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**.

Add the following repository secrets:

### Required Secrets

| Secret Name                     | Description                          | Example                            |
| ------------------------------- | ------------------------------------ | ---------------------------------- |
| `CLOUDFLARE_API_TOKEN`          | Cloudflare API token for deployments | `your_cloudflare_api_token`        |
| `CLOUDFLARE_ACCOUNT_ID`         | Your Cloudflare account ID           | `9cb8d6ec0f6094cf4f0cd6b3ee5a17a3` |
| `WHATSMYNAME_API_KEY`           | WhatsMyName API key                  | `your_whatsmyname_key`             |
| `GOOGLE_CUSTOM_SEARCH_API_KEYS` | Google API keys (comma-separated)    | `key1,key2,key3`                   |
| `GOOGLE_CUSTOM_SEARCH_CX`       | Google Custom Search engine ID       | `your_cx_id`                       |
| `OPENROUTER_API_KEY`            | OpenRouter API key for AI features   | `your_openrouter_key`              |

### Optional Secrets

| Secret Name        | Description     | Default Value                      |
| ------------------ | --------------- | ---------------------------------- |
| `OPENROUTER_MODEL` | AI model to use | `deepseek/deepseek-chat-v3.1:free` |

## Step 2: Create Cloudflare API Token

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use the **Edit Cloudflare Workers** template
5. Set the following permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Zone** → **DNS** → **Edit** (if using custom domain)
6. Set **Account Resources** to include your account
7. Copy the generated token → Add as `CLOUDFLARE_API_TOKEN` secret in GitHub

## Step 3: Create Cloudflare Pages Project

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Click **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Project name**: `whatismyname`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
5. Add environment variables in Cloudflare Pages settings (same as GitHub secrets above)

## Step 4: Deploy

### Automatic Deployment

Simply push to the `main` branch:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

GitHub Actions will automatically:

1. Run linter (`npm run lint`)
2. Run tests (`npm run test`)
3. Build the application (`npm run build`)
4. Deploy to Cloudflare Pages

### Preview Deployments

Pull requests automatically create preview deployments:

```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
# Create PR on GitHub
```

The preview URL will be posted as a comment on the PR.

## Step 5: Custom Domain Setup (Optional)

1. In Cloudflare Pages → Your Project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `whatismyname.app`)
4. Cloudflare will automatically configure DNS records

## Environment Variables Reference

### Production Environment Variables

These must be set in both GitHub Secrets and Cloudflare Pages environment variables:

```env
# Required
WHATSMYNAME_API_KEY=your_api_key
GOOGLE_CUSTOM_SEARCH_API_KEYS=key1,key2,key3
GOOGLE_CUSTOM_SEARCH_CX=your_cx_id
OPENROUTER_API_KEY=your_openrouter_key

# Optional
OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free
NEXT_PUBLIC_BASE_URL=https://whatismyname.app
NODE_ENV=production
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) includes:

### Test Job

- ✅ Checkout code
- ✅ Install dependencies
- ✅ Run ESLint
- ✅ Run Vitest unit tests
- ✅ Security audit (npm audit)

### Build Job

- ✅ Build Next.js application
- ✅ Upload build artifacts

### Deploy Job (Production)

- ✅ Download build artifacts
- ✅ Deploy to Cloudflare Pages
- ✅ Post deployment summary

### Preview Job (Pull Requests)

- ✅ Create preview deployment
- ✅ Comment preview URL on PR

## Monitoring Deployments

### View Deployment Status

1. **GitHub Actions**: Go to your repository → **Actions** tab
2. **Cloudflare Pages**: Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages) → Your Project → **Deployments**

### Health Check Endpoint

The application includes a health check endpoint:

```bash
curl https://whatismyname.app/api/health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2024-12-14T...",
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "whatsmyname": {
      "name": "WhatsMyName API",
      "status": "available",
      "configured": true
    },
    "google": {
      "name": "Google Custom Search",
      "status": "available",
      "configured": true
    },
    "openrouter": {
      "name": "OpenRouter AI",
      "status": "available",
      "configured": true,
      "model": "deepseek/deepseek-chat-v3.1:free"
    }
  }
}
```

## Troubleshooting

### Build Failures

Check GitHub Actions logs:

1. Go to **Actions** tab
2. Click on the failed workflow run
3. Expand the failing job step to see error messages

Common issues:

- **TypeScript errors**: Run `npm run build` locally to reproduce
- **Missing environment variables**: Verify all secrets are configured
- **Test failures**: Run `npm test` locally

### Deployment Failures

Check Cloudflare Pages logs:

1. Go to Cloudflare Pages Dashboard
2. Click on your project → **Deployments**
3. Click on the failed deployment → View logs

Common issues:

- **API token expired**: Regenerate Cloudflare API token
- **Build command failed**: Verify build works locally
- **Environment variables**: Check Cloudflare Pages settings

### Runtime Errors

1. Check health endpoint: `https://whatismyname.app/api/health`
2. Check browser console for client-side errors
3. Check Cloudflare Pages → **Functions** → **Logs** for server errors

## Rollback

To rollback to a previous deployment:

1. Go to Cloudflare Pages Dashboard → Your Project → **Deployments**
2. Find the working deployment
3. Click **⋯** (three dots) → **Rollback to this deployment**

Or redeploy a previous commit:

```bash
git revert HEAD
git push origin main
```

## Security Best Practices

1. **Never commit secrets**: Use GitHub Secrets and Cloudflare environment variables
2. **Rotate API keys**: Regularly rotate all API keys (quarterly recommended)
3. **Monitor access**: Review Cloudflare access logs for suspicious activity
4. **Enable 2FA**: Enable two-factor authentication on GitHub and Cloudflare
5. **Audit dependencies**: Run `npm audit` regularly and update dependencies

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
