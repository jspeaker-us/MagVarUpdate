import autoprefixer from 'autoprefixer';
import tailwindcss from '@tailwindcss/postcss';
import postcssMinify from 'postcss-minify';

/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: [autoprefixer, tailwindcss, postcssMinify],
};

export default config;
