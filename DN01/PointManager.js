import { Vector } from "./Vector.js";

export class PointManager {
    
    parsePoints(input) {
        // Branje točk iz niza input v seznam primerkov razreda Vector. Format vhoda je seznam vrstic, od katerih vsaka vsebuje tri števila (koordinate X, Y in Z posamezne točke), ločene s presledki. Prazne vrstice ignorirajte.
        let points = [];
        const lines = input.split("\n");
        console.log(lines);
        for (const line of lines) {
            if (line.length > 0) {
                const vectorCoords = line.trim().split(/\s+/);
                const x = parseFloat(vectorCoords[0]);
                const y = parseFloat(vectorCoords[1]);
                const z = parseFloat(vectorCoords[2]);
                points.push(new Vector(x, y, z));
            }
        }
        return points;
    }

    formatPoints(points) {
        // Pisanje točk iz seznama vektorjev v niz znakov. Format je enak kot pri branju.
        let output = "";
        for (const vector of points) {
            output += vector + "\n";
        }
        return output;
    }
}