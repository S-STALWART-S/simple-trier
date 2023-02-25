const { Trier } = require("../lib/index.js");

const testResult = "test result";
const testError = "test error";

describe("Trier", () => {
  let trier;
  beforeEach(() => {
    trier = new Trier("test");
  });

  describe("try", () => {
    it("should set the try result", () => {
      trier.try(() => {
        return testResult;
      });
      expect(trier.run()).toBe(testResult);
    });

    it("should set the catch result if an error is thrown", () => {
      trier.try(() => {
        throw new Error(testError);
      });
      expect(trier.run()).toBeInstanceOf(Error);
    });
  });

  describe("tryAsync", () => {
    it("should set the try result", async () => {
      trier.tryAsync(async () => {
        return testResult;
      });
      expect(await trier.runAsync()).toBe(testResult);
    });

    it("should set the catch result if an error is thrown", async () => {
      trier.tryAsync(async () => {
        throw new Error(testError);
      });
      expect(await trier.runAsync()).toBeInstanceOf(Error);
    });
  });

  describe("catch", () => {
    it("should set the catch result", () => {
      trier
        .try(() => {
          throw new Error(testError);
        })
        .catch(() => {
          return "catch result";
        });
      expect(trier.run()).toBe("catch result");
    });
  });

  describe("executeIfNoError", () => {
    it("should execute if there is no error", () => {
      const mockCallback = jest.fn();
      trier
        .try(() => {
          return testResult;
        })
        .executeIfNoError(mockCallback);
      trier.run();
      expect(mockCallback).toHaveBeenCalledWith(testResult);
    });

    it("should not execute if there is an error", () => {
      const mockCallback = jest.fn();
      trier
        .try(() => {
          throw new Error(testError);
        })
        .executeIfNoError(mockCallback);
      trier.run();
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe("finally", () => {
    it("should execute finally block", () => {
      const mockCallback = jest.fn();
      trier
        .try(() => {
          return testResult;
        })
        .finally(mockCallback);
      trier.run();
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe("throw", () => {
    it("should throw an error if an error occurred", () => {
      trier
        .try(() => {
          throw new Error(testError);
        })
        .throw();
      expect(() => trier.run()).toThrow(Error);
    });
  });

  describe("run multiple sync", () => {
    it("should run multiple sync callbacks in try block and execute finally block", () => {
      const mockFn1 = jest.fn();
      const mockFn2 = jest.fn();
      const mockFinally = jest.fn();

      const result = trier.try(mockFn1).try(mockFn2).finally(mockFinally).run();

      expect(mockFn1).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFinally).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("run multiple async", () => {
    it("should run multiple async callbacks in try block and execute finally block", async () => {
      const mockFn1 = jest.fn();
      const mockFn2 = jest.fn();
      const mockFinally = jest.fn();

      const result = await trier
        .tryAsync(mockFn1)
        .tryAsync(mockFn2)
        .finally(mockFinally)
        .runAsync();

      expect(mockFn1).toHaveBeenCalled();
      expect(mockFn2).toHaveBeenCalled();
      expect(mockFinally).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("catch error in catch block", () => {
    it("should catch error in catch block", () => {
      const mockTryFn = jest.fn(() => {
        throw new Error(testError);
      });
      const mockCatchFn = jest.fn();

      const result = trier
        .try(mockTryFn)
        .catch((error) => {
          mockCatchFn();
          return error;
        })
        .run();

      expect(mockTryFn).toHaveBeenCalled();
      expect(mockCatchFn).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Error);
    });
  });

  it("should catch error in catch block and throw error", () => {
    const mockTryFn = jest.fn(() => {
      throw new Error(testError);
    });
    const mockCatchFn = jest.fn();
    let error;

    try {
      trier
        .try(mockTryFn)
        .catch((error) => {
          mockCatchFn();
          return error;
        })
        .throw()
        .run();
    } catch (err) {
      error = err;
    }

    expect(mockTryFn).toHaveBeenCalled();
    expect(mockCatchFn).toHaveBeenCalled();
    expect(error).toBeInstanceOf(Error);
  });

  it("should execute executeIfNoError block if there is no error", () => {
    const mockTryFn = jest.fn(() => 5);
    const mockExecuteIfNoErrorFn = jest.fn();

    const result = trier
      .try(mockTryFn)
      .executeIfNoError(mockExecuteIfNoErrorFn)
      .run();

    expect(mockTryFn).toHaveBeenCalled();
    expect(mockExecuteIfNoErrorFn).toHaveBeenCalledWith(5);
    expect(result).toBe(5);
  });

  it("should not execute executeIfNoError block if there is an error", () => {
    const mockTryFn = jest.fn(() => {
      throw new Error(testError);
    });
    const mockExecuteIfNoErrorFn = jest.fn();

    const result = trier
      .try(mockTryFn)
      .executeIfNoError(mockExecuteIfNoErrorFn)
      .run();

    expect(mockTryFn).toHaveBeenCalled();
    expect(mockExecuteIfNoErrorFn).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Error);
  });
});
