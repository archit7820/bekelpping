# Authentication System Setup Guide

## Overview
This authentication system provides complete login/signup functionality with Google Auth integration for both iOS and Android platforms.

## Features
✅ Email/Password Authentication
✅ Google Sign-In (Native & Web fallback)
✅ Password Reset
✅ Email Verification
✅ Token Management & Auto-refresh
✅ Secure API Integration
✅ Form Validation
✅ Loading States
✅ Error Handling

## Setup Instructions

### 1. Backend API Requirements
Your backend at `http://localhost:5000` should have these endpoints:

```
POST /auth/login
POST /auth/signup
POST /auth/google
POST /auth/refresh
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/verify-email
GET  /user/profile
PUT  /user/profile
PUT  /user/change-password
```

### 2. Google Sign-In Setup

#### Get Google OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable Google+ API and Google Sign-In API
4. Go to Credentials → Create OAuth 2.0 Client IDs

#### For Android:
- Application type: Android
- Package name: `com.yourcompany.socialimpacttracker`
- SHA-1 certificate fingerprint (get with: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`)

#### For iOS:
- Application type: iOS
- Bundle ID: `com.yourcompany.socialimpacttracker`

#### For Web:
- Application type: Web application
- Authorized redirect URIs: Add your domain

### 3. Configuration Files

#### Update `.env`:
```
API_BASE_URL=http://localhost:5000
GOOGLE_CLIENT_ID_ANDROID=your_android_client_id
GOOGLE_CLIENT_ID_IOS=your_ios_client_id
GOOGLE_CLIENT_ID_WEB=your_web_client_id
```

#### Update `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://localhost:5000",
      "googleClientId": "your_web_client_id"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.socialimpacttracker",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "package": "com.yourcompany.socialimpacttracker",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      "@react-native-google-signin/google-signin"
    ]
  }
}
```

### 4. Add Google Service Files
- Download `GoogleService-Info.plist` (iOS) and place in project root
- Download `google-services.json` (Android) and place in project root

## Usage Examples

### Basic Login
```typescript
import { useAuth } from '../hooks/use-auth';

const { login, isLoading } = useAuth();

const handleLogin = async () => {
  const result = await login('user@example.com', 'password123');
  if (result.success) {
    // User logged in successfully
    router.replace('/(tabs)');
  } else {
    Alert.alert('Error', result.error);
  }
};
```

### Google Sign-In
```typescript
const { googleSignIn, googleSignInWeb } = useAuth();

const handleGoogleAuth = async () => {
  // Try native first, fallback to web
  let result = await googleSignIn();
  if (!result.success) {
    result = await googleSignInWeb();
  }
  
  if (result.success) {
    router.replace('/(tabs)');
  }
};
```

### Check Auth Status
```typescript
const { isAuthenticated, user, isLoading } = useAuth();

if (isLoading) {
  return <LoadingScreen />;
}

if (!isAuthenticated) {
  return <LoginScreen />;
}

return <MainApp user={user} />;
```

## File Structure

```
├── config/
│   ├── api.ts              # Axios configuration
│   └── env.ts              # Environment variables
├── services/
│   ├── auth-service.ts     # Authentication API calls
│   └── user-service.ts     # User management API calls
├── hooks/
│   └── use-auth.ts         # Authentication hook
├── app/(auth)/
│   ├── login.tsx           # Login screen
│   └── signup.tsx          # Signup screen
└── components/
    └── auth-wrapper.tsx    # Auth state wrapper
```

## Backend API Expected Format

### Login/Signup Response:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "avatar_url",
    "interests": ["interest1", "interest2"],
    "isEmailVerified": true
  },
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Security Features

- **Token Storage**: Secure storage using AsyncStorage
- **Auto-refresh**: Automatic token refresh on API calls
- **Request Interceptors**: Automatic token attachment
- **Response Interceptors**: Handle 401 errors and auto-logout
- **Input Validation**: Email format, password strength
- **Error Handling**: Comprehensive error messages

## Testing

### Test Login Flow:
1. Open app → Should show login screen
2. Enter valid credentials → Should navigate to main app
3. Close app and reopen → Should remain logged in

### Test Google Auth:
1. Tap "Continue with Google"
2. Complete Google auth flow
3. Should create account/login and navigate to main app

### Test Password Reset:
1. Tap "Forgot Password"
2. Enter email → Should receive reset email
3. Follow email link to reset password

## Troubleshooting

### Common Issues:

1. **Google Sign-In not working**:
   - Check client IDs are correct
   - Verify SHA-1 fingerprint for Android
   - Ensure Google services files are in place

2. **API calls failing**:
   - Check backend is running on localhost:5000
   - Verify API endpoints exist
   - Check network permissions

3. **Token issues**:
   - Clear app storage: `npx expo start --clear`
   - Check token format in AsyncStorage

## Next Steps

1. Configure your backend API endpoints
2. Set up Google OAuth credentials
3. Test the authentication flow
4. Customize UI/UX as needed
5. Add additional social auth providers if needed

The authentication system is now ready to use! 🎉