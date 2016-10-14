import { Emitter } from "./emitter";

/**
 * Callback signature for Proof.prototype.setup.
 */
export interface SetupCallback {
	(): any;
}

/**
 * Callback signature for Proof.prototype.teardown.
 */
export interface TeardownCallback {
	(fixtures: any): void
}

/**
 * Callback signature for Proof.prototype.prove.
 */
export interface ProveCallback {
	(fixtures: any): void
}

/**
 * Represents a proof which may include a collection of partial proofs.
 */
export class Proof {

	private _declared: boolean = false;
	private _setupCb: SetupCallback;
	private _teardownCb: TeardownCallback;
	private _partialProofs: {
		description: string,
		callback: ProveCallback
	}[] = [];

	/**
	 * Instantiates a new instance of Proof.
	 */
	constructor(public readonly name: string) { }

	/**
	 * Gets the number of partial proofs defined by this instance.
	 */
	get count(): number { return this._partialProofs.length; }

	get declared(): boolean { return this._declared; }

	/**
	 * Defines the assumptions made by this instance.
	 */
	assume(assumptions: string[]): this {
		return this;
	}

	/**
	 * Defines the setup routine for this instance.
	 */
	setup(cb: SetupCallback): this {
		this._setupCb = cb;
		return this;
	}

	/**
	 * Defines the teardown routine for this instance.
	 */
	teardown(cb: TeardownCallback): this {
		this._teardownCb = cb;
		return this;
	}

	/**
	 * Defines a partial proof for this instance.
	 */
	prove(desc: string, cb: ProveCallback): this {
		this._declared = true;
		this._partialProofs.push({
			description: desc,
			callback: cb
		});
		return this;
	}

	/**
	 * Tests this proof, emitting the results with the given emitter.
	 */
	test(emitter: Emitter): void {
		emitter.comment(this.name);
		if (this._partialProofs.length > 0) {
			for (let proof of this._partialProofs) {
				const msg = proof.description ? " " + proof.description : "";
				const fixtures = this._setupCb();
				try {
					proof.callback(fixtures);
				}
				catch (err) {
					emitter.notOk(msg);
				}
				finally {
					this._teardownCb(fixtures);
				}
				emitter.ok(msg);
			}
		}
	}


}