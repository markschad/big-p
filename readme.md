big-p
---------
> It's buried under a big P. Say, what is a big P?

P
==

> What is it?
A concept test runner that keeps you honest.

> Why is it?
P takes a more logical look at code testing. We can prove some small component `A` works.  Then, assuming `A`, we can prove some other component `B` also works.

Example
-------

The below example tests a trivial stack implementation.

```javascript
/**
 * mystack.js
 */
function MyStack(thing) {
	if (typeof thing !== "undefined") {
		this._things = [ thing ];
	}
}
MyStack.prototype.push = function(thing) {
	this._things.splice(0, 0, thing);
};
MyStack.prototype.pop = function() {
	return this._things.splice(0);
};
MyStack.prototype.length = function() {
	return this._things.length;
};
```

```javascript
/**
 * mystack.spec.js
 */
const MyStack = require("./mystack.js");

P("MyStack.constructor")
	.prove("It creates a new instance of MyStack.", f => {
		const expected = true;
		const actual = new MyStack() instanceof MyStack;
		assert(expected === actual);
	})
	.prove("It can optionally initialise MyStack with one element.", f => {
		const s = new MyStack("a");
		const actual = s.length;
		const expected = 1;
		assert(actual === expected);
	});

P("MyStack.prototype.pop")
	.assume([
		"MyStack.constructor",
		"MyStack.prototype.push"		// We use MyStack.prototype.push to help setup the test.
	])
	.setup(() => {
		const s = new MyStack("a");
		s.push("b");
		s.push("c");
		return s;
	})
	.prove("It returns something.", f => {
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
