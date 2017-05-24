import { render } from 'react-dom';
import { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import 'styles';
import sheetRouter from 'sheet-router';
import href from 'sheet-router/href';
import past from 'sheet-router/history';

import html from 'dot-html';

import { Router, changeLocation } from 'routes';
import { store } from 'store';

import { selectBoards } from 'containers/App/selectors';
import { loadNetwork, loadAccount, loadBoard } from 'containers/App/actions';

import { getItem } from 'utils/localStore';
import environments from 'contracts/lib/environments.json';

const { dispatch, getState } = store;

// update location
dispatch(changeLocation(window.location.pathname)); // eslint-disable-line

// main App Component
class App extends Component { // eslint-disable-line
  render() {
    const windowLocation = window.location.pathname; // eslint-disable-line

    return html`
      <Provider store=${store}><Router store=${store} defaultLocation=${windowLocation}></Router></Provider>
    `;
  }
}


// on window load, render
window.addEventListener('load', () => { // eslint-disable-line
  setTimeout(() => dispatch(loadAccount()), 3000);
  dispatch(loadNetwork());

  render( // eslint-disable-line
    html`<App></App>`, // eslint-disable-line
    document.getElementById('container'), // eslint-disable-line
  );
}); // eslint-disable-line
