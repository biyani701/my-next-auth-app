// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Auth.js Documentation',
  tagline: 'Authentication for your portfolio application',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://biyani701.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/my-next-auth-app/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'biyani701', // Usually your GitHub org/user name.
  projectName: 'my-next-auth-app', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Auth.js social card
      image: 'img/logo.svg',
      navbar: {
        title: 'Auth.js Documentation',
        logo: {
          alt: 'Auth.js Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/providers',
            label: 'Providers',
            position: 'left',
          },
          {
            to: '/endpoints',
            label: 'Endpoints',
            position: 'left',
          },
          {
            to: '/testing',
            label: 'Testing',
            position: 'left',
          },
          {
            href: 'https://github.com/biyani701/my-next-auth-app',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Getting Started',
                to: '/intro',
              },
              {
                label: 'Providers',
                to: '/providers',
              },
              {
                label: 'Endpoints',
                to: '/endpoints',
              },
              {
                label: 'Testing',
                to: '/testing',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Auth.js Official Docs',
                href: 'https://authjs.dev',
              },
              {
                label: 'Keycloak Documentation',
                href: 'https://www.keycloak.org/documentation',
              },
              {
                label: 'OAuth 2.0',
                href: 'https://oauth.net/2/',
              },
            ],
          },
          {
            title: 'Links',
            items: [
              {
                label: 'Portfolio',
                href: 'https://vishal.biyani.xyz',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/biyani701/my-next-auth-app',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Vishal Biyani. All rights reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
