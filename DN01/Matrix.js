import { Vector } from "./Vector.js";

export class Matrix {

    constructor(...m) {
        this.m = new Array(16).fill(0);
        this.m.splice(0, m.length, ...m);
    }

    negate() {
        // negacija trenutne matrike
        let newM = new Matrix();
        for (let i = 0; i < 16; i++) {
            newM.m[i] = -this.m[i];
        }
        return newM;
    }

    add(m2) {
        // seštevek trenutne matrike in matrike m2
        let newM = new Matrix();
        for (let i = 0; i < 16; i++) {
            newM.m[i] = this.m[i] + m2.m[i];
        }
        return newM;
    }

    subtract(m2) {
        // razlika trenutne matrike in matrike m2
        let newM = new Matrix();
        for (let i = 0; i < 16; i++) {
            newM.m[i] = this.m[i] - m2.m[i];
        }
        return newM;
    }

    transpose() {
        // transponirana matrika
        let newM = new Matrix();
        let idx = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = i; j < 16; j += 4) {
                newM.m[idx] = this.m[j];
                idx += 1;
            }
        }
        return newM;    
    }

    multiply(m1) {
        // zmnožek trenutne matrike in matrike m1
        const m1T = m1.transpose();
        let newM = new Matrix();
        newM.m = [];
        for (let i = 0; i < 16; i += 4) {
            let z = 0;
            for (let j = 0; j < 4; j++) {
                let vsota = 0;
                for (let k = i; k < i + 4; k++) {
                    vsota += this.m[k] * m1T.m[z]
                    z++;
                }
                newM.m.push(vsota);
            }
        }
        return newM;
    }

    multiplyVector(v1) {
        // zmnožek trenutne matrike in stolpičnega vektorja v. Pri vhodu uporabite homogene koordinate, rezultat homogenizirajte. 
        let v = [];
        let vsota = 0;
        const v1Arr = [v1.x, v1.y, v1.z, v1.w];
        for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 == 0) {
                v.push(vsota);
                vsota = 0;
            }
            vsota += this.m[i] * v1Arr[i % 4];
        }
        v.push(vsota);
        return new Vector(v[0]/v[3], v[1]/v[3], v[2]/v[3], v[3]/v[3]);
    }

    toArray() {
        return [...this.m];
    }

    toString() {
        return `(${this.m.join(',')})`;
    }
}