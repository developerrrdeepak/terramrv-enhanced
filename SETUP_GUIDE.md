# Carbon Roots MRV - Production Setup Guide

## Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- SendGrid account (for emails)
- Google Cloud account (for OAuth, optional)

## 1. Environment Configuration

Update the `.env` file with your actual credentials:

```bash
# Server Configuration
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-domain.com

# Database (MongoDB Atlas recommended for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbonroots
DB_NAME=carbonroots

# JWT Authentication (Generate a strong secret)
JWT_SECRET=generate-a-strong-random-secret-here

# Email Service (SendGrid)
SENDGRID_API_KEY=sg.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-verified-email@yourdomain.com

# Admin User
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=strong-admin-password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/social/google/callback
```

## 2. Database Setup

### Local MongoDB
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community  # macOS
# or
sudo apt-get install mongodb                 # Ubuntu

# Start MongoDB
mongod
```

### MongoDB Atlas (Recommended for Production)
1. Create account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get connection string
4. Whitelist IP addresses (0.0.0.0/0 for all, or your server IP)

## 3. Email Service (SendGrid)

1. Create account at https://sendgrid.com
2. Verify sender identity (domain or single sender)
3. Get API key from Settings > API Keys
4. Update SENDGRID_API_KEY in .env

## 4. Google OAuth Setup (Optional)

1. Go to Google Cloud Console
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: http://localhost:8080/api/auth/social/google/callback
   - Production: https://your-domain.com/api/auth/social/google/callback

## 5. Installation & Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start
```

## 6. Production Deployment

### Netlify Deployment
1. Connect your repository to Netlify
2. Set build command: `pnpm run build`
3. Set publish directory: `dist/client`
4. Add environment variables in Netlify dashboard

### Environment Variables for Netlify:
```
NODE_ENV=production
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
SENDGRID_API_KEY=your-sendgrid-key
ADMIN_EMAIL=admin@email.com
ADMIN_PASSWORD=admin-password
```

### Vercel Deployment
1. Import repository to Vercel
2. Set framework preset to Vite
3. Add environment variables
4. Deploy

## 7. Testing the Application

1. **Authentication Test**:
   - Visit `/farmer-dashboard` and register as farmer
   - Test OTP verification
   - Test password login

2. **Admin Test**:
   - Visit `/admin-dashboard`
   - Login with admin credentials
   - Verify farmer management

3. **Email Test**:
   - Visit `/test-email` (development only)
   - Test email sending functionality

4. **API Test**:
   ```bash
   # Health check
   curl http://localhost:3000/api/health
   
   # Ping test
   curl http://localhost:3000/api/ping
   ```

## 8. Security Considerations

- Change default JWT secret in production
- Use HTTPS in production
- Set proper CORS origins
- Regularly update dependencies
- Monitor database access logs
- Implement rate limiting for APIs

## 9. Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**
   - Check MONGODB_URI format
   - Verify network connectivity
   - Check firewall settings

2. **SendGrid Emails Not Sending**
   - Verify API key
   - Check sender verification
   - Review SendGrid dashboard

3. **Google OAuth Not Working**
   - Verify redirect URIs
   - Check client ID/secret
   - Enable Google+ API

4. **Build Errors**
   - Clear node_modules: `rm -rf node_modules pnpm-lock.yaml`
   - Reinstall: `pnpm install`
   - Check TypeScript errors

## 10. Support

For issues and support:
- Check server logs for detailed errors
- Review browser console for frontend issues
- Verify all environment variables are set
- Test individual API endpoints with curl/postman
