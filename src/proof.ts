import { Vertex } from "ms-dag-ts";
import { P } from "./p";
import { IProof } from "./iproof";
import { SetupCallback, TeardownCallback, ProveCallback } from "./callback";

/**
 * Takes any value and produces a function which returns that value.
 */
const _const = c => () => c;

/**
 * Represents a proof.
 */
export class Proof implements IProof {

	private _vertex: Vertex;

	private _setup: Function = _const({});
	private _teardown: Function = _const({});

	private _partials: {
		description: string,
		callback: ProveCallback
	}[] = [];

	/**
	 * Instantiates a new instance of Proof.
	 */
	constructor(private _name: string) {
		const e = P.getEntity(_name);
		if (e) {
			if (e.proof.defined) {
				throw new Error(`Proof '${_name}' already exists.`);
			}
			this._vertex = e.vertex;
		}
		else {
			this._vertex = P.graph.addVertex();
		}
		this._vertex.content = this;
		console.log("Defined: " + _name);
	}


	/** Gets the name of this proof. */
	get name(): string { return this._name; }

	/** A real proof is always defined. */
	readonly defined: boolean = true;

	/**
	 * Define the assumptions this proof makes.
	 */
	assume(assumptions: string[]): this {
		for (let assumption of assumptions) {
			const e = P.reserveEntity(assumption);
			try {
				e.vertex.connectTo(this._vertex);
			}
			catch (err) {
				throw new Error(`Proof '${e.proof.name}' already assumes '${this.name}'.  Cannot create a circular proof.`);
			}
		}
		this._vertex.reflow();
		return this;
	}

	/**
	 * Define the setup procedure.
	 */
	setup(cb: SetupCallback): this {
		this._setup = cb;
		return this;
	}

	/**
	 * Defines the procedure for cleaning up after a set of proofs.
	 */
	teardown(cb: TeardownCallback): this {
		this._teardown = cb;
		return this;
	}

	/**
	 * Defines a new partial proof.
	 */
	prove(desc: string, cb: ProveCallback): this {
		this._partials.push({ description: desc, callback: cb });
		P.count++;
		return this;
	}

	/**
	 * Tests this proof.
	 */
	test(emit: {(msg: string): void}): void {
		emit("# " + this._name);
		if (this._partials.length > 0) {
			for (let proof of this._partials) {
				const msg = proof.description ? " " + proof.description : "";
				const fixtures = this._setup();
				try {
					proof.callback(fixtures);
				}
				catch (err) {
					emit("not ok" + msg);
				}
				finally {
					this._teardown(fixtures);
				}
				emit("ok" + msg);
			}
		}
	}

}