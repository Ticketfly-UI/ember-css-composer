import lookupClasses from './utils/lookup-classes';

export default function classify(inputName) {
  return lookupClasses(inputName).join(' ');
}