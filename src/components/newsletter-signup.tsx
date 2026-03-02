import { useEffect, useRef, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterSignup({
  title = 'Stay in the loop',
  description = 'Get concise posts on Docker deploy patterns, ops trade-offs, and new Haloy content.',
}: {
  title?: string;
  description?: string;
}) {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [timestampMs] = useState(() => Date.now());
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileToken = useRef('');
  const scriptLoaded = useRef(false);

  const renderWidget = useCallback(() => {
    if (!turnstileRef.current || turnstileWidgetId.current !== null) return;
    if (!window.turnstile) return;

    turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => {
        turnstileToken.current = token;
      },
      'expired-callback': () => {
        turnstileToken.current = '';
      },
    });
  }, []);

  useEffect(() => {
    if (scriptLoaded.current) {
      renderWidget();
      return;
    }

    if (document.querySelector('script[src*="turnstile"]')) {
      scriptLoaded.current = true;
      if (window.turnstile) {
        renderWidget();
      } else {
        (window as any).__turnstileOnLoad = renderWidget;
      }
      return;
    }

    (window as any).__turnstileOnLoad = renderWidget;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__turnstileOnLoad';
    script.async = true;
    document.head.appendChild(script);
    scriptLoaded.current = true;

    return () => {
      if (turnstileWidgetId.current !== null && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [renderWidget]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const honeypot = formData.get('website') as string;

    if (!turnstileToken.current) {
      setErrorMessage('Please wait for the verification to complete.');
      setFormState('error');
      return;
    }

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          turnstile_token: turnstileToken.current,
          honeypot,
          timestamp: timestampMs,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setFormState('error');
        return;
      }

      setFormState('success');
    } catch {
      setErrorMessage('Network error. Please try again.');
      setFormState('error');
    }
  };

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white/60 p-8 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>

      {formState === 'success' ? (
        <p className="mt-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Check your inbox to confirm your subscription.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sm:max-w-64"
              disabled={formState === 'submitting'}
            />
            <div aria-hidden="true" className="absolute -left-[9999px]">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <Button type="submit" disabled={formState === 'submitting'}>
              {formState === 'submitting' ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
          <div ref={turnstileRef} className="mt-3" />
          {formState === 'error' && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
          )}
        </form>
      )}
    </div>
  );
}
