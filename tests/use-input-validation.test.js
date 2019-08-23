import { renderHook, act } from "@testing-library/react-hooks";
import { useInputValidation } from "../src/index";

test("initial value is used as the value", () => {
  const { result } = renderHook(() =>
    useInputValidation("Init value", "", () => true)
  );

  expect(result.current.value).toBe("Init value");
});

test("error is null when first rendered", () => {
  const { result } = renderHook(() =>
    useInputValidation("", "Error hint", () => false)
  );

  expect(result.current.error).toBe(null);
});

test("the predicate is used for validation and sets the error", () => {
  const predicate = jest.fn(() => false);
  const { result } = renderHook(() =>
    useInputValidation("", "Error hint", predicate)
  );

  act(() => {
    result.current.validate();
  });

  expect(predicate).toBeCalledTimes(1);
  expect(result.current.error).toBe("Error hint");
});

test("updating the value does not trigger a validation", () => {
  const predicate = jest.fn(() => false);
  const { result } = renderHook(() =>
    useInputValidation("", "Error hint", predicate)
  );

  act(() => {
    result.current.setValue("Test value");
  });

  expect(predicate).not.toBeCalled();
  expect(result.current.value).toBe("Test value");
});

test("validate uses the current value for validation", () => {
  const testValue = "Test value";
  const { result } = renderHook(() =>
    useInputValidation("", "Error hint", val => val === testValue)
  );

  act(() => {
    result.current.setValue(testValue);
  });
  act(() => {
    result.current.validate();
  });

  expect(result.current.error).toBe(null);
});

test("reset sets the value to the initial value and resets the error", () => {
  const { result } = renderHook(() =>
    useInputValidation("Init", "Error hint", () => false)
  );

  // Lets change the state around a bit...
  act(() => {
    result.current.setValue("Changed");
    result.current.validate();
  });

  expect(result.current.value).toBe("Changed");
  expect(result.current.error).toBe("Error hint");

  // ... and now we reset it
  act(() => {
    result.current.reset();
  });

  expect(result.current.value).toBe("Init");
  expect(result.current.error).toBe(null);
});
