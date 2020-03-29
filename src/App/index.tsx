import React from 'react';

import { ScrollWheel } from 'components';
import SpotifyProvider from 'services/spotify';
import WindowProvider from 'services/window';
import styled, { createGlobalStyle } from 'styled-components';

import Interface from './Interface';

const GlobalStyles = createGlobalStyle`
   body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      font-size: 16px;
      box-sizing: border-box;
   }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-app-region: drag;
`;

const Shell = styled.div`
  position: relative;
  height: 100vh;
  margin: auto;
  max-height: 36.5em;
  width: 370px;
  border-radius: 30px;
  box-shadow: inset 0 0 2.4em #555;
  background: linear-gradient(180deg, #e3e3e3 0%, #d6d6d6 100%);
  animation: descend 1.5s ease;

  @media (prefers-color-scheme: dark) {
    box-shadow: inset 0 0 2.4em black;
  }

  @keyframes descend {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const App: React.FC = () => {
  return (
    <Container>
      <GlobalStyles />
      <SpotifyProvider>
        <WindowProvider>
          <Shell>
            <Interface />
            <ScrollWheel />
          </Shell>
        </WindowProvider>
      </SpotifyProvider>
    </Container>
  );
};

export default App;
