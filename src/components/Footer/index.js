import html from 'dot-html';
import styled from 'dot-styled-components';

const Wrapper = styled.div`
  padding: 20px;
  background: #F1F1F1;
  display: inline-block;
  position: fixed;
  bottom: 0px;
  left: 130px;
  right: 0px;
  font-size: 13px;
`;

export default function Footer() {
  return html`
    <div style="background-color: #222; color: #FFF; padding: 50px;">

      <div class="container">

        powered by <a target="_blank" href="http://boardroom.to" class="text-success">BoardRoom.to</a>

        <br />

      </div>
    </div>
  `;
}
