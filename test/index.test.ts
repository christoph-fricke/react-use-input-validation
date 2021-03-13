import { renderHook, act } from "@testing-library/react-hooks";
import { useInputValidation } from "../src/index";

describe("useInputValidation", () => {
  describe("initial state", () => {
    it("should use the given value as the value", () => {
      const { result } = renderHook(() =>
        useInputValidation("Init value", "", () => true)
      );

      expect(result.current.value).toBe("Init value");
    });

    it("should use null for the initial error", () => {
      const { result } = renderHook(() =>
        useInputValidation("", "Error hint", () => false)
      );

      expect(result.current.error).toBe(null);
    });
  });

  describe("setValue", () => {
    it("should update the current value", () => {
      const { result } = renderHook(() =>
        useInputValidation("", "Error hint", () => false)
      );

      act(() => {
        result.current.setValue("Test value");
      });

      expect(result.current.value).toBe("Test value");
    });

    it("should supply the previous value to an update function", () => {
      const update = jest.fn().mockReturnValue("Test value");
      const { result } = renderHook(() =>
        useInputValidation("Initial", "Error hint", () => false)
      );

      act(() => {
        result.current.setValue(update);
      });

      expect(update).toBeCalledWith("Initial");
      expect(result.current.value).toBe("Test value");
    });

    it("should not trigger a validation if the value is updated", () => {
      // Not typing the predicate causes TS to missinterpret the generic for V and
      // assuming that it is a string literal and not a string.
      const predicate = jest.fn<boolean, []>().mockReturnValue(false);

      const { result } = renderHook(() =>
        useInputValidation("", "Error hint", predicate)
      );

      act(() => {
        result.current.setValue("Test value");
      });

      expect(predicate).not.toBeCalled();
    });
  });

  describe("validate", () => {
    it("should use the given predicate for validation", () => {
      const predicate = jest.fn().mockReturnValue(true);
      const { result } = renderHook(() =>
        useInputValidation("", "Error hint", predicate)
      );

      act(() => {
        result.current.validate();
      });

      expect(predicate).toBeCalledTimes(1);
      expect(result.current.error).toBe(null);
    });

    it("should use the predicate return value as error if it is not a boolean", () => {
      const { result } = renderHook(() =>
        useInputValidation("", "Error hint", () => "Dynamic information")
      );
      let valid;

      act(() => {
        valid = result.current.validate();
      });

      expect(valid).toBe(false);
      expect(result.current.error).toBe("Dynamic information");
    });

    it("should set the error if the predicate evaluates to false", () => {
      const { result } = renderHook(() =>
        useInputValidation("", "Error hint", () => false)
      );
      let valid;

      act(() => {
        valid = result.current.validate();
      });

      expect(valid).toBe(false);
      expect(result.current.error).toBe("Error hint");
    });

    it("should reset the error if the predicate evaluates to true", () => {
      const predicate = jest.fn().mockReturnValue(false);
      const { result } = renderHook(() =>
        useInputValidation("", "Error hint", predicate)
      );
      let valid;

      act(() => {
        result.current.validate();
      });
      expect(result.current.error).toBe("Error hint");

      predicate.mockReturnValue(true);
      act(() => {
        valid = result.current.validate();
      });

      expect(valid).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it("should uses the current value for validation", () => {
      const testValue = "Test value";
      const { result } = renderHook(() =>
        useInputValidation("", "Error hint", (val) => val === testValue)
      );

      act(() => {
        result.current.setValue(testValue);
      });
      act(() => {
        result.current.validate();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe("reset", () => {
    it("should reset value and error to their initial state", () => {
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
  });

  describe("commit", () => {
    it("should set the current value as a new baseline for reset", () => {
      const { result } = renderHook(() =>
        useInputValidation("Init", "Error hint", () => false)
      );

      act(() => {
        result.current.setValue("Changed");
        result.current.validate();
      });

      act(() => {
        result.current.commit();
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.value).toBe("Changed");
    });

    it("should use a provided state as a new baseline for reset", () => {
      const { result } = renderHook(() =>
        useInputValidation("Init", "Error hint", () => false)
      );

      act(() => {
        result.current.commit("Changed");
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.value).toBe("Changed");
    });
  });
});
