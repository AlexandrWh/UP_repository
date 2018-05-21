export function stringToDOMElement(s) {
  const template = document.createElement('template');
  template.innerHTML = s;
  return template.content.firstChild;
}

export function addClassIf(condition, className, elseClassName = '') {
  return condition ? (' ' + className) : (' ' + elseClassName);
}

export function renderIf(condition, html) {
  return condition ? html : '';
}

export function wrap(element) {
  const wrapper = document.createElement('div');
  wrapper.appendChild(element);
  return wrapper;
}

/**
 *
 * @param {[Element]} elements
 * @param {Element} wrapper
 * @returns {Element} Rendered element.
 */
export function render(elements, wrapper) {
  if (!Array.isArray(elements)) {
    elements = [elements];
  }

  elements.forEach(element => wrapper.appendChild(element));
  return wrapper;
}

/**
 * @param {String} tag 
 * @param {Object} props 
 * @param {[Element]} children 
 */
export function createElement(tag, props, ...children) {
  const element = document.createElement(tag);
  Object.keys(props).forEach((propName) => {
    element[propName] = props[propName]
  });
  children.forEach(child => element.appendChild(child));
  return element;
}

/**
 *
 * @param {Node} element
 * @returns {[Node]} removed children
 */
export function removeChildren(element) {
  const children = [];
  while (element.firstChild) {
    children.push(element.removeChild(element.firstChild));
  }
  return children;
}
