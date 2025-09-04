# Netlify Production Environment Setup

इस guide का उपयोग करके अपने Netlify deployed app के लिए proper environment variables set करें।

## Required Environment Variables

Netlify Dashboard में जाकर **Site Configuration > Environment Variables** में निम्नलिखित variables add करें:

### 1. Production Environment

```
NODE_ENV=production
```

### 2. SendGrid Email Configuration

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### 3. Database Configuration

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```

### 4. Admin Credentials

```
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_admin_password
```

### 5. JWT Configuration

```
JWT_SECRET=your_super_secure_jwt_secret_key_here
```

### 6. Optional: Google OAuth (if using social login)

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-app.netlify.app/api/auth/social/google/callback
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Note**: `VITE_GOOGLE_CLIENT_ID` should have the same value as `GOOGLE_CLIENT_ID`. The `VITE_` prefix is required for client-side access in the browser.

### 7. Client URL

```
CLIENT_URL=https://your-app.netlify.app
```

## SendGrid Setup Steps

1. **SendGrid Account बनाएं**: https://sendgrid.com/
2. **API Key Generate करें**:
   - SendGrid Dashboard में जाएं
   - Settings > API Keys
   - "Create API Key" पर click करें
   - "Full Access" select करें
   - API key को copy करें और `SENDGRID_API_KEY` में paste करें

3. **Verified Sender Setup करें**:
   - Settings > Sender Authentication
   - Single Sender Verification करें
   - आपका domain email verify करें
   - इस email को `SENDGRID_FROM_EMAIL` में use करें

## Database Setup (MongoDB)

1. **MongoDB Atlas Account बनाएं**: https://cloud.mongodb.com/
2. **Cluster Create करें**
3. **Database User Create करें**
4. **Connection String Copy करें** और `MONGODB_URI` में paste करें

## Netlify Environment Variables कैसे Set करें

1. Netlify Dashboard में login करें
2. आपकी site select करें
3. **Site Configuration** में जाएं
4. **Environment Variables** section में जाएं
5. **Add a Variable** पर click करें
6. Key और Value enter करें
7. **Save** क���ें

## Important Security Notes

- ❌ कभी भी production credentials को code में hardcode न करें
- ✅ सभी sensitive data को environment variables में store करें
- ✅ Strong passwords और API keys use करें
- ✅ Regular monitoring करें कि क्या emails properly send हो रही हैं

## Testing After Setup

1. Deploy करने के बाद site को test करें
2. OTP functionality check करें
3. Admin login test करें
4. Console logs check करें कि SendGrid properly configured है

## Common Issues & Solutions

### Issue: "SendGrid API key not configured"

**Solution**: Netlify environment variables में proper `SENDGRID_API_KEY` set करें

### Issue: OTP test mode में दिख रहा है

**Solution**: `NODE_ENV=production` set करें Netlify में

### Issue: Database connection failed

**Solution**: `MONGODB_URI` properly set करें और network access allow करें

### Issue: Admin login not working

**Solution**: `ADMIN_EMAIL` और `ADMIN_PASSWORD` environment variables set करें

## Environment Variables Verification

Deployment के बाद `/api/health` endpoint पर जाकर check करें कि सब properly configured है।
