import { setTheme, injectGlobal, keyframes, css } from 'dot-styled-components';

const fadein = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

setTheme({
  fadein,
  row: css`
    box-sizing: border-box;
    clear: both;
    margin-left: -15px;
    margin-right: -15px;

    &:before {
      display: block;
      content: "";
      clear: both;
    }
    &:after {
      display: block;
      content: "";
      clear: both;
    }
  `,
  fadeinAnimation: `animation: ${fadein} .3s alternate;`,
  primary: '#4078c0',
  something: '#333',
});


injectGlobal`
  body, html {
    padding-bottom: 100px;
  }

  .pie svg {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    margin: auto;
    width: 100%;
  }

  .graph { visibility: hidden; }

  .graph > * {
    visibility: visible;
    transition: all 200ms ease-in-out;
  }

  .graph:hover > * { opacity: 0.5; }

  .graph__percent:hover {
    opacity: 1;
  }
`;

/* eslint no-unused-expressions: 0 */
