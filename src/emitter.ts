/**
 * Represents an emitter, which can send TAP compatible messages to a stream.
 */
export class Emitter {

	private emit: EmitFunc;
	private counted: boolean = false;
	private bailed: boolean = false;

	constructor(fn: EmitFunc) {
		this.emit = fn;
	}

	/**
	 * Emits the total number of tests.
	 */
	count(num: number) {
		if (this.counted) {
			throw new Error("Cannot count tests more than once!");
		}
		this.emit("1.." + num);
		this.counted = true;
	}

	/**
	 * Emits an OK result, followed by a message.
	 */
	ok(message: string) {
		this.emit(("ok " + message).trim());
	}

	/**
	 * Emits a NOT OK result, followed by a message.
	 */
	notOk(message: string) {
		this.emit(("not ok " + message).trim());
	}

	/**
	 * Emits a comment.
	 */
	comment(message: string) {
		this.emit(("# " + message).trim());
	}

	bailOut() {
		if (this.bailed) {
			throw new Error("Cannot bail out more than once!");
		}
		this.emit("Bailed out!");
		this.bailed = true;
	}

}

/**
 * Emit function signature.
 */
export interface EmitFunc {
	(message: string, ...args: string[]): void
}
