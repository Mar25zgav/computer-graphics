import { Matrix } from "./Matrix.js";

export class Transformation {

    constructor() {
        this.matrix = new Matrix(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    translate(v) {
        // shranjeno matriko spremeni tako, da transformaciji doda premik za vektor v
        this.matrix = (
            new Matrix(
                1, 0, 0, v.x, 
                0, 1, 0, v.y, 
                0, 0, 1, v.z, 
                0, 0, 0, 1
            ).multiply(this.matrix)
        );
    }

    scale(v) {
        // shranjeno matriko spremeni tako, da transformaciji doda razteg v smereh osi X, Y in Z s faktorji, določenimi v vektorju v
        this.matrix = (
            new Matrix(
                v.x, 0, 0, 0,
                0, v.y, 0, 0,
                0, 0, v.z, 0,
                0, 0, 0, 1
            ).multiply(this.matrix)
        );
    }

    rotateX(angle) {
        // shranjeno matriko spremeni tako, da transformaciji doda vrtenje okrog osi X za kot angle, podan v radianih
        this.matrix = (
            new Matrix(
                1, 0, 0, 0,
                0, Math.cos(angle), -Math.sin(angle), 0,
                0, Math.sin(angle), Math.cos(angle), 0,
                0, 0, 0, 1
            ).multiply(this.matrix)
        );
    }

    rotateY(angle) {
        // shranjeno matriko spremeni tako, da transformaciji doda vrtenje okrog osi Y za kot angle, podan v radianih
        this.matrix = (
            new Matrix(
                Math.cos(angle), 0, Math.sin(angle), 0,
                0, 1, 0, 0,
                -Math.sin(angle), 0, Math.cos(angle), 0,
                0, 0, 0, 1
            ).multiply(this.matrix)
        );
    }

    rotateZ(angle) {
        // shranjeno matriko spremeni tako, da transformaciji doda vrtenje okrog osi Z za kot angle, podan v radianih
        this.matrix = (
            new Matrix(
                Math.cos(angle), -Math.sin(angle), 0, 0,
                Math.sin(angle), Math.cos(angle), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ).multiply(this.matrix)
        );
    }

    transform(v) {
        // transformira vektor v s shranjeno matriko
        return this.matrix.multiplyVector(v);
    }
}