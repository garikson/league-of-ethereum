import html from 'dot-html';
import styled, { css } from 'dot-styled-components';

import { Component } from 'react';

const OpacityAnimation = css`
  ${props => props.theme.fadeinAnimation}
`;

const NoOpacity = css`
  opacity: 0;
`; // should be 0

export default class FadeIn extends Component {
  render() {
    const self = this;
    const { className = NoOpacity, changed = false } = self.state || {};

    setTimeout(() => {
      if (!changed) {
        self.setState({ changed: true, className: OpacityAnimation });
      }
    }, 50);

    return html`<div className=${className}>${self.props.children}</div>`;
  }
}
