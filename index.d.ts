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
declare const globalConfigs: GlobalConfigs;
declare class Trier<T> {
    static changeGlobalConfigs(newConfigs?: GlobalConfigs): void;
    private callbacks;
    private configs;
    private hasError;
    private tryResult;
    private catchResult;
    constructor(callerName: string);
    getConfigs(): Configs;
    setConfigs(newConfigs?: Partial<Configs>): this;
    try(cb: (...args: any[]) => T, ...params: any[]): this;
    tryAsync(cb: (...args: any[]) => Promise<T>, ...params: any[]): this;
    private handleCatchBlock;
    private printError;
    throw(): this;
    executeIfNoError(callback: (result: T, ...args: any[]) => void, ...params: any[]): this;
    catch(callback: (...args: any[]) => unknown, ...params: any[]): this;
    finally(callback: (...args: any[]) => void, ...params: any[]): this;
    run(): T;
    runAsync(): Promise<T>;
    private isErrorOccurred;
    private handleOtherTasks;
    private getResult;
}
declare const trier: <T>(callerName: CallerName) => Trier<T>;
//# sourceMappingURL=index.d.ts.map