export class Vector {

    constructor(coordinates) {
        // ustvari vektor s koordinatami coordinates (koordinat je lahko poljubno mnogo)
        this.coords = coordinates;
    }

    toArray() {
        // vrne koordinate vektorja kot seznam števil
        return this.coords;
    }

    length() {
        // vrne velikost vektorja
        return this.coords.length;
    }

    add(v) {
        // vrne nov vektor s koordinatami trenutnega vektorja, ki jim prištejemo koordinate vektorja v
        let newCoords = [...this.coords];
        for (let i = 0; i < v.length(); i++) {
            newCoords[i] += v.toArray()[i];
        }
        return new Vector(newCoords);
    }
    
    sub(v) {
        // vrne nov vektor s koordinatami trenutnega vektorja, ki jim odštejemo koordinate vektorja v
        let newCoords = [...this.coords];
        for (let i = 0; i < v.length(); i++) {
            newCoords[i] -= v.toArray()[i];
        }
        return new Vector(newCoords);
    }

    mul(v) {
        // vrne nov vektor s koordinatami trenutnega vektorja, pomnožene s koordinatami vektorja v
        let newCoords = [...this.coords];
        for (let i = 0; i < v.length(); i++) {
            newCoords[i] *= v.toArray()[i];
        }
        return new Vector(newCoords);
    }

    div(v) {
        // vrne nov vektor s koordinatami trenutnega vektorja, deljene s koordinatami vektorja v
        let newCoords = [...this.coords];
        for (let i = 0; i < v.length(); i++) {
            newCoords[i] /= v.toArray()[i];
        }
        return new Vector(newCoords);
    }

    mulScalar(s) {
        // vrne nov vektor s koordinatami trenutnega vektorja, pomnožene s skalarjem s
        let newCoords = [...this.coords];
        for (let i = 0; i < this.length(); i++) {
            newCoords[i] *= s;
        }
        return new Vector(newCoords);
    }

    divScalar(s) {
        // vrne nov vektor s koordinatami trenutnega vektorja, deljene s skalarjem s
        let newCoords = [...this.coords];
        for (let i = 0; i < this.length(); i++) {
            newCoords[i] /= s;
        }
        return new Vector(newCoords);
    }
}