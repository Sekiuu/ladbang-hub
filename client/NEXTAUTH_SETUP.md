# NextAuth.js Setup Guide

This project has been configured with NextAuth.js for authentication. Here's what has been set up:

## Files Created/Modified

### Configuration Files

- `lib/auth.ts` - NextAuth configuration with credentials provider
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route handler
- `.env` - Environment variables for NextAuth

### Components

- `app/components/AuthButton.tsx` - Login/logout button component
- `app/components/ProtectedRoute.tsx` - Component for protecting routes
- `app/profile/page.tsx` - User profile page (protected)

### Updated Files

- `app/layout.tsx` - Added SessionProvider wrapper
- `app/login/page.tsx` - Updated to use NextAuth signIn
- `app/compoents/ui/Navbar.tsx` - Added AuthButton integration
- `app/page.tsx` - Added session-based welcome message

## Environment Variables

Make sure your `.env.local` file contains:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
```

## Demo Credentials

For testing, you can use these hardcoded credentials:

- Email: `admin@example.com`
- Password: `password`

## Features

1. **Credentials Authentication** - Login with email/password
2. **Session Management** - JWT-based sessions
3. **Protected Routes** - Use `ProtectedRoute` component to protect pages
4. **User Profile** - View user information at `/profile`
5. **Responsive UI** - Authentication buttons in navbar

## Usage

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign In" to go to the login page
4. Use the demo credentials to log in
5. Access protected routes like `/profile`

## Customization

To integrate with your existing API:

1. Update the `authorize` function in `lib/auth.ts`
2. Replace the hardcoded credentials with your database logic
3. Add additional providers (Google, GitHub, etc.) as needed

## Security Notes

- Change the `NEXTAUTH_SECRET` in production
- Implement proper password hashing
- Add rate limiting for login attempts
- Consider adding two-factor authentication
