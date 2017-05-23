import hyperx from './hyperx'; // eslint-disable-line
import { createElement } from 'react';

const flatten = ary => ary.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

function camelCase (string) {
  return string.replace( /-([a-z])/ig, function( all, letter ) {
    return letter.toUpperCase();
  });
}

export function createElementProxy(tag, props, ...children) {

  if (props.style && props.style.trim) {
    var result = {};
    var input = props.style;
    var attributes = input.split(';');

    for (var i = 0; i < attributes.length; i++) {
      const entry = attributes[i].trim().split(':');
      const keyName = camelCase(entry.splice(0,1)[0]);
      result[keyName] = entry.join(':').trim();
    }
    props.style = result;
  }

  const higherComponent = (props || {}).higherComponent;
  const newProps = Object.assign({}, props);

  if (higherComponent) {
    delete newProps.higherComponent;
  }

  return createElement(higherComponent || tag, newProps, ...(children[0] ? flatten(children) : '')); // added children prop here..
}

export default function html(...args) {
  return hyperx(createElementProxy)(...args);
}
