import { type ReadableNode } from "./graphState";

export const classMap = (
  element: HTMLElement,
  values: { [key: string]: ReadableNode<boolean | undefined> },
) => {
  for (const key in values) {
    values[key].subscribe((value) => {
      if (value) {
        element.classList.add(key);
      } else {
        element.classList.remove(key);
      }
    });
  }
};

export const style = (
  element: HTMLElement,
  values: { [key: string]: ReadableNode<string | undefined> },
) => {
  for (const key in values) {
    values[key].subscribe((value) => {
      if (value) {
        element.style.setProperty(key, value);
      } else {
        element.style.removeProperty(key);
      }
    });
  }
};