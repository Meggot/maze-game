import { AttributeMap } from "../models/Attributes.model";
import { Creep } from "../models/creep.model";

export const waves = [
    {
        waveNumber: 1, creeps: [
            new Creep("spider", 1, new AttributeMap(10, 0, 5, 1)),
            new Creep("spider", 1, new AttributeMap(10, 0, 5, 1)),
            new Creep("spider", 1, new AttributeMap(10, 0, 5, 1)),
            new Creep("spider", 1, new AttributeMap(10, 0, 5, 1)),
            new Creep("spider", 1, new AttributeMap(10, 0, 5, 1)),
        ]
    }
]