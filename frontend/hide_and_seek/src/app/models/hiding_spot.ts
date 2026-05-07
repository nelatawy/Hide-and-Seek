import { Difficulty } from "./difficulty";

export class HidingSpot {
    index: number;
    spot_image_url: string;
    hiding_image_url: string;
    difficulty: Difficulty;
    name: string;
    description: string;

    constructor(index: number, name: string, difficulty: Difficulty, spot_image_url: string, hiding_image_url: string, description: string) {
        this.index = index;
        this.name = name;
        this.difficulty = difficulty;
        this.spot_image_url = spot_image_url;
        this.hiding_image_url = hiding_image_url;
        this.description = description;
    }

    clone(): HidingSpot {
      return new HidingSpot(
        this.index,
        this.name,
        this.difficulty,
        this.spot_image_url,
        this.hiding_image_url,
        this.description
      );
    }
}
