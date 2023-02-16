const globalConfigs = {
	callerName: "unknownCaller",
	canPrintError: true,
};

const CALLBACK_TYPES = {
	ASYNC: "async",
	SYNC: "sync",
};

class Trier {
	static changeGlobalConfigs(newConfigs = globalConfigs) {
		Object.entries(newConfigs).forEach(([configKey, configValue]) => {
			globalConfigs[configKey] = configValue;
		});
	}

	#getDefaultCallbacks() {
		return {
			try: [],
			catch: () => {},
			executeIfNoError: () => {},
			finally: () => {},
		};
	}
	#callbacks = this.#getDefaultCallbacks();

	#options = { ...globalConfigs, shouldThrowError: false };
	#hasError = false;
	#tryResult = undefined;
	#catchResult = undefined;

	constructor(callerName, options = globalConfigs) {
		this.setOptions({ ...options, callerName });
	}

	getOptions() {
		return this.#options;
	}
	setOptions(options = this.getOptions()) {
		this.#options = { ...this.getOptions(), ...options };
		return this;
	}

	try(callback, ...params) {
		this.#callbacks.try.push({
			type: CALLBACK_TYPES.SYNC,
			callback: () => {
				try {
					this.#tryResult = callback(...params);
				} catch (error) {
					this.#handleCatchBlock(error);
				}
			},
		});

		return this;
	}
	tryAsync(callback, ...params) {
		this.#callbacks.try.push({
			type: CALLBACK_TYPES.ASYNC,
			callback: async () => {
				try {
					this.#tryResult = await callback(...params);
				} catch (error) {
					this.#handleCatchBlock(error);
				}
			},
		});

		return this;
	}

	#handleCatchBlock(error) {
		this.#hasError = true;
		this.#catchResult = error;
		const { canPrintError } = this.getOptions();

		if (canPrintError) this.#printError();
	}
	#printError() {
		const { callerName } = this.getOptions();

		printError(callerName, this.#catchResult);

		return this;
	}

	throw() {
		this.#options.shouldThrowError = true;
		return this;
	}

	executeIfNoError(callback, ...params) {
		this.#callbacks.executeIfNoError = () => {
			if (this.#hasError === false) {
				callback(this.#tryResult, ...params);
			}
		};

		return this;
	}

	catch(callback, ...params) {
		this.#callbacks.catch = () => {
			if (this.#hasError) {
				this.#catchResult = callback(this.#catchResult, ...params);
			}
		};

		return this;
	}

	finally(callback, ...params) {
		this.#callbacks.finally = () => {
			callback(this.#tryResult, ...params);
		};

		return this;
	}

	run() {
		const syncCallbacks = this.#callbacks.try.filter(
			(i) => i.type === CALLBACK_TYPES.SYNC,
		);
		for (const i of syncCallbacks) {
			if (this.#isErrorOccurred()) break;
			i.callback();
		}

		return this.#handleRestTasks();
	}

	async runAsync() {
		for (const i of this.#callbacks.try) {
			if (this.#isErrorOccurred()) break;
			await i.callback();
		}

		return this.#handleRestTasks();
	}

	#isErrorOccurred() {
		return this.#hasError;
	}

	#handleRestTasks() {
		if (this.#isErrorOccurred()) {
			this.#callbacks.catch();

			if (this.#options.shouldThrowError) throw this.#catchResult;
		}

		if (!this.#isErrorOccurred()) {
			this.#callbacks.executeIfNoError();
		}

		this.#callbacks.finally();

		this.#resetCallbacks();

		return this.#result();
	}

	#resetCallbacks() {
		this.#callbacks = this.#getDefaultCallbacks();
	}

	#result() {
		return this.#hasError ? this.#catchResult : this.#tryResult;
	}
}

const trier = (callerName, options) => new Trier(callerName, options);

module.exports = { trier, Trier };

const printError = (functionName, error) => {
	console.error(`${functionName} catch, error: `);
	console.error(error);
};
