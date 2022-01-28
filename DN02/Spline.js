export class Spline {

    constructor(curves) {
        // ustvari kubičen Bézierjev zlepek iz seznama krivulj curves
        this.curves = curves;
    }

    value(t) {
        // vrne točko na Bézierjevem zlepku ob času t
        let idxSpline = Math.floor(t);
        let time = t - idxSpline;
        if (t == this.curves.length) {
            idxSpline = t - 1;
            time = 1;
        } 
        return this.curves[idxSpline].value(time);
    }

    derivative(t) {
        // vrne odvod Bézierjevega zlepka ob času t
        let idxSpline = Math.floor(t);
        let time = t - idxSpline;
        if (t == this.curves.length) {
            idxSpline = t - 1;
            time = 1;
        } 
        return this.curves[idxSpline].derivative(time);
    }

    makeContinuous() {
        // zlepku zagotovi zveznost C0, tako da nepovezani krajišči sosednjih krivulj premakne v njuno aritmetično sredino
        for (let i = 0; i < this.curves.length - 1; i++) {
            let p = this.curves[i].value(1);
            let q = this.curves[i + 1].value(0);
            let sum = p.add(q).divScalar(2);
            this.curves[i].points[this.curves[i].points.length - 1] = sum;
            this.curves[i + 1].points[0] = sum;
        }
    }

    makeSmooth() {
        // zlepku zagotovi zveznost C2, tako da odvoda v krajiščih dveh sosednjih zlepkov, kjer zlepek ni gladek, nadomesti z njuno aritmetično sredino.* Pazite: zveznost C2 pomeni tudi zveznost C0. C'(1) = n(Pn - Pn-1) in C'(0) = n*(P1 - P0)Ta postopek ne zagotovi zveznosti C2 v primeru, da je aritmetična sredina odvodov enaka 0. Ta detajl lahko ignorirate.
        for (let i = 0; i < this.curves.length - 1; i++) {
            let p = this.curves[i].derivative(1);
            let q = this.curves[i + 1].derivative(0);
            let povpOdvod = p.add(q).divScalar(2);
            let p1 = this.curves[i].value(1).sub(povpOdvod.divScalar(this.curves[i].points.length - 1));
            let q1 = this.curves[i + 1].value(0).add(povpOdvod.divScalar(this.curves[i + 1].points.length - 1))
            this.curves[i].points[this.curves[i].points.length - 2] = p1;
            this.curves[i + 1].points[1] = q1;
        }
    }

    addBezier(bz) {
        this.curves.push(bz);
    }

    isEmpty() {
        if (this.curves.length == 0) return true;
        return false;
    }
}