import { BigP } from "./big-p";
import { Emitter } from "./emitter";
import { Proof } from "./proof";

/**
 * Big-P singleton wrapper.
 */
export namespace _P {
	export const emitter: Emitter = new Emitter(console.log);
	export const bigP: BigP = new BigP(emitter);
}

/**
 * Define a proof with the given name.
 */
export function P(name: string) {
	const proof = _P.bigP.get(name);
	if (proof) {
		if (proof.declared) {
			throw new Error(`Attempting to redefined proof: ${name}.`);
		}
		return proof;
	}
	return new Proof(name);
}

/**
 * Reserves a proof for the decorated method.
 */
export function Provable(target: any, propertyName: string) {
	_P.bigP.reserve(propertyName);
}

/**
 * Reserves a proof which requires no implementation for the decorated method.
 */
export function Trivial(target: any, propertyName: string) {
	_P.bigP.reserve(propertyName).prove(`${propertyName} is trivial.`, () => {});
}
