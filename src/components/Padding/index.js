import html from 'dot-html';
import styled, { presets } from 'dot-styled-components';

const presetMap = { xs: 'mobile', sm: 'phablet', md: 'tablet', lg: 'desktop', xl: 'hd' };

const flex = size => styled.css`
  @media only screen and ${styled.presets[presetMap[size]]} {
    ${props => (props[`${size}`] ? `padding: ${props[`${size}`]};` : '')}
    ${props => (props[`${size}-top`] ? `padding-top: ${props[`${size}-top`]};` : '')}
    ${props => (props[`${size}-bottom`] ? `padding-bottom: ${props[`${size}-bottom`]};` : '')}
    ${props => (props[`${size}-left`] ? `padding-left: ${props[`${size}-left`]};` : '')}
    ${props => (props[`${size}-right`] ? `padding-right: ${props[`${size}-right`]};` : '')}
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

export default function Padding(props) {
  return html`
    <Wrapper props=${props}>
      ${props.children}
    </Wrapper>
  `;
}
