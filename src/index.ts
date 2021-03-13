import { useState, useCallback } from "react";

interface InputValidation<V, E> {
  /** Currently stored value. */
  value: V;
  /** Currently evaluated error. Will be `null` initially or every time `validate` evaluates the `value` as valid. */
  error: E | null;
  /** Sets a new value. Like `setState` from `useState` it also accepts a function in case you need the previous value. */
  setValue(update: V | ((prevValue: V) => V)): void;
  /** Validates the current value and sets `error` depending in the validation result. */
  validate(): boolean;
  /**
   * Resets all internal state back to the save point created by `commit` or the
   * initial state of no save point exists.
   */
  reset(): void;
  /**
   * Save changes done to the value as a new save point. Calling `reset` will
   * reset to this save point instead of the initial state.
   * @param state Alternative value that should be used as a save point.
   * Uses the current `value` if this argument is undefined.
   */
  commit(state?: V): void;
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
 * @returns Return object contains the `value`, possible `error`
 * (null if no error is present) and functions to:
 * - set the `value`
 * - validate the value (sets the `error` accordingly)
 * - reset the internal state
 * - commit changes as a new save point for reset
 */
export function useInputValidation<V, E>(
  initialValue: V,
  staticHint: E,
  validator: (value: V) => E | boolean
): InputValidation<V, E> {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<E | null>(null);
  const [savePoint, setSavePoint] = useState(initialValue);

  const reset = useCallback(() => {
    setValue(savePoint);
    setError(null);
  }, [savePoint]);

  const commit = useCallback((state?: V) => {
    setSavePoint(state ?? value);
  }, [value])

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

  return { value, error, setValue, validate, reset, commit };
}
