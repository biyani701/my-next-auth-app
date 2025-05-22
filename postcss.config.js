/**
 * PostCSS configuration for Tailwind CSS v4
 * This ensures compatibility with Vercel deployment
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'autoprefixer': {},
  },
}
