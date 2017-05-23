import Eth from 'ethjs';

export default function bnToString(value) {
  if ((value || {}).map) { // if an array
    return value.map(v => bnToString(v));
  }

  if (typeof value === 'object' && value !== null && !Eth.BN.isBN(value)) { // if an object
    const valueCopy = {};
    Object.keys(value).forEach(key => (valueCopy[key] = bnToString(value[key])));

    return valueCopy;
  }

  return Eth.BN.isBN(value) ? value.toString(10) : value; // is bn convert, else bypass
}
