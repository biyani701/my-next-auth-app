/**
 * PostCSS configuration that works with both Tailwind CSS v3 and v4
 * This ensures compatibility with Vercel deployment
 */
module.exports = {
  plugins: {
    // For Tailwind CSS v4+, use @tailwindcss/postcss
    // For Tailwind CSS v3 and below, use tailwindcss
    // This try-catch ensures the build doesn't fail if one package is missing
    ...(() => {
      try {
        const tailwindVersion = require('tailwindcss').version;
        if (tailwindVersion.startsWith('4')) {
          return { '@tailwindcss/postcss': {} };
        }
        return { 'tailwindcss': {} };
      } catch (e) {
        // If tailwindcss is not found, try @tailwindcss/postcss
        try {
          require('@tailwindcss/postcss');
          return { '@tailwindcss/postcss': {} };
        } catch (e) {
          // If neither is found, default to tailwindcss
          // This will show a clearer error if both are missing
          return { 'tailwindcss': {} };
        }
      }
    })(),
    autoprefixer: {},
  },
}
