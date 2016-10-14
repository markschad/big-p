import * as assert from "assert";

import { P } from "../p";
import { MyStack } from "./mystack";

P("MyStack.constructor")
	.prove("It creates a new instance of MyStack.", f => {
		const expected = true;
		const actual = new MyStack() instanceof MyStack;
		assert(expected === actual);
	})
	.prove("It can optionally initialise MyStack with one element.", f => {
		const s = new MyStack("a");
		const actual = s.length();
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
		const s = f as MyStack;
		const actual = s.pop();
		const expected = "c";
		assert(actual === expected);
	})
	.prove("It reduces the length of stack.", f => {
		const s = f as MyStack;
		s.pop();
		const actual = s.length();
		const expected = 2;
		assert(actual === expected);
	});

P("MyStack.prototype.push")
	.assume([
		"MyStack.constructor",
		"MyStack.prototype.peak"
	])
	.setup(() => {
		return new MyStack("a");
	})
	.prove("It increases the length of the stack by one.", f => {
		const s = f as MyStack;
		f.push("b");
		const actual = f.length();
		const expected = 2;
		assert(actual === expected);
	});