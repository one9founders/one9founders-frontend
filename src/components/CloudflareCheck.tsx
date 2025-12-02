'use client';

import { useEffect, useState } from 'react';

interface CloudflareCheckProps {
  onVerified: () => void;
}

export default function CloudflareCheck({ onVerified }: CloudflareCheckProps) {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    document.head.appendChild(script);

    // @ts-ignore
    window.onTurnstileCallback = (token: string) => {
      setIsVerified(true);
      onVerified();
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [onVerified]);

  return (
    <div className="mb-4">
      <div
        className="cf-turnstile"
        data-sitekey="0x4AAAAAACEZjDMrdgi2yrki"
        data-callback="onTurnstileCallback"
        data-theme="dark"
      ></div>
    </div>
  );
}