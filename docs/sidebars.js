// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  tutorialSidebar: [
    'intro',
    'providers',
    'endpoints',
    'testing',
    'privacy-policy',
    'terms-of-service',
    {
      type: 'category',
      label: 'Providers',
      items: [
        'providers/github',
        'providers/google',
        'providers/auth0',
        'providers/facebook',
        'providers/keycloak',
        'providers/credentials',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'database',
        'role-based-auth',
      ],
    },
  ]
};

export default sidebars;
