# Google OAuth Setup Guide

This app now includes "Continue with Google" buttons on both the sign-in and sign-up screens!

## 🔐 How to Enable Google OAuth in Clerk

### Step 1: Configure in Clerk Dashboard

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **User & Authentication** → **Social Connections**
4. Find **Google** and toggle it **ON**
5. Clerk will provide you with:
   - Authorized redirect URIs
   - Instructions for Google Cloud Console setup

### Step 2: Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen:
   - Add your app name: "Booch"
   - Add support email
   - Add authorized domains
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Add the **Authorized redirect URIs** from Clerk
7. Copy your **Client ID** and **Client Secret**

### Step 3: Add Credentials to Clerk

1. Return to your Clerk Dashboard
2. In the Google OAuth settings, enter:
   - **Client ID** from Google
   - **Client Secret** from Google
3. Save the settings

### Step 4: Test the Integration

1. Run your app: `npm start`
2. Go to the sign-in or sign-up screen
3. Tap "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authentication, you'll be redirected back to the app

## 📱 What's Included

Both authentication screens now have:

✅ Email/Password sign-in and sign-up
✅ "Continue with Google" OAuth button
✅ Beautiful UI with divider
✅ Proper error handling
✅ Loading states during authentication
✅ Automatic database sync (will be added in Phase 2)

## 🔧 Technical Details

- Uses Clerk's `useOAuth` hook with `oauth_google` strategy
- Implements `expo-web-browser` for OAuth flow
- Handles OAuth callback with `WebBrowser.maybeCompleteAuthSession()`
- Creates session and redirects to home on success

## 🚨 Important Notes

1. **Development**: OAuth works best on real devices or emulators with Google Play Services
2. **URLs**: Make sure your redirect URIs match exactly (trailing slashes matter!)
3. **Testing**: Test on both iOS and Android as behavior can differ
4. **Production**: Update your OAuth settings when you deploy to production

## 🎨 UI Design

The Google button features:

- Google search emoji (🔍) for branding
- Border style for secondary action
- Disabled state when loading
- Matches the app's design system

## Next Steps

Once you've enabled Google OAuth in Clerk, users can:

- Sign up with Google (creates new account)
- Sign in with Google (if account exists)
- Link Google to existing email/password account (future feature)
