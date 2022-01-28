import { PointManager } from "./PointManager.js";
import { Transformation } from "./Transformation.js";
import { Vector } from "./Vector.js";

export class TransformPoints {
    
    transformPoints(input) {
        // prebere točke iz niza input (po formatu iz razreda PointManager), jih transformira po spodaj opisanem postopku in jih nato vrne v obliki niza (po formatu iz razreda PointManager)
        const pointManager = new PointManager();
        const points = pointManager.parsePoints(input);
        
        const transformation = new Transformation();
        transformation.translate(new Vector(2.8, 0, 0)); // premik vzdolž osi x za 2.8
        transformation.rotateY(Math.PI / 4); // vrtenje okrog osi y za kot pi/4
        transformation.translate(new Vector(0, 0, 7.15)); // premik vzdolž osi z za 7.15
        transformation.translate(new Vector(0, 2.45, 0)); //premik vzdolž osi y za 2.45
        transformation.scale(new Vector(1.8, 1.8, 1)) // razteg vzdolž osi x in y za faktor 1.8
        transformation.rotateY(5 * Math.PI / 10) // vrtenje okrog osi y za kot 5*pi/10

        let transformedPoints = [];
        for (const point of points) {
            transformedPoints.push(transformation.transform(point));
        }

        return pointManager.formatPoints(transformedPoints);
    }
}