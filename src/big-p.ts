import { Graph, Vertex } from "ms-dag-ts";
import { Emitter } from "./emitter";
import { Proof } from "./proof";

/**
 * Represents a set a proofs.
 */
export class BigP {

	private readonly _graph: Graph = new Graph();
	private readonly _proofs: {
		[name: string]: Proof;
	} = {};
	private readonly _emitter: Emitter;

	/** Number of tests. */
	private count: number = 0;

	constructor(emitter: Emitter) { 
		this._emitter = emitter;
	}

	/**
	 * Gets the proof with the given name.
	 */
	get(name: string): Proof {
		return this._proofs[name];
	}

	/**
	 * Reserves a proof for the given name.
	 */
	reserve(name: string): Proof {
		let proof = this._proofs[name];
		if (proof) {
			throw new Error(`Proof '${name}' is already ${proof.declared ? "declared" : "reserved"}'`);
		}
		const vertex = this._graph.addVertex();
		vertex.content = this._proofs[name] = new Proof(name);
		return proof;
	}

	/**
	 * Test the set of proofs.
	 */
	test(): void {
		const thisBigP: BigP = this;
		this._graph.traverse(vertex => {
			const proof = vertex.content as Proof;
			proof.test(thisBigP._emitter);
		});
	}

}
