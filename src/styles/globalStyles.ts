'use client';

import { createGlobalStyle } from 'styled-components';
import { weddingConfig } from '../config/wedding-config';

const watermarkId = weddingConfig.meta._jwk_watermark_id || 'JWK-NonCommercial';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'MaruBuri';
    src: url('/fonts/MaruBuri-ExtraLight.ttf') format('truetype');
    font-weight: 200;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: 'MaruBuri';
    src: url('/fonts/MaruBuri-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: 'MaruBuri';
    src: url('/fonts/MaruBuri-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: 'MaruBuri';
    src: url('/fonts/MaruBuri-SemiBold.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: 'MaruBuri';
    src: url('/fonts/MaruBuri-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: block;
  }
  @font-face {
    font-family: 'PlayfairDisplay';
    src: url('/fonts/PlayfairDisplay-Italic.ttf') format('truetype');
    font-weight: normal;
    font-style: italic;
    font-display: block;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    visibility: visible;
    opacity: 1;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: 'MaruBuri', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    font-weight: 300;
    color: var(--text-dark);
    margin: 0;
    padding: 0;
    line-height: 1.8;
    background-color: #E8E4DF;
    overflow-x: hidden;
  }

  /* 모바일 청첩장 컨테이너 */
  main {
    max-width: 480px;
    margin: 0 auto;
    background-color: var(--bg-primary);
    min-height: 100vh;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.08);
    position: relative;
  }

  body::after {
    content: "${watermarkId}";
    position: fixed;
    bottom: -100px;
    right: -100px;
    opacity: 0.01;
    font-size: 8px;
    transform: rotate(-45deg);
    pointer-events: none;
    z-index: -1000;
    color: rgba(0, 0, 0, 0.02);
    user-select: none;
  }

  .jwk-watermark {
    position: absolute;
    opacity: 0.01;
    font-size: 1px;
    color: rgba(255, 255, 255, 0.01);
    pointer-events: none;
    user-select: none;
    z-index: -9999;
  }

  .wedding-container {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' opacity='0.01'%3E%3Ctext x='0' y='20' fill='rgba(0,0,0,0.03)'%3EJWK-TEMPLATE%3C/text%3E%3C/svg%3E");
  }

  :root {
    --bg-primary: #FAF8F5;
    --bg-secondary: #F2EDE6;
    --bg-white: #FFFFFF;

    --accent: #C4A07A;
    --accent-dark: #8C6D55;
    --accent-light: #E8D8C4;

    --text-dark: #262220;
    --text-mid: #6B6560;
    --text-light: #ACA9A5;

    --border: #E0D8CE;
    --border-light: #EDE8E2;

    /* Legacy variables for compatibility */
    --primary-color: #FAF8F5;
    --secondary-color: #C4A07A;
    --text-medium: #6B6560;

    --section-padding: 5rem 1.5rem;
    --max-width: 480px;
    --transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
  }
`;
