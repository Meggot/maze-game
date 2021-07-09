import { AttributeMap } from "./Attributes.model";

export class Creep {
    constructor(public name: string,
        public id: number,
        public attributes: AttributeMap) { 
        }
}