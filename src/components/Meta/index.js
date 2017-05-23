import html from 'dot-html';

export default function Meta(props) {
  document.title = props.title; // eslint-disable-line

  return html`<span></span>`;
}
