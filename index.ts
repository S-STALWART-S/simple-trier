interface Callbacks {
  try: {
    type: "sync" | "async";
    callback(...args: any[]): void | Promise<void>;
  }[];
  catch(...args: any[]): unknown;
  executeIfNoError(...args: any[]): void;
  finally(...args: any[]): void;
}

type CallerName = string;

interface GlobalConfigs {
  callerName: CallerName;
  canPrintError: boolean;
}

interface Configs extends GlobalConfigs {
  shouldThrowError: boolean;
}

const globalConfigs: GlobalConfigs = {
  callerName: "unknownCaller",
  canPrintError: true,
};

class Trier<T> {
  static changeGlobalConfigs(newConfigs: GlobalConfigs = globalConfigs) {
    Object.entries(globalConfigs).forEach(([key, value]) => {
      if (key in newConfigs) (globalConfigs as any)[key] = value;
    });
  }

  private callbacks: Callbacks = {
    try: [],
    catch: () => {},
    executeIfNoError: () => {},
    finally: () => {},
  };

  private configs: Configs = { ...globalConfigs, shouldThrowError: false };
  private hasError = false;
  private tryResult: any;
  private catchResult: any;

  constructor(callerName: string) {
    this.setConfigs({ callerName });
  }

  getConfigs() {
    return this.configs;
  }
  setConfigs(newConfigs: Partial<Configs> = this.configs) {
    this.configs = { ...this.getConfigs(), ...newConfigs };
    return this;
  }

  try(cb: (...args: any[]) => T, ...params: any[]) {
    this.callbacks.try.push({
      type: "sync",
      callback: () => {
        try {
          this.tryResult = cb(...params);
        } catch (error) {
          this.handleCatchBlock(error);
        }
      },
    });

    return this;
  }
  tryAsync(cb: (...args: any[]) => Promise<T>, ...params: any[]) {
    this.callbacks.try.push({
      type: "async",
      callback: async () => {
        try {
          this.tryResult = await cb(...params);
        } catch (error) {
          this.handleCatchBlock(error);
        }
      },
    });

    return this;
  }

  private handleCatchBlock(error: any) {
    this.hasError = true;
    this.catchResult = error;
    const { canPrintError } = this.getConfigs();
    if (canPrintError) this.printError();
  }
  private printError() {
    const { callerName } = this.getConfigs();
    console.error(`${callerName} catch, error: `, this.catchResult);
    return this;
  }

  throw() {
    this.setConfigs({ shouldThrowError: true });
    return this;
  }

  executeIfNoError(
    callback: (result: T, ...args: any[]) => void,
    ...params: any[]
  ) {
    this.callbacks.executeIfNoError = () => {
      if (this.hasError === false) {
        callback(this.tryResult, ...params);
      }
    };

    return this;
  }

  catch(callback: (...args: any[]) => unknown, ...params: any[]) {
    this.callbacks.catch = () => {
      if (this.hasError) {
        this.catchResult = callback(this.catchResult, ...params);
      }
    };

    return this;
  }

  finally(callback: (...args: any[]) => void, ...params: any[]) {
    this.callbacks.finally = () => {
      callback(this.tryResult, ...params);
    };

    return this;
  }

  run(): T {
    const syncCallbacks = this.callbacks.try.filter((i) => i.type === "sync");
    for (const i of syncCallbacks) {
      if (this.isErrorOccurred()) break;
      i.callback();
    }

    return this.handleOtherTasks();
  }

  async runAsync(): Promise<T> {
    for (const i of this.callbacks.try) {
      if (this.isErrorOccurred()) break;
      await i.callback();
    }

    return this.handleOtherTasks();
  }

  private isErrorOccurred() {
    return this.hasError;
  }

  private handleOtherTasks() {
    if (this.isErrorOccurred()) {
      this.callbacks.catch();

      if (this.configs.shouldThrowError) throw this.catchResult;
    }

    if (this.isErrorOccurred() === false) {
      this.callbacks.executeIfNoError();
    }

    this.callbacks.finally();

    return this.getResult();
  }

  private getResult() {
    return this.hasError ? this.catchResult : this.tryResult;
  }
}

const trier = <T>(callerName: CallerName) => new Trier<T>(callerName);

module.exports = {
  trier,
  Trier,
};
