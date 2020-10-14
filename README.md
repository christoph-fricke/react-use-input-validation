# use-input-validation

[![GitHub issues](https://flat.badgen.net/github/open-issues/christoph-fricke/use-input-validation)](https://github.com/christoph-fricke/use-input-validation/issues)
[![npm version](https://flat.badgen.net/npm/v/use-input-validation)](https://www.npmjs.com/package/use-input-validation)
![Dependencies](https://flat.badgen.net/david/dep/christoph-fricke/use-input-validation)
![BundleSize](https://flat.badgen.net/bundlephobia/minzip/use-input-validation)

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
- `reset`: Resets the value to the initial value and the error to `null`.

## License

This project is published under the MIT license. All contributions are welcome.
