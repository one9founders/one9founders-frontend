import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { data, error: null };
    } else {
      return { data: null, error: new Error(data.error || 'Registration failed') };
    }
  } catch (error) {
    return { data: null, error: new Error('Network error') };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { data: null, error: new Error('Invalid credentials') };
    }

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const signInWithGoogle = async () => {
  try {
    await nextAuthSignIn('google', { callbackUrl: '/' });
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const signOut = async () => {
  try {
    await nextAuthSignOut({ callbackUrl: '/' });
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};