import React from 'react';
import {Home} from '@vis.gl/docusaurus-website/components';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styled from 'styled-components';
import Layout from '@theme/Layout';

const TextContainer = styled.div`
max-width: 800px;
padding: 64px 112px;
font-size: 16px;

h2 {
  font: bold 32px/48px;
  margin: 24px 0 16px;
  position: relative;
}
h3 {
  font: bold 16px/24px;
  margin: 16px 0 0;
  position: relative;
}
div {
  display: flex;
  align-items: center;
  margin-top: 1em;
}
div > img {
  margin-right: 1em;
}
hr {
  border: none;
  background: #E1E8F0;
  height: 1px;
  margin: 24px 0 0;
  width: 32px;
  height: 2px;
}
@media screen and (max-width: 768px) {
  max-width: 100%;
  width: 100%;
  padding: 48px 48px 48px 80px;
}
`;

export default function IndexPage() {
  const baseUrl = useBaseUrl('/');

  return (
    <Layout title="Home" description="mjolnir.js">
      <>
        <Home />
        <TextContainer>
          <h2>
            A dependency-free input handling and gesture recognition system
          </h2>
          <hr className="short" />

          <div>
            <img src={`${baseUrl}images/icon-high-precision.svg`} />
            Predictable behavior across browsers and input devices
          </div>

          <div>
            <img src={`${baseUrl}images/icon-typescript.svg`} />
            Fully typed API
          </div>

          <div>
            <img src={`${baseUrl}images/icon-react.svg`} />
            Treeshakable and SSR-ready ESM package
          </div>

        </TextContainer>
      </>
    </Layout>
  );
}
