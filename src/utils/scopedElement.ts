// Creates an element that picks up the scoped styles of the component `ref` belongs to, by
// copying Astro's data-astro-cid-* attributes — needed when markup is built in the browser.
export function scopedElement(tag: string, className: string, text: string, ref: Element): HTMLElement {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  for (const attribute of Array.from(ref.attributes)) {
    if (attribute.name.startsWith('data-astro-cid')) element.setAttribute(attribute.name, '');
  }
  return element;
}
