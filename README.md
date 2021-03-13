# use-input-validation

[![GitHub issues](https://shields.io/github/issues-raw/christoph-fricke/use-input-validation?style=for-the-badge)](https://github.com/christoph-fricke/use-input-validation/issues)
[![latest release](https://shields.io/github/v/release/christoph-fricke/use-input-validation?style=for-the-badge)](https://github.com/christoph-fricke/use-input-validation/releases/latest)
![dependencies](https://shields.io/david/christoph-fricke/use-input-validation?style=for-the-badge)
[![bundle size](https://shields.io/bundlephobia/minzip/use-input-validation?style=for-the-badge)](https://bundlephobia.com/result?p=use-input-validation)

> `useInputValidation` is a React hook for validating inputs. It makes the
> validation process easy and keeps your component logic clean.

## Usage example

```jsx
import React from "react";
import { useInputValidation } from "use-input-validation";

function Component(props) {
  // name can be destructured to: { value, setValue, error, validate, reset }
  const name = useInputValidation(
    "", // initial `value`
    "name can not be empty", // hint used as `error` if `validate` fails
    (value) => value.trim() !== "" // predicate used in `validate`
  );

  function handleSubmit(e) {
    e.preventDefault();

    // reassure that the value is valid
    if (!name.validate()) return;

    // Do submit handle stuff
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name.value}
        onChange={(e) => name.setValue(e.target.value)}
        onBlur={name.validate}
      />
      {name.error && <span>{name.error}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### With multiple inputs

```jsx
import React from "react";
import { useInputValidation } from "use-input-validation";

// Notice the use of returned hints by the validator function for passwords.
// If your validator returns non boolean values these will be used as the error
// instead of the static hint.
function isValidPassword(pw) {
  if (pw.trim().length < 12) return "Password is to short";

  // Maybe some more logic here...

  return true;
}

function Component(props) {
  const name = useInputValidation(
    "",
    "name can not be empty",
    (value) => value.trim() !== ""
  );
  const password = useInputValidation(
    "",
    "password requirements not met",
    isValidPassword
  );

  function handleSubmit(e) {
    e.preventDefault();

    // Call all validation functions first. This way all inputs are
    // validated and all errors can be updated and displayed.
    const nameValid = name.validate();
    const emailValid = password.validate();

    // Then you can make sure that all inputs are valid
    if (!(nameValid && emailValid)) return;

    // Do submit handle stuff
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name.value}
        onChange={(e) => name.setValue(e.target.value)}
        onBlur={name.validate}
      />
      {name.error && <span>{name.error}</span>}
      <input
        type="password"
        value={password.value}
        onChange={(e) => password.setValue(e.target.value)}
        onBlur={password.validate}
      />
      {password.error && <span>{password.error}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Warning

**Do not set the value and validate in the same react render cycle.**

React may not have updated the state by the time validate is executed which
means a value is validated which is outdated by the time the render cycle
finishes.

_This should not be a problem you encounter in a typical user form szenario._

## Api

```ts
function useInputValidation<V, E>(
  initialValue: V,
  staticHint: E,
  validator: (value: V) => E | boolean
): {
  value: V;
  error: E | null;
  setValue(update: V | ((prevValue: V) => V)): void;;
  validate(): boolean;
  reset(): void;
  commit(state?: V): void;
};
```

### Parameters

- `initialValue`: Initial value that is assigned to the `value`.
- `hint`: Error hint used to replace the `error` if `validate` evaluates the
  `value` as invalid.
- `validator`: Predicate used as a decider for the validate function. It can
  return a `boolean` or some `hint`. If a hint is returned it will be used for
  the `error` and evaluated as an invalid value. This allows you to dynamically
  set the `error`.

### Return object

- `value`: Value which can be applied to inputs and text-areas.
- `error`: Equals the `hint` or returned hint from the `validator` if the
  validator return not `true`. Otherwise it is `null`. Will be `null` initially.
- setValue:
- `validate`: Validates the current value and sets `error` depending in the
  validation result.
- `commit`: Creates a save point for `reset`. The save point consists of the
  current value or an optional, provided state. Later calling `reset` will reset
  to the latest save point.
- `reset`: Resets the value to the latest save point (equals the initial value
  until `commit` is called) and the error to `null`.

## License

This project is published under the MIT license. All contributions are welcome.
