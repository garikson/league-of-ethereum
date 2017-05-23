export function setItem(key, value) {
  return localStorage.setItem(key, JSON.stringify(value)); // eslint-disable-line
}

export function getItem(key) {
  return JSON.parse(localStorage.getItem(key) || 'false'); // eslint-disable-line
}
