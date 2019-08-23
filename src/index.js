import { useState, useCallback } from "react";

export function useInputValidation(initialValue, hint, validator) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  const validate = useCallback(() => {
    if (!validator(value)) {
      setError(hint);
      return false;
    } else {
      setError(null);
      return true;
    }
  }, [validator, hint, value]);

  return { value, error, setValue, validate, reset };
}
