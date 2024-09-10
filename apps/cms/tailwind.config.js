import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    fontFamily: {
      sans: ['Nunito', ...defaultTheme.fontFamily.sans],
      handwriting: ['Sofia', ...defaultTheme.fontFamily.sans],
    },
    extend: {},
  },
  plugins: [
    ({ addComponents, addVariant }) => {
      addVariant('sm-only', "@media screen and (max-width: theme('screens.sm'))");
      addComponents({
        '.flex-center-between': {
          alignItems: 'center',
          justifyContent: 'space-between',
          display: 'flex',
        },
        '.flex-center': {
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        },
        '.skeleton': {
          '@apply animate-pulse rounded bg-slate-200 dark:bg-slate-700': {},
        },
      });
    },
  ],
};
