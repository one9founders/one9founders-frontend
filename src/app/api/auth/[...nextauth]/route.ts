import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (response.ok) {
            const user = await response.json();
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name || user.email,
              token: user.token,
            };
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' && user) {
        try {
          const response = await fetch(`${API_URL}/auth/google/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              google_id: user.id,
            }),
          });

          if (response.ok) {
            const djangoUser = await response.json();
            token.djangoToken = djangoUser.token;
            token.userId = djangoUser.id;
          }
        } catch (error) {
          console.error('Google auth error:', error);
        }
      }

      if (user?.token) {
        token.djangoToken = user.token;
        token.userId = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.djangoToken) {
        session.user.token = token.djangoToken;
        session.user.id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };