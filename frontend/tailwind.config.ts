import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ebbf0f',
          dark: '#f8eb40',
          light: '#ebbf0f',
        },
        dark: {
          DEFAULT: '#000000',
          light: '#0f0f0f',
          lighter: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
}
export default config
