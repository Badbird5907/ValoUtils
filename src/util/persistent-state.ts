import React from "react";

function usePersistentState<T>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const valueRef = React.useRef<T>(initialValue);
  const [value, setValue] = React.useState<T>(initialValue);

  const setPersistentValue: React.Dispatch<React.SetStateAction<T>> = (newValue) => {
    if (newValue instanceof Function) {
      // Support functional updates, like `setValue((prev) => prev + 1);`
      valueRef.current = newValue(valueRef.current);
      setValue(newValue);
    } else {
      valueRef.current = newValue;
      setValue(newValue);
    }
  };

  return [value, setPersistentValue];
}

export default usePersistentState;
