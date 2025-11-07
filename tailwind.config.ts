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
        // Whispering Art Brand Palette
        whisper: {
          cream: '#FAF7F2',
          sage: '#C9D5C5',
          blush: '#F2D5D7',
          gold: '#D4AF7A',
          charcoal: '#4A4A4A',
          softWhite: '#FFFFFF',
        },
      },
      fontFamily: {
        // Serif body fonts
        lora: ['var(--font-lora)', 'serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        // Handwritten script fonts
        greatVibes: ['var(--font-great-vibes)', 'cursive'],
        allura: ['var(--font-allura)', 'cursive'],
        // Sans serif for UI
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Safe margins for print (0.25 inches at 96 DPI)
        'safe': '24px',
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper-bg.png')",
      },
      animation: {
        'fold': 'fold 0.8s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fold: {
          '0%': { transform: 'perspective(1000px) rotateY(-15deg)', opacity: '0' },
          '100%': { transform: 'perspective(1000px) rotateY(0deg)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
