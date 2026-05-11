import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/Wiki/',
    component: ComponentCreator('/Wiki/', '65b'),
    exact: true
  },
  {
    path: '/Wiki/',
    component: ComponentCreator('/Wiki/', '989'),
    routes: [
      {
        path: '/Wiki/',
        component: ComponentCreator('/Wiki/', '812'),
        routes: [
          {
            path: '/Wiki/',
            component: ComponentCreator('/Wiki/', 'b41'),
            routes: [
              {
                path: '/Wiki/agentes-especializados',
                component: ComponentCreator('/Wiki/agentes-especializados', '12b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Wiki/framework-openclaw-multi-agente',
                component: ComponentCreator('/Wiki/framework-openclaw-multi-agente', 'cc9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Wiki/G4-Sprint-de-IA',
                component: ComponentCreator('/Wiki/G4-Sprint-de-IA', 'f3d'),
                exact: true
              },
              {
                path: '/Wiki/guia-claude-code',
                component: ComponentCreator('/Wiki/guia-claude-code', 'f70'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Wiki/guia-desenvolvimento-ia',
                component: ComponentCreator('/Wiki/guia-desenvolvimento-ia', '013'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/Wiki/refinamento-de-ideia',
                component: ComponentCreator('/Wiki/refinamento-de-ideia', '28f'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
