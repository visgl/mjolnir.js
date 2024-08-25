import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/mjolnir.js/docs',
    component: ComponentCreator('/mjolnir.js/docs', '29f'),
    routes: [
      {
        path: '/mjolnir.js/docs',
        component: ComponentCreator('/mjolnir.js/docs', 'f25'),
        exact: true,
        sidebar: "docsSidebar"
      },
      {
        path: '/mjolnir.js/docs/api-reference/event-manager',
        component: ComponentCreator('/mjolnir.js/docs/api-reference/event-manager', '483'),
        exact: true,
        sidebar: "docsSidebar"
      },
      {
        path: '/mjolnir.js/docs/api-reference/pan',
        component: ComponentCreator('/mjolnir.js/docs/api-reference/pan', 'f3f'),
        exact: true,
        sidebar: "docsSidebar"
      },
      {
        path: '/mjolnir.js/docs/api-reference/pinch',
        component: ComponentCreator('/mjolnir.js/docs/api-reference/pinch', '573'),
        exact: true,
        sidebar: "docsSidebar"
      },
      {
        path: '/mjolnir.js/docs/api-reference/press',
        component: ComponentCreator('/mjolnir.js/docs/api-reference/press', '376'),
        exact: true,
        sidebar: "docsSidebar"
      },
      {
        path: '/mjolnir.js/docs/api-reference/rotate',
        component: ComponentCreator('/mjolnir.js/docs/api-reference/rotate', '644'),
        exact: true,
        sidebar: "docsSidebar"
      },
      {
        path: '/mjolnir.js/docs/api-reference/swipe',
        component: ComponentCreator('/mjolnir.js/docs/api-reference/swipe', '4cd'),
        exact: true,
        sidebar: "docsSidebar"
      },
      {
        path: '/mjolnir.js/docs/api-reference/tap',
        component: ComponentCreator('/mjolnir.js/docs/api-reference/tap', '2f1'),
        exact: true,
        sidebar: "docsSidebar"
      },
      {
        path: '/mjolnir.js/docs/api-reference/types',
        component: ComponentCreator('/mjolnir.js/docs/api-reference/types', '331'),
        exact: true,
        sidebar: "docsSidebar"
      },
      {
        path: '/mjolnir.js/docs/get-started',
        component: ComponentCreator('/mjolnir.js/docs/get-started', 'f40'),
        exact: true
      },
      {
        path: '/mjolnir.js/docs/upgrade-guide',
        component: ComponentCreator('/mjolnir.js/docs/upgrade-guide', 'd0d'),
        exact: true,
        sidebar: "docsSidebar"
      },
      {
        path: '/mjolnir.js/docs/whats-new',
        component: ComponentCreator('/mjolnir.js/docs/whats-new', 'b58'),
        exact: true,
        sidebar: "docsSidebar"
      }
    ]
  },
  {
    path: '/mjolnir.js/examples',
    component: ComponentCreator('/mjolnir.js/examples', '948'),
    routes: [
      {
        path: '/mjolnir.js/examples',
        component: ComponentCreator('/mjolnir.js/examples', '850'),
        exact: true,
        sidebar: "examplesSidebar"
      },
      {
        path: '/mjolnir.js/examples/event-manager',
        component: ComponentCreator('/mjolnir.js/examples/event-manager', '054'),
        exact: true,
        sidebar: "examplesSidebar"
      },
      {
        path: '/mjolnir.js/examples/image-viewer',
        component: ComponentCreator('/mjolnir.js/examples/image-viewer', '405'),
        exact: true,
        sidebar: "examplesSidebar"
      }
    ]
  },
  {
    path: '/mjolnir.js/',
    component: ComponentCreator('/mjolnir.js/', 'da0'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
