import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector(`script[src^="${TURNSTILE_SCRIPT_SRC}"]`) as HTMLScriptElement | null;
    const script = existingScript ?? document.createElement('script');

    const cleanupListeners = () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    };

    const onLoad = () => {
      cleanupListeners();
      if (window.turnstile) {
        resolve();
      } else {
        turnstileScriptPromise = null;
        reject(new Error('Turnstile loaded but window.turnstile is unavailable'));
      }
    };

    const onError = () => {
      cleanupListeners();
      turnstileScriptPromise = null;
      reject(new Error('Failed to load Turnstile script'));
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    if (!existingScript) {
      script.src = TURNSTILE_SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      cleanupListeners();
      resolve();
    }
  });

  return turnstileScriptPromise;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterSignup({
  title = 'Stay updated',
  description = 'Get updates on new Haloy content.',
  variant = 'card',
}: {
  title?: string;
  description?: string;
  variant?: 'card' | 'inline';
}) {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [timestampMs] = useState(() => Date.now());
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileToken = useRef('');

  const renderWidget = useCallback(() => {
    if (!turnstileRef.current || turnstileWidgetId.current !== null) return;
    if (!window.turnstile) return;
    if (!TURNSTILE_SITE_KEY) {
      setErrorMessage('Verification is not configured. Please try again later.');
      setFormState('error');
      return;
    }

    turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      appearance: 'interaction-only',
      callback: (token: string) => {
        turnstileToken.current = token;
      },
      'expired-callback': () => {
        turnstileToken.current = '';
      },
      'error-callback': () => {
        turnstileToken.current = '';
      },
    });
  }, []);

  const resetWidget = useCallback(() => {
    if (turnstileWidgetId.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetId.current);
    }
    turnstileToken.current = '';
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadTurnstileScript()
      .then(() => {
        if (!isMounted) return;
        renderWidget();
      })
      .catch(() => {
        if (!isMounted) return;
        setErrorMessage('Verification failed to load. Please refresh and try again.');
        setFormState('error');
      });

    return () => {
      isMounted = false;
      if (turnstileWidgetId.current !== null && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
      turnstileToken.current = '';
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
        resetWidget();
        return;
      }

      setFormState('success');
    } catch {
      setErrorMessage('Network error. Please try again.');
      setFormState('error');
      resetWidget();
    }
  };

  const formContent =
    formState === 'success' ? (
      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
        Check your inbox to confirm your subscription.
      </p>
    ) : (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-10 flex-1"
            disabled={formState === 'submitting'}
          />
          <div aria-hidden="true" className="absolute -left-[9999px]">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <Button type="submit" disabled={formState === 'submitting'} className="min-h-10 shrink-0">
            {formState === 'submitting' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
        <div ref={turnstileRef} className="mt-3" />
        {formState === 'error' && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>}
      </form>
    );

  if (variant === 'inline') {
    return formContent;
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white/60 p-8 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      <div className="mt-4">{formContent}</div>
    </div>
  );
}
