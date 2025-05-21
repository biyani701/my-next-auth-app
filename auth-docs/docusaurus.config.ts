import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Auth.js Documentation',
  tagline: 'Authentication made simple for your portfolio',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://vishal.biyani.xyz',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/auth-docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'vishalbiyani', // Usually your GitHub org/user name.
  projectName: 'next-auth-example', // Usually your repo name.

  onBrokenLinks: 'throw',
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
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/vishalbiyani/next-auth-example/tree/main/auth-docs/',
          routeBasePath: '/', // Set docs as the root
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Auth.js Docs',
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
          type: 'dropdown',
          label: 'Providers',
          position: 'left',
          items: [
            {
              label: 'GitHub',
              to: '/docs/providers/github',
            },
            {
              label: 'Google',
              to: '/docs/providers/google',
            },
            {
              label: 'Facebook',
              to: '/docs/providers/facebook',
            },
            {
              label: 'Auth0',
              to: '/docs/providers/auth0',
            },
            {
              label: 'Adding New Providers',
              to: '/docs/providers/adding-new-providers',
            },
          ],
        },
        {
          href: 'https://github.com/vishalbiyani/next-auth-example',
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
              to: '/docs/intro',
            },
            {
              label: 'Configuration',
              to: '/docs/configuration',
            },
            {
              label: 'Providers',
              to: '/docs/providers',
            },
          ],
        },
        {
          title: 'Auth.js Resources',
          items: [
            {
              label: 'Auth.js Official Docs',
              href: 'https://authjs.dev/',
            },
            {
              label: 'GitHub Repository',
              href: 'https://github.com/nextauthjs/next-auth',
            },
          ],
        },
        {
          title: 'Portfolio',
          items: [
            {
              label: 'Portfolio Website',
              href: 'https://vishal.biyani.xyz',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/vishalbiyani',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Vishal Biyani. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
