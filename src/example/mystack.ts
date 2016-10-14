import { Provable, Trivial } from "../p";

/**
 * A simple stack implementation.
 */
export class MyStack {

	/** All the things in the stack. */
	private _things: any[];

	/** Instantiates a new instance of MyStack. */
	constructor(thing?) {
		if (typeof thing !== "undefined") {
			this._things = [ thing ];
		}
	}

	/** Inserts a new value at the beginning of the stack. */
	push(thing): void {
		this._things.splice(0, 0, thing);
	}

	/** Removes the first value from the stack and returns it. */
	pop(): any {
		return this._things.splice(0);
	}

	/** Returns the length of the stack. */
	length(): number {
		return this._things.length;
	}

	/** Returns the first value from the stack. */
	peak(): any {
		return this._things[0];
	}

}