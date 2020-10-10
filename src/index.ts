import { useState, useCallback } from "react";

interface InputValidation<V, E> {
  value: V;
  error: E | null;
  setValue(update: V | ((prevValue: V) => V)): void;
  validate(): boolean;
  reset(): void;
}

/**
 * React hook for managing an input value and it's validation.
 * A provided _static hint_ is used as a return error if the validation fails.
 * Alternatively a _dynamic hint_ from the given `validator` will be used.
 *
 * @param initialValue Initial value used as the `value`.
 * @param staticHint Replacement for the `error` if `validator` returns a `boolean`.
 * @param validator Predicate used in `validate` to decide whether or not the
 * value is valid. It can either return a `boolean` or a _dynamic hint_ which will
 * be assigned to `error` and interpreted as `false`.
 *
 * @returns Return object contains the value, possible error
 * (null if no error is present) and functions to:
 * - set the `value`
 * - validate the value (possible sets the `error`)
 * - reset the internal state
 */
export function useInputValidation<V, E>(
  initialValue: V,
  staticHint: E,
  validator: (value: V) => E | boolean
): InputValidation<V, E> {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<E | null>(null);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  const validate = useCallback(() => {
    const result = validator(value);

    if (typeof result !== "boolean") {
      setError(result);
      return false;
    } else if (!result) {
      setError(staticHint);
      return false;
    } else {
      setError(null);
      return true;
    }
  }, [validator, staticHint, value]);

  return { value, error, setValue, validate, reset };
}
