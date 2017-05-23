import html from 'dot-html';
import styled, { presets } from 'dot-styled-components';

const presetMap = { xs: 'mobile', sm: 'phablet', md: 'tablet', lg: 'desktop', xl: 'hd' };

export const flex = size => styled.css`
  @media only screen and ${styled.presets[presetMap[size]]} {
    ${props => (props[`${size}-flex`] ? `flex: ${props[`${size}-flex`]};` : '')}
    ${props => (props[`${size}-basis`] ? `flex-basis: ${props[`${size}-basis`]};` : '')}
    ${props => (props[`${size}-align`] ? `align-self: ${props[`${size}-align`]};` : '')}
  }
`;

export const css = styled.css`
  ${flex('xs')}
  ${flex('sm')}
  ${flex('md')}
  ${flex('lg')}
  ${flex('xl')}
`;

export const Wrapper = styled.div`
  ${css}
`;

export default function Col(props) {
  return html`
    <Wrapper props=${props}>
      ${props.children}
    </Wrapper>
  `;
}
