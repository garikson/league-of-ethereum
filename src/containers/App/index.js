import html from 'dot-html';
import styled, { presets } from 'dot-styled-components';
import environments from 'contracts/lib/environments.json';

import Header from 'components/Header';
import Footer from 'components/Footer';

import { connect } from 'react-redux';
import { polyglot, localeTranslations } from 'i18n';

import { selectLocale } from './selectors';
import { loadBoard } from './actions';


const Wrapper = styled.div`
  padding: 20px;
`;

const OuterWrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 130px;
  right: 0px;
  bottom: 0px;
  padding-bottom: 100px;
  overflow: auto;
  overflow-x: hidden;
`;

function App(props) {
  // handle i18n
  if (polyglot.locale() !== props.locale) {
    polyglot.locale(props.locale);
    polyglot.replace(localeTranslations[props.locale]);
  }

  return html`
    <div>
      <Header></Header>
      ${props.children}
      <Footer></Footer>
    </div>
  `;
}

export function mapStateToProps(state) {
  return {
    locale: selectLocale(state),
  };
}

export default connect(mapStateToProps)(App);
