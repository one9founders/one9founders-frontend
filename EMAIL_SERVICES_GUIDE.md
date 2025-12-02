# Email Service Integration Guide

## 1. AWS SES (Simple Email Service) - Recommended

### Setup
```bash
npm install @aws-sdk/client-ses
```

### Configuration
```typescript
// lib/emailService.ts
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendWelcomeEmail(email: string) {
  const command = new SendEmailCommand({
    Source: "noreply@one9founders.com",
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Welcome to One9Founders!" },
      Body: {
        Html: { Data: "<h1>Thanks for subscribing!</h1>" },
        Text: { Data: "Thanks for subscribing!" }
      }
    }
  });

  return await sesClient.send(command);
}
```

### Environment Variables
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

## 2. Resend (Modern Alternative)

### Setup
```bash
npm install resend
```

### Configuration
```typescript
// lib/emailService.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string) {
  return await resend.emails.send({
    from: 'One9Founders <noreply@one9founders.com>',
    to: [email],
    subject: 'Welcome to One9Founders!',
    html: '<h1>Thanks for subscribing!</h1>',
  });
}
```

### Environment Variables
```env
RESEND_API_KEY=your_resend_api_key
```

## 3. SendGrid

### Setup
```bash
npm install @sendgrid/mail
```

### Configuration
```typescript
// lib/emailService.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendWelcomeEmail(email: string) {
  const msg = {
    to: email,
    from: 'noreply@one9founders.com',
    subject: 'Welcome to One9Founders!',
    html: '<h1>Thanks for subscribing!</h1>',
  };

  return await sgMail.send(msg);
}
```

## 4. Integration with Newsletter Action

Update your newsletter action to send welcome emails:

```typescript
// In actions.ts
import { sendWelcomeEmail } from '@/lib/emailService';

export async function subscribeToNewsletter(email: string) {
  try {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({ email, source: 'homepage' });

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Email already subscribed' };
      }
      throw error;
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return { success: true };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, error: 'Failed to subscribe' };
  }
}
```

## Recommendation

**Use AWS SES** for production because:
- Cost-effective (first 62,000 emails free monthly)
- Reliable and scalable
- Good deliverability rates
- Integrates well with other AWS services

**Use Resend** for quick setup:
- Modern API and great developer experience
- Built-in templates and analytics
- Easy to get started

Run the SQL in `database/newsletter.sql` in your Supabase SQL editor to create the newsletter table.