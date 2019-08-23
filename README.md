# use-input-validation

[![GitHub issues](https://img.shields.io/github/issues/christoph-fricke/use-input-validation?style=flat-square)](https://github.com/christoph-fricke/use-input-validation/issues)
[![GitHub license](https://img.shields.io/github/license/christoph-fricke/use-input-validation?style=flat-square)](https://github.com/christoph-fricke/use-input-validation/blob/master/LICENSE)

> useInputValidation is a React hook for validation inputs. It makes the
> validation process easy and keeps your components clean.

## Usage example

```jsx
import React from "react";
import { useInputValidation } from "use-input-validation";

function Component(props) {
  const { value, setValue, error, validate, reset } = useInputValidation(
    "initial Value",
    "Error hint",
    value => true
  );

  function handleSubmit(e) {
    e.preventDefault();

    // reassure that the value is valid
    if (!validate()) return;

    // Do submit handle stuff
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={validate}
      />
      {error && <span>{error}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Usage example for multiple inputs

```jsx
import React from "react";
import { useInputValidation } from "use-input-validation";

function Component(props) {
  // I recommend to rename the destructured values if
  // you use multiple inputs
  const {
    value: name,
    setValue: setName,
    error: nameError,
    validate: validateName,
    reset: resetName
  } = useInputValidation("initial Value", "Error hint", value => true);

  // Alternatively you can name the returned object and
  // use it as a namespace
  const email = useInputValidation(
    "initial Value",
    "Error hint",
    value => true
  );

  function handleSubmit(e) {
    e.preventDefault();

    // Call all validation functions first. This way all inputs are
    // validated and all errors can be updated and displayed.
    const nameValid = validateName();
    const emailValid = email.validate();

    // Then you can make sure that all inputs are valid
    if (!(nameValid && emailValid)) return;

    // Do submit handle stuff
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        onBlur={validateName}
      />
      {nameError && <span>{nameError}</span>}
      <input
        type="email"
        value={email.value}
        onChange={e => email.setValue(e.target.value)}
        onBlur={email.validate}
      />
      {email.error && <span>{email.error}</span>}
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

## API

```ts
function useInputValidation<V, E>(
  initialValue: V,
  hint: E,
  validator: (value: V) => boolean
): {
  value: V;
  error: E | null;
  setValue: React.Dispatch<React.SetStateAction<V>>;
  validate: () => boolean;
  reset: () => void;
};
```

### Parameters

- `initialValue`: Initial value that is assigned to the value
- `hint`: Error hint used to replace the error with if validate fails
- `validator`: Predicate used as a decider for the validate function

### Return object

- `value`: Value which can be applied to inputs and textareas
- `error`: Equals the `hint` if the validator fails. Otherwise it is `null`
- `validate`: Triggers a validation if the value
- `reset`: Resets the value to the initial value and the error to `null`

## License

This project is published under the MIT license. All contributions are welcome.
