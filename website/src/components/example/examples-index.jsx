import React from 'react';
// Note: this is internal API and may change in a future release
// https://github.com/facebook/docusaurus/discussions/7457
import {useDocsSidebar} from "@docusaurus/theme-common/internal";
import useBaseUrl from '@docusaurus/useBaseUrl';

import {
  MainExamples,
  ExamplesGroup,
  ExampleCard,
  ExampleHeader,
  ExampleTitle
} from './styled';

function renderItem(item, getThumbnail) {
  const imageUrl = useBaseUrl(getThumbnail(item));
  const {label, href} = item;

  return (
    <ExampleCard key={label} href={href}>
      <img width="100%" src={imageUrl} alt={label} />
      <ExampleTitle>
        <span>{label}</span>
      </ExampleTitle>
    </ExampleCard>
  );
}

function renderCategory({label, items}, getThumbnail) {
  return [
    <ExampleHeader key={`${label}-header`}>{label}</ExampleHeader>,
    <ExamplesGroup key={label}>
      {items.map(item => renderItem(item, getThumbnail))}
    </ExamplesGroup>
  ];
}

export default function ExamplesIndex({getThumbnail}) {
  const sidebar = useDocsSidebar();

  const pages = sidebar.items.filter(item => item.type !== 'category' && item.docId !== 'index');
  const categories = sidebar.items.filter(item => item.type === 'category');

  return <MainExamples>
    <ExamplesGroup>
      {
        pages.map(item => renderItem(item, getThumbnail))
      }
    </ExamplesGroup>
    {
      categories.map(item => renderCategory(item, getThumbnail))
    }
  </MainExamples>;
}
