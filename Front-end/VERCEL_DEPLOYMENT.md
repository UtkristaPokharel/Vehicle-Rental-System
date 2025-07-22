# Vercel Deployment Guide for Google Authentication

## Steps to Fix Google Authentication on Vercel

### 1. Firebase Console Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `easywheels-auth`
3. Navigate to **Authentication** > **Settings** > **Authorized domains**
4. Add your Vercel domain (e.g., `your-project-name.vercel.app`)
5. Add any custom domains you plan to use

### 2. Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project: `easywheels-auth`
3. Navigate to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 client ID
5. Add your Vercel domain to **Authorized JavaScript origins**:
   - `https://your-project-name.vercel.app`
6. Add your Vercel domain to **Authorized redirect URIs**:
   - `https://your-project-name.vercel.app/__/auth/handler`

### 3. Vercel Environment Variables

In your Vercel dashboard, add these environment variables:

```
VITE_FIREBASE_API_KEY=AIzaSyAO0jHgQYzYoP9q0qqExCA1U7Hzgci8TpM
VITE_FIREBASE_AUTH_DOMAIN=easywheels-auth.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=easywheels-auth
VITE_FIREBASE_STORAGE_BUCKET=easywheels-auth.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=791297666965
VITE_FIREBASE_APP_ID=1:791297666965:web:790184ec97bb122eaa909c
VITE_FIREBASE_MEASUREMENT_ID=G-MXDLVWGQ8F
VITE_API_BASE_URL=https://vehicle-rental-system-rjvj.onrender.com
```

### 4. Vercel Project Settings

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add all the environment variables listed above
4. Redeploy your project

### 5. Common Issues and Solutions

#### Issue: "auth/unauthorized-domain"
- **Solution**: Make sure your Vercel domain is added to Firebase authorized domains

#### Issue: Popup blocked
- **Solution**: Check browser popup settings and ensure users allow popups

#### Issue: Network errors
- **Solution**: Verify your backend API is accessible from your Vercel domain

#### Issue: CORS errors
- **Solution**: Ensure your backend allows requests from your Vercel domain

### 6. Testing

1. Deploy to Vercel
2. Open your Vercel URL
3. Try Google authentication
4. Check browser console for any errors
5. Verify network requests in DevTools

### 7. Debugging Tips

1. **Check Firebase Auth logs**: Firebase Console > Authentication > Usage
2. **Check Google Cloud logs**: Google Cloud Console > Logging
3. **Verify domains**: Ensure all domains match exactly (no trailing slashes)
4. **Test in incognito**: To avoid cached authentication states

### 8. Security Considerations

- Never expose Firebase config in public repositories
- Use environment variables for all sensitive data
- Regularly rotate API keys
- Monitor authentication logs for suspicious activity
