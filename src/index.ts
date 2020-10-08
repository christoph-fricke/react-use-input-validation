import { useState, useCallback } from "react";

/**
 * React hook for managing an input value and it's validation.
 * A provided hint is used as a return error if the validation fails.
 *
 * @param initialValue Initial value used as the `value`
 * @param hint Replaces the error if `validate` fails
 * @param validator Predicate used in `validate` to decide whether or not the value is valid
 * @returns Return object contains the value, possible error (null if no error is present) and functions to:
 * - set the `value`
 * - validate the value (possible sets the `error`)
 * - reset the internal state
 */
export function useInputValidation<V, E>(
  initialValue: V,
  hint: E,
  validator: (value: V) => boolean
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<E | null>(null);

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
