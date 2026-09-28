import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F7F5F1',
        surface: '#FFFFFF',
        ink: '#17191E',
        coal: '#0D0E11',
        soft: '#5C626E',
        faint: '#8B909B',
        line: 'rgba(23,25,30,0.10)',
        linedark: 'rgba(23,25,30,0.06)',
        accent: '#E4572E',
        accentdeep: '#C2451F',
        accenthalo: 'rgba(228,87,46,0.09)',
        ok: '#2E7D5B',
        warn: '#B7791F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tech: '0.18em',
      },
      maxWidth: {
        shell: '1200px',
        editorial: '720px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 0.61, 0.21, 1)',
      },
      keyframes: {
        pulsedot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.8)' },
        },
        flowdash: {
          to: { strokeDashoffset: '-24' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeswap: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        tickerpulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        pulsedot: 'pulsedot 2.4s ease-in-out infinite',
        flowdash: 'flowdash 1.2s linear infinite',
        drift: 'drift 7s ease-in-out infinite',
        fadeswap: 'fadeswap 0.45s cubic-bezier(0.22,0.61,0.21,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
