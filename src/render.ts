import { type ReadableNode } from "./graphState";

export const classMap = (
  element: HTMLElement,
  values: { [key: string]: ReadableNode<boolean | undefined> }
) => {
  for (const key in values) {
    values[key].subscribe(value => {
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
  values: { [key: string]: ReadableNode<string | undefined> }
) => {
  for (const key in values) {
    values[key].subscribe(value => {
      if (value !== undefined) {
        if (value) {
          element.style.setProperty(key, value);
        } else {
          element.style.removeProperty(key);
        }
      }
    });
  }
};

export const text = (
  element: HTMLElement,
  value: ReadableNode<string | undefined>
) => {
  value.subscribe(value => {
    if (value !== undefined) {
      element.textContent = value;
    }
  });
};

export const show = (
  element: HTMLElement,
  value: ReadableNode<boolean | undefined>
) => {
  value.subscribe(value => {
    console.log(element, element.classList);
    if (value !== undefined) {
      element.style.display = value ? "" : "none";
      if (element.classList.contains("hidden") && value) {
        element.classList.remove("hidden");
      }
    }
  });
};
