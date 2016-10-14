big-p
---------
> It's buried under a big P. Say, what is a big P?

P
==

P aims to help you empirically _prove_ your code.

Vision
------

* A simple framework for assembling proofs.
* Takes advantage of TypeScript language features such as decorators for labelling provable code.
* Test Anything Protocol output.

Example
-------

```typescript
/**
 * mystack.js
 */
import { Provable, Trivial } from "../src";

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
	@Provable
	push(thing): void {
		this._things.splice(0, 0, thing);
	}

	/** Removes the first value from the stack and returns it. */
	@Provable
	pop(): any {
		return this._things.splice(0);
	}

	/** Returns the length of the stack. */
	@Trivial
	length(): number {
		return this._things.length;
	}

	/** Returns the first value from the stack. */
	@Provable
	peak(): any {
		return this._things[0];
	}

}
```

```javascript
/**
 * mystack.spec.js
 */
import { MyStack } from "./mystack";
import { P } from "big-p";

P("MyStack.constructor")
	.assume([
		"MyStack.prototype.length"	// Length has a trivial proof, so no P implementation is necessary.
	])
	.prove("it can create a new instance of MyStack.", f => {
		const expected = true;
		const actual = new MyStack() instanceof MyStack;
		assert(expected === actual);
	})
	.prove("it can optionally initialise MyStack with one element.", f => {
		const s = new MyStack("a");
		const actual = s.length;
		const expected = 1;
		assert(actual === expected);
	});

P("MyStack.prototype.pop")
	.assume([
		"MyStack.constructor",
		"MyStack.prototype.peak",
		"MyStack.prototype.push"		// We use MyStack.prototype.push to help setup the test.
	])
	.setup(() => {
		const s = new MyStack("a");
		s.push("b");
		s.push("c");
		return s;
	})
	.prove("it returns something.", f => {
		const actual = f.pop();
		const expected = "c";
		assert(actual === expected);
	})
	.prove("It reduces the length of stack.", f => {
		f.pop();
		const actual = s.length;
		const expected = 2;
		assert(actual === expected);
	});

P("MyStack.prototype.push")
	.assume([
		"MyStack.constructor"
	])
	.setup(() => {
		return new MyStack("a");
	})
	.prove("It increases the length of the stack by one.", f => {
		f.push("b");
		const actual = s.length;
		const expected = 2;
		assert(actual === expected);
	});
```

Roadmap
-------


