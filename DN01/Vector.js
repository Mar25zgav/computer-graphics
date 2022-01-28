export class Vector {

    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    negate() {
        // negacija trenutnega vektorja
        return new Vector(-this.x, -this.y, -this.z);
    }

    add(v) {
        // seštevek trenutnega vektorja in vektorja v
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    subtract(v) {
        // razlika trenutnega vektorja in vektorja v
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    multiply(v) {
        // zmnožek po komponentah trenutnega vektorja in vektorja v
        return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    divide(v) {
        // deljenje po komponentah trenutnega vektorja in vektorja v
        return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    dot(v) {
        // skalarni produkt trenutnega vektorja in vektorja v
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        // vektorski produkt trenutnega vektorja in vektorja v
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    length() {
        // dolžina trenutnega vektorja
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        //return Math.sqrt(this.dot(this));
    }

    normalize() {
        // normaliziran trenutni vektor (vektor v isti smeri, toda dolžine 1)
        return new Vector(this.x / this.length(), this.y / this.length(), this.z / this.length());
    }

    project(v) {
        // pravokotna projekcija trenutnega vektorja na vektor v
        const s = this.dot(v) / v.length() ** 2;
        return new Vector(v.x * s, v.y * s, v.z * s);
    }

    reflect(v) {
        // zrcaljenje trenutnega vektorja prek vektorja v
        let n = this.dot(v.normalize()) * v.normalize();
        return new Vector(this.subtract(new Vector(n.x * 2, n.y * 2, n.z * 2)));
    }

    angle(v) {
        // kot v radianih med trenutnim vektorjem in vektorjem v
        return Math.acos(this.dot(v) / (this.length() * v.length()));
    }

    toString() {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }

    toArray() {
        return [this.x, this.y, this.z];
    }
}
