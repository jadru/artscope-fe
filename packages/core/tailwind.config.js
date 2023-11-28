/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');
const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontSize: {
      sm: '0.7rem',
      base: '0.95rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.563rem',
      '4xl': '2.953rem',
      '5xl': '3.441rem',
    },
    extend: {
      fontFamily: {
        primary: ['var(--ibm-plex-sans-kr)', ...fontFamily.sans],
        secondary: ['var(--noto-serif-kr)', ...fontFamily.serif],
      },
      animation: {
        fade: 'fadeOut 1s ease-in-out',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'nextui',
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#07A0C3',
            },
            secondary: {
              DEFAULT: '#086788',
            },
            accent: {
              DEFAULT: '#F0c808',
            },
            danger: {
              DEFAULT: '#DD1C1A',
            },
          },
        },
        dark: {
          colors: {},
        },
      },
    }),
  ],
};
