import * as assert from "assert"; 

import { P } from "./index";
import { P as _P } from "./p"; 
import { Entity } from "./entity";
import { IProof } from "./iproof";
import { Graph, Vertex } from "ms-dag-ts";

const dummyProof = (name: string): IProof => {
	return {
		name: name,
		defined: false,
		test: null
	};
};

const setup = () => {
	const a = _P.graph.addVertex();
	a.content = dummyProof("Component.A");
	const b = _P.graph.addVertex();
	b.content = dummyProof("Component.B");
	const c = _P.graph.addVertex();
	c.content = dummyProof("Component.C");
	// Component.C assumes Component.A.
	a.connectTo(c);
};

const teardown = f => {
	_P.graph.clear();
}

P("P.getEntity")
	.prove("it returns null for an undefined entity.", f => {
		const actual = _P.getEntity("Component.D");
		const expected = null;
		assert(actual === expected);
	})
	.prove("it returns the requested entity if it is defined.", f => {
		const actual = _P.getEntity("Component.B").proof;
		const expected = dummyProof("ComponentB");
		assert(actual === expected);
	})
	.setup(setup)
	.teardown(teardown);

P("P.reserveEntity")
	.prove("it returns the requested entity, even if it isn't defined.", f => {
		const actual = _P.reserveEntity("Component.D").proof;
		const expected = dummyProof("Component.D");
		assert(actual === expected);
	})
	.setup(setup)
	.teardown(teardown);
