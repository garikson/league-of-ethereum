import html from 'dot-html';
import styled, { presets } from 'dot-styled-components';

const presetMap = { xs: 'mobile', sm: 'phablet', md: 'tablet', lg: 'desktop', xl: 'hd' };

const flex = size => styled.css`
  @media only screen and ${styled.presets[presetMap[size]]} {
    ${props => (props[`${size}`] ? `margin: ${props[`${size}`]};` : '')}
    ${props => (props[`${size}-top`] ? `margin-top: ${props[`${size}-top`]};` : '')}
    ${props => (props[`${size}-bottom`] ? `margin-bottom: ${props[`${size}-bottom`]};` : '')}
    ${props => (props[`${size}-left`] ? `margin-left: ${props[`${size}-left`]};` : '')}
    ${props => (props[`${size}-right`] ? `margin-right: ${props[`${size}-right`]};` : '')}
  }
`;

export const css = styled.css`
  ${flex('xs')}
  ${flex('sm')}
  ${flex('md')}
  ${flex('lg')}
  ${flex('xl')}
`;

const Wrapper = styled.div`
  ${css}
`;

export default function Margin(props) {
  return html`
    <Wrapper props=${props} className=${props.class}>
      ${props.children}
    </Wrapper>
  `;
}
