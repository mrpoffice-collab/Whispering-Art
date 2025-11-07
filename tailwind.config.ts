import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Whispering Art Ink Tones (NO GREY)
        whisper: {
          // Primary ink tones
          inkBlack: '#0D0B0B',
          plum: '#5B3E43',
          parchment: '#F9F4EE',
          blushRose: '#EAD8CF',
          sage: '#C7C8B8',

          // Legacy (for gradual migration)
          cream: '#F9F4EE',
          blush: '#EAD8CF',
          charcoal: '#0D0B0B',
          softWhite: '#FEFCF9',
        },
      },
      fontFamily: {
        // Refined serif for body (handwritten letter feel)
        cormorant: ['var(--font-cormorant)', 'serif'],
        libreBaskerville: ['var(--font-baskerville)', 'serif'],

        // Authentic script for signatures
        greatVibes: ['var(--font-great-vibes)', 'cursive'],
        allura: ['var(--font-allura)', 'cursive'],
        alexBrush: ['var(--font-alex-brush)', 'cursive'],
        pinyonScript: ['var(--font-pinyon-script)', 'cursive'],
        sacramento: ['var(--font-sacramento)', 'cursive'],
        dancingScript: ['var(--font-dancing-script)', 'cursive'],

        // Legacy
        lora: ['var(--font-lora)', 'serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        baskerville: ['var(--font-baskerville)', 'serif'],
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'safe': '24px',
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper-bg.png')",
      },
      boxShadow: {
        // Soft paper shadows (not hard digital shadows)
        'paper': '0 2px 12px rgba(13, 11, 11, 0.08)',
        'paper-lg': '0 4px 24px rgba(13, 11, 11, 0.12)',
        'paper-xl': '0 8px 40px rgba(13, 11, 11, 0.15)',
        'lifted': '0 6px 20px rgba(13, 11, 11, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 0.2s ease-out',
        'settle': 'settle 0.15s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
          '100%': { transform: 'translateY(0)' },
        },
        settle: {
          '0%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.7', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.1)' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
    },
  },
  plugins: [],
};

export default config;
