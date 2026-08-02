/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#EDEEF0',
          muted: '#9297A1',
          faint: '#5B5F68',
        },
        surface: {
          950: '#0A0B0D',
          900: '#111318',
          850: '#14161C',
          800: '#181B22',
          700: '#20242C',
        },
        line: '#23262E',
        accent: {
          DEFAULT: '#C9A227',
          dim: '#8A7020',
        },
        up: '#3FB27F',
        down: '#E2574C',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
