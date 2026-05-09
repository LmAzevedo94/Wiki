module.exports = {
  title: 'Wiki',
  tagline: 'Documentação',
  url: 'https://lmazevedo94.github.io',
  baseUrl: '/Wiki/',

  organizationName: 'LmAzevedo94',
  projectName: 'Wiki',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',



  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Wiki',
    },

    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  },
};
