import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce, useDebouncedCallback } from "@/hooks/useDebounce";

/**
 * Unit Tests for useDebounce Hook
 *
 * Tests debounce functionality for values and callbacks
 */
describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("useDebounce (value debouncing)", () => {
    it("should return initial value immediately", () => {
      const { result } = renderHook(() => useDebounce("initial", 500));

      expect(result.current).toBe("initial");
    });

    it("should debounce value changes", () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "initial", delay: 500 } },
      );

      expect(result.current).toBe("initial");

      // Update value
      rerender({ value: "updated", delay: 500 });

      // Value should not change immediately
      expect(result.current).toBe("initial");

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Now value should be updated
      expect(result.current).toBe("updated");
    });

    it("should respect custom delay time", () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "initial", delay: 1000 } },
      );

      rerender({ value: "updated", delay: 1000 });

      // After 500ms, should still be initial
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(result.current).toBe("initial");

      // After full 1000ms, should be updated
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(result.current).toBe("updated");
    });

    it("should cancel previous timeout when value changes rapidly", () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "first", delay: 500 } },
      );

      // Rapid updates
      rerender({ value: "second", delay: 500 });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      rerender({ value: "third", delay: 500 });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      rerender({ value: "fourth", delay: 500 });

      // Value should still be initial
      expect(result.current).toBe("first");

      // After full delay from last change
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should be the last value
      expect(result.current).toBe("fourth");
    });

    it("should work with different types", () => {
      // Number
      const { result: numberResult, rerender: rerenderNumber } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 0, delay: 100 } },
      );

      rerenderNumber({ value: 42, delay: 100 });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(numberResult.current).toBe(42);

      // Object
      const initialObj = { name: "initial" };
      const updatedObj = { name: "updated" };
      const { result: objectResult, rerender: rerenderObject } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: initialObj, delay: 100 } },
      );

      rerenderObject({ value: updatedObj, delay: 100 });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(objectResult.current).toEqual({ name: "updated" });
    });

    it("should handle zero delay", () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "initial", delay: 0 } },
      );

      rerender({ value: "updated", delay: 0 });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current).toBe("updated");
    });

    it("should cleanup timeout on unmount", () => {
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

      const { rerender, unmount } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "initial", delay: 500 } },
      );

      rerender({ value: "updated", delay: 500 });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it("should update when delay changes", () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: "initial", delay: 500 } },
      );

      rerender({ value: "updated", delay: 500 });

      // Change delay mid-wait
      rerender({ value: "updated", delay: 100 });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current).toBe("updated");
    });
  });

  describe("useDebouncedCallback", () => {
    it("should debounce callback execution", () => {
      const callback = vi.fn();

      const { result } = renderHook(() => useDebouncedCallback(callback, 500));

      // Call multiple times rapidly
      act(() => {
        result.current("arg1");
        result.current("arg2");
        result.current("arg3");
      });

      // Callback should not be called yet
      expect(callback).not.toHaveBeenCalled();

      // Advance time
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Callback should be called once with last arguments
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith("arg3");
    });

    it("should respect delay time", () => {
      const callback = vi.fn();

      const { result } = renderHook(() => useDebouncedCallback(callback, 1000));

      act(() => {
        result.current();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should cancel previous timeout on new call", () => {
      const callback = vi.fn();

      const { result } = renderHook(() => useDebouncedCallback(callback, 500));

      act(() => {
        result.current("first");
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      act(() => {
        result.current("second");
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // First call should be cancelled
      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith("second");
    });

    it("should pass multiple arguments", () => {
      const callback = vi.fn();

      const { result } = renderHook(() => useDebouncedCallback(callback, 100));

      act(() => {
        result.current("arg1", "arg2", "arg3");
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(callback).toHaveBeenCalledWith("arg1", "arg2", "arg3");
    });

    it("should use latest callback reference", () => {
      let callbackValue = "initial";
      const callback1 = vi.fn(() => callbackValue);
      const callback2 = vi.fn(() => "updated");

      const { result, rerender } = renderHook(
        ({ cb }) => useDebouncedCallback(cb, 500),
        { initialProps: { cb: callback1 } },
      );

      act(() => {
        result.current();
      });

      // Update callback reference
      rerender({ cb: callback2 });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should use updated callback
      expect(callback2).toHaveBeenCalled();
      expect(callback1).not.toHaveBeenCalled();
    });

    it("should cleanup timeout on unmount", () => {
      const callback = vi.fn();
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

      const { result, unmount } = renderHook(() =>
        useDebouncedCallback(callback, 500),
      );

      act(() => {
        result.current();
      });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      // Advance time to verify callback is not called
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(callback).not.toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it("should handle zero delay", () => {
      const callback = vi.fn();

      const { result } = renderHook(() => useDebouncedCallback(callback, 0));

      act(() => {
        result.current("test");
      });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(callback).toHaveBeenCalledWith("test");
    });

    it("should return a function on each render", () => {
      const callback = vi.fn();

      const { result, rerender } = renderHook(() =>
        useDebouncedCallback(callback, 500),
      );

      const firstRef = result.current;

      rerender();

      const secondRef = result.current;

      // Both should be functions
      expect(typeof firstRef).toBe("function");
      expect(typeof secondRef).toBe("function");
    });
  });
});
