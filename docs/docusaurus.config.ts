import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AltGosling',
  tagline: 'Automatic Generation of Text Descriptions for Accessible Genomics Data Visualization',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://gosling-lang.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'gosling-lang', // Usually your GitHub org/user name.
  projectName: 'altgosling-docs', // Usually your repo name.

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
        },
        blog: {
          showReadingTime: true,
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
      title: 'AltGosling',
      logo: {
        alt: 'AltGosling Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        { to: '/about', label: 'About', position: 'left' },
        {
          href: 'https://github.com/gosling-lang/altgosling',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
          ],
        },
        {
          title: 'Try it out',
          items: [
            {
              label: 'Demo',
              href: 'https://gosling-lang.github.io/altgosling',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'About',
              to: '/about',
            },
            {
              label: 'HIDIVE Lab',
              href: 'https://hidivelab.org',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/gosling-lang/altgosling',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Harvard Medical School.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
