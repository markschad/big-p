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