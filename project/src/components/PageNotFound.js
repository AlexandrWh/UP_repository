import { stringToDOMElement } from '../util';

export default function PageNotFound() {
  return stringToDOMElement(`
    Ooops! Page not found!
  `.trim());
}
