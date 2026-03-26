/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#050505',
        'safe': '#00ff88',
        'risk': '#ff3b3b',
        'neutral': '#00bfff',
        'card': 'rgba(255, 255, 255, 0.03)',
        'card-border': 'rgba(255, 255, 255, 0.08)',
        'text-primary': '#f0f0f0',
        'text-muted': '#666666',
      },
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        body: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 650ms ease both',
        'scan-line': 'scanLine 1.5s linear infinite',
        'spin-slow': 'spin 1.5s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0px currentColor' },
          '50%': { boxShadow: '0 0 24px currentColor' },
        }
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
        'hero-glow': 'radial-gradient(1200px 700px at 10% 15%, rgba(0, 191, 255, 0.09), transparent 60%), radial-gradient(900px 600px at 85% 30%, rgba(0, 255, 136, 0.07), transparent 60%), radial-gradient(900px 600px at 80% 90%, rgba(255, 59, 59, 0.06), transparent 60%)',
      }
    },
  },
  plugins: [],
}

