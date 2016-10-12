import { Proof } from "./proof";
export { P as _P } from "./p";

/**
 * Creates a new proof.
 */
export function P(name: string): Proof {
	return new Proof(name);
}
