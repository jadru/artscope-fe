/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');
const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontSize: {
      sm: '0.7rem',
      base: '0.9rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.563rem',
      '4xl': '2.953rem',
      '5xl': '3.441rem',
    },
    extend: {
      fontFamily: {
        primary: ['var(--noto-sans-kr)', ...fontFamily.sans],
      },
      animation: {
        fade: 'fadeOut 1s ease-in-out',
      },
      // keyframes: {
      //   flicker: {
      //     '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
      //       opacity: 0.99,
      //       filter:
      //         'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
      //     },
      //     '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
      //       opacity: 0.4,
      //       filter: 'none',
      //     },
      //   },
      //   shimmer: {
      //     '0%': {
      //       backgroundPosition: '-700px 0',
      //     },
      //     '100%': {
      //       backgroundPosition: '700px 0',
      //     },
      //   },
      // },
      // animation: {
      //   flicker: 'flicker 3s linear infinite',
      //   shimmer: 'shimmer 1.3s linear infinite',
      // },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'nextui',
      addCommonColors: true,
      themes: {
        light: {
          colors: {},
        },
        dark: {
          colors: {},
        },
      },
    }),
  ],
};
