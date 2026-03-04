import { type ComponentType, useEffect, useState } from 'react';
import { DjangoLogo } from './django-logo';
import { GolangLogo } from './golang-logo';
import { HtmxLogo } from './htmx-logo';
import { LaravelLogo } from './laravel-logo';
import { NextjsLogo } from './nextjs-logo';
import { NuxtjsLogo } from './nuxtjs-logo';
import { PhoenixLogo } from './phoenix-logo';
import { RubyOnRailsLogo } from './ruby-on-rails-logo';
import { SolidStartLogo } from './solid-start-logo';
import { SvelteKitLogo } from './svelte-kit-logo';
import { TanstackStartLogo } from './tantstack-start';
import { WebIcon } from './web-icon';

interface FrameworkIconProps {
  className?: string;
}

interface Framework {
  name: string;
  icon: ComponentType<FrameworkIconProps>;
  appName: string;
  port: number;
  healthCheck: string;
  domain: string;
}

const frameworks: Framework[] = [
  {
    name: 'Next.js',
    icon: NextjsLogo,
    appName: 'my-nextjs-app',
    port: 3000,
    healthCheck: '/api/health',
    domain: 'mynextjsapp.com',
  },
  {
    name: 'Nuxt',
    icon: NuxtjsLogo,
    appName: 'my-nuxt-app',
    port: 3000,
    healthCheck: '/',
    domain: 'mynuxtapp.com',
  },
  {
    name: 'TanStack Start',
    icon: TanstackStartLogo,
    appName: 'my-tanstack-app',
    port: 3000,
    healthCheck: '/',
    domain: 'mytanstackapp.com',
  },
  {
    name: 'SvelteKit',
    icon: SvelteKitLogo,
    appName: 'my-sveltekit-app',
    port: 3000,
    healthCheck: '/',
    domain: 'mysveltekitapp.com',
  },
  {
    name: 'SolidStart',
    icon: SolidStartLogo,
    appName: 'my-solidstart-app',
    port: 3000,
    healthCheck: '/',
    domain: 'mysolidstartapp.com',
  },
  {
    name: 'Django',
    icon: DjangoLogo,
    appName: 'my-django-app',
    port: 8000,
    healthCheck: '/health',
    domain: 'mydjangoapp.com',
  },
  {
    name: 'Laravel',
    icon: LaravelLogo,
    appName: 'my-laravel-app',
    port: 8000,
    healthCheck: '/up',
    domain: 'mylaravelapp.com',
  },
  {
    name: 'Rails',
    icon: RubyOnRailsLogo,
    appName: 'my-rails-app',
    port: 3000,
    healthCheck: '/up',
    domain: 'myrailsapp.com',
  },
  {
    name: 'htmx',
    icon: HtmxLogo,
    appName: 'my-htmx-app',
    port: 8080,
    healthCheck: '/',
    domain: 'myhtmxapp.com',
  },
  {
    name: 'Go',
    icon: GolangLogo,
    appName: 'my-go-app',
    port: 8080,
    healthCheck: '/health',
    domain: 'mygoapp.com',
  },
  {
    name: 'Phoenix',
    icon: PhoenixLogo,
    appName: 'my-phoenix-app',
    port: 4000,
    healthCheck: '/',
    domain: 'myphoenixapp.com',
  },
];

const INTERVAL_MS = 3000;
const ITEM_HEIGHT = 40;

function ArrowRight() {
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" fill="none" className="text-muted-foreground/40 shrink-0">
      <path
        d="M0 12h36m0 0l-6-6m6 6l-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" className="text-muted-foreground/40 shrink-0">
      <path
        d="M12 0v28m0 0l-6-6m6 6l6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConfigValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="deploy-flow-fade-in inline-block" style={{ color: '#a5d6ff' }}>
      {children}
    </span>
  );
}

function NumericValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="deploy-flow-fade-in inline-block" style={{ color: '#79c0ff' }}>
      {children}
    </span>
  );
}

export function DeployFlow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % frameworks.length);
      setProgressKey((prev) => prev + 1);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  const fw = frameworks[activeIndex];

  return (
    <>
      <style>{`
        @keyframes deploy-flow-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes deploy-flow-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .deploy-flow-fade-in {
          animation: deploy-flow-fade-in 0.4s ease-out both;
        }
        .deploy-flow-progress-bar {
          animation: deploy-flow-progress ${INTERVAL_MS}ms linear both;
        }
      `}</style>

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <h2 className="font-figtree text-foreground mb-4 text-3xl leading-tight font-extrabold tracking-tight lg:text-4xl">
              Same workflow for every framework
            </h2>
            <p className="text-muted-foreground mx-auto max-w-xl text-lg leading-relaxed">
              The deploy process is the same regardless of your stack. Dockerize, write a config, run deploy, go live.
            </p>
          </div>

          {/* Desktop layout */}
          <div
            className="hidden items-center justify-center gap-6 lg:flex"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => {
              setPaused(false);
              setProgressKey((p) => p + 1);
            }}
          >
            <FrameworkSelector activeIndex={activeIndex} progressKey={progressKey} paused={paused} />
            <ArrowRight />
            <ConfigCard fw={fw} />
            <ArrowRight />
            <LiveUrl fw={fw} />
          </div>

          {/* Mobile layout */}
          <div
            className="flex flex-col items-center gap-4 lg:hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => {
              setPaused(false);
              setProgressKey((p) => p + 1);
            }}
          >
            <FrameworkSelector activeIndex={activeIndex} progressKey={progressKey} paused={paused} />
            <ArrowDown />
            <ConfigCard fw={fw} />
            <ArrowDown />
            <LiveUrl fw={fw} />
          </div>

          <div className="mt-10 text-center">
            <a
              href="https://github.com/haloydev/examples"
              className="text-muted-foreground decoration-muted-foreground/30 hover:text-foreground hover:decoration-foreground/30 text-sm underline underline-offset-4 transition-colors"
            >
              See example projects
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function FrameworkSelector({
  activeIndex,
  progressKey,
  paused,
}: {
  activeIndex: number;
  progressKey: number;
  paused: boolean;
}) {
  return (
    <div className="w-full max-w-[280px] shrink-0 lg:basis-[280px]">
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white/60 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
        <div className="relative overflow-hidden" style={{ height: ITEM_HEIGHT }}>
          <div
            className="transition-transform duration-500"
            style={{
              transform: `translateY(-${activeIndex * ITEM_HEIGHT}px)`,
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {frameworks.map((fw) => {
              const Icon = fw.icon;
              return (
                <div
                  key={fw.name}
                  className="font-figtree text-foreground flex items-center gap-3 px-5 text-sm font-bold"
                  style={{ height: ITEM_HEIGHT }}
                >
                  <Icon className="size-5 shrink-0" />
                  {fw.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className="h-1 bg-black/[0.04] dark:bg-white/[0.04]">
          <div
            key={progressKey}
            className={`h-full bg-emerald-500/60 ${paused ? '' : 'deploy-flow-progress-bar'}`}
            style={paused ? { width: '0%', animation: 'none' } : undefined}
          />
        </div>
      </div>
    </div>
  );
}

function ConfigCard({ fw }: { fw: Framework }) {
  return (
    <div className="w-full max-w-[340px] shrink-0">
      <div
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          background: '#0d0d0d',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.05), 0 25px 50px -12px rgba(0,0,0,0.6), 0 12px 24px -8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 38,
            padding: '0 14px',
            background: 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%)',
            borderBottom: '1px solid rgba(0,0,0,0.5)',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', gap: 8, width: 54 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #ff6058 0%, #e5453e 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.2)',
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #ffbd2e 0%, #dea123 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.2)',
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #28c940 0%, #1aab2f 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.2)',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'SF Mono','Menlo','Monaco','Consolas',monospace",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.6 }}
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>haloy.yaml</span>
          </div>
          <div style={{ width: 54 }} />
        </div>

        {/* Config content */}
        <pre
          style={{
            margin: 0,
            padding: '16px 20px',
            fontFamily: "'SF Mono','Menlo','Monaco','Consolas',monospace",
            fontSize: 13,
            lineHeight: 1.7,
            background: '#0d0d0d',
            overflow: 'hidden',
          }}
        >
          <code>
            <Key>name</Key>
            <Punct>: </Punct>
            <ConfigValue key={`name-${fw.appName}`}>"{fw.appName}"</ConfigValue>
            {'\n'}
            <Key>server</Key>
            <Punct>: </Punct>
            <Static>haloy.yourserver.com</Static>
            {'\n'}
            <Key>domains</Key>
            <Punct>:</Punct>
            {'\n'}
            <Punct> - </Punct>
            <Key>domain</Key>
            <Punct>: </Punct>
            <ConfigValue key={`domain-${fw.domain}`}>"{fw.domain}"</ConfigValue>
            {'\n'}
            <Key>port</Key>
            <Punct>: </Punct>
            <NumericValue key={`port-${fw.port}-${fw.appName}`}>{fw.port}</NumericValue>
            {'\n'}
            <Key>health_check_path</Key>
            <Punct>: </Punct>
            <ConfigValue key={`health-${fw.healthCheck}`}>"{fw.healthCheck}"</ConfigValue>
          </code>
        </pre>
      </div>
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#7ee787' }}>{children}</span>;
}

function Punct({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#c9d1d9' }}>{children}</span>;
}

function Static({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#c9d1d9' }}>{children}</span>;
}

function LiveUrl({ fw }: { fw: Framework }) {
  return (
    <div className="w-full max-w-[280px] shrink-0 lg:basis-[280px]">
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white/60 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
        <div className="flex items-center gap-2.5 px-4 py-3">
          <WebIcon className="size-3.5 shrink-0 text-emerald-500" />
          <span key={fw.domain} className="deploy-flow-fade-in text-foreground truncate font-mono text-sm">
            https://{fw.domain}
          </span>
        </div>
      </div>
    </div>
  );
}
