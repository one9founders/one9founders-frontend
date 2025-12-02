# Gmail Setup for Newsletter

## 1. Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled

## 2. Generate App Password
1. Go to Google Account > Security > 2-Step Verification
2. Scroll down to "App passwords"
3. Select "Mail" and generate a password
4. Copy the 16-character password

## 3. Environment Variables
Add to your `.env.local`:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

## 4. Test the Setup
The newsletter signup will now automatically send welcome emails via Gmail when users subscribe.