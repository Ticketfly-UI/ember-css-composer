import data from '../css-classes-json';

export default function lookup(key) {
  return data[key] || [];
}