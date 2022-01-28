import { Vector } from "./Vector.js";
import { Bernstein } from "./Bernstein.js";

export class Bezier {

    constructor(points) {
        // ustvari Bézierjevo krivuljo iz seznama točk points
        this.points = points;
    }

    value(t) {
        // vrne točko na Bézierjevi krivulji ob času t
        let sumVector = new Vector(new Array(this.points[0].length()).fill(0));
        let n = this.points.length - 1;
        for (let i = 0; i <= n; i++) {
            sumVector = sumVector.add(this.points[i].mulScalar(new Bernstein(n, i).value(t)));
        }
        return sumVector;
    }

    derivative(t) {
        // vrne odvod Bézierjeve krivulje ob času t
        let sumVector = new Vector(new Array(this.points[0].length()).fill(0));
        let n = this.points.length - 1;
        for (let i = 0; i <= n - 1; i++) {
            let q = (this.points[i + 1].sub(this.points[i])).mulScalar(n);
            sumVector = sumVector.add(q.mulScalar(new Bernstein(n - 1, i).value(t)));
        }
        return sumVector;
    }
    
    addPoint(p) {
        this.points.push(p);
    }

    popPoint() {
        return this.points.pop();
    }

    size() {
        return this.points.length;
    }
}