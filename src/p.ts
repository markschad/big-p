import { Graph, Vertex } from "ms-dag-ts";
import { Entity } from "./entity";
import { IProof } from "./iproof";

/**
 * Stores our graph of proofs.
 */
export namespace P {

	/**
	 * The graph of all proofs.
	 */
	export const graph: Graph = new Graph();

	/**
	 * The total number of tests.
	 */
	export var count = 0;

	/**
	 * Emit function.
	 */
	export const emit: {(msg: string): void} = console.log;

	/**
	 * Retrieves the test entity belonging to the vertex from the given name.
	 */
	export function getEntity(proofName: string): Entity {
		let e: Entity = null;
		const findProof = (v: Vertex) => {
			const p = v.content as IProof;
			return p.name === proofName && (e = { vertex: v, proof: v.content as IProof });
		};
		graph.traverse(findProof);
		return e;
	}

	/**
	 * Like get entity but reserves a new vertex for the entity if it does not exist.
	 */
	export function reserveEntity(proofName: string): Entity {
		let e: Entity = getEntity(proofName);
		if (e === null) {
			const v = graph.addVertex();
			const p = v.content = {
				name: proofName,
				defined: false,
				test: f => { throw new Error(`Proof '${proofName} is not defined."`); }
			};
			e = {
				proof: p,
				vertex: v
			}
		}
		return e;
	}

	/**
	 * Run all tests.
	 */
	export function test() {
		emit("1.." + count);
		graph.traverse((vertex: Vertex) => {
			const p = vertex.content as IProof;
			p.test(emit);
		});
	}

}