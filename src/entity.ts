import { Vertex } from "ms-dag-ts";
import { IProof } from "./iproof";

/**
 * A vertex-proof pair.
 */
export interface Entity {
	vertex: Vertex,
	proof: IProof
}