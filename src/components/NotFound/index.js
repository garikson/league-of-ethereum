import html from 'dot-html';
import styled from 'dot-styled-components';

const Wrapper = styled.div`
  margin-top: 100px;
  font-family: Arial;
`;

export default function NotFound() {
  return html`
    <Wrapper>
      <h2>Page Not Found</h2>
    </Wrapper>
  `;
}
