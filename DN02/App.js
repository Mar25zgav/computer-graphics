import { Bezier } from "./Bezier.js";
import { Spline } from "./Spline.js";
import { Vector } from "./Vector.js";

class ApproximatedPoint extends Vector {

    constructor(point) {
        super(point);
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.coords[0] - 5, this.coords[1] - 5, 10, 10);
    }

    intersects(x, y) {
        return (x >= this.coords[0] - 5 && x <= this.coords[0] + 5 && y >= this.coords[1] - 5 && y <= this.coords[1] + 5)
    }
}

class InterpolatedPoint extends Vector {

    constructor(point) {
        super(point);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.coords[0], this.coords[1], 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
    }

    intersects(x, y) {
        return (x - this.coords[0]) * (x - this.coords[0]) + (y - this.coords[1]) * (y - this.coords[1]) <= (5 * 5);
    }
}

class App {

    constructor () {
        this.spline = new Spline([]);
        this.dragging = false;
    }

    mouseDown(x, y) {
        // Če prva krivulja še ne obstaja
        if (this.spline.isEmpty()) {
            const p0 = new InterpolatedPoint([x, y]);
            this.spline.addBezier(new Bezier([p0]));
        } else if (this.spline.curves[0].size() == 2) {
            // Če imamo šele prvi dve točki
            const p3 = new InterpolatedPoint([x, y]);
            this.spline.curves[0].addPoint(p3);
        } else {
            // Izračunaj prvo interpolirano točko glede na prejšnjo krivuljo
            const p0 = this.spline.curves[this.spline.curves.length - 1].points[3];
            this.spline.addBezier(new Bezier([p0]));
            // Izračunaj prvo aproksimirano točko glede na prejšnjo krivuljo
            const diff = p0.sub(this.spline.curves[this.spline.curves.length - 2].points[2]);
            const p1 = new ApproximatedPoint([p0.coords[0] + diff.coords[0], p0.coords[1] + diff.coords[1]])
            this.spline.curves[this.spline.curves.length - 1].addPoint(p1);
            // Ustvari zadnjo interpolirano točko
            const p3 = new InterpolatedPoint([x, y]);
            this.spline.curves[this.spline.curves.length - 1].addPoint(p3);
        }
        this.drawPoints();
    }

    mouseUp(x, y) {
        // Če imamo le prvo točko
        if (this.spline.curves[0].size() == 1) {
            const p = new ApproximatedPoint([x, y]);
            this.spline.curves[0].addPoint(p);
            this.drawApproximatedLines();
            this.drawPoints();
        } else if (this.spline.curves[0].size() == 3) {
            // Če nimamo še prve krivulje
            const p2 = new ApproximatedPoint([x, y]);
            let p3 = this.spline.curves[0].popPoint();
            this.spline.curves[0].addPoint(p2);
            this.spline.curves[0].addPoint(p3);
            this.drawSpline();
            this.drawPoints();
        } else {
            // Ustvari zadnjo aproksimirano točko
            const p2 = new ApproximatedPoint([x, y]);
            let p3 = this.spline.curves[this.spline.curves.length - 1].popPoint();
            this.spline.curves[this.spline.curves.length - 1].addPoint(p2);
            this.spline.curves[this.spline.curves.length - 1].addPoint(p3);
            this.drawSpline();
            this.drawPoints();
        }
    }

    drawSpline() {
        //this.spline.makeContinuous();
        this.spline.makeSmooth();
        // Počisti platno
        ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        // Izriši vsak bezier
        for (let i = 0; i < this.spline.curves.length; i++) {
            const bz = this.spline.curves[i];
            const p0 = bz.points[0];
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.moveTo(p0.coords[0], p0.coords[1]);
            for (let t = 0; t <= 1; t += 0.001) {
                const p = bz.value(t);
                ctx.lineTo(p.coords[0], p.coords[1]);
            }
            ctx.stroke();
        }
        // Izriši črto od interpolirane do aproksimirane točke
        this.drawApproximatedLines();
    }

    drawPoints() {
        // Izriši vsako interpolirano/aproksimirano točko
        for (let i = 0; i < this.spline.curves.length; i++) {
            const bz = this.spline.curves[i];
            for (let j = 0; j < bz.points.length; j++) {
                if (bz.points[j] instanceof ApproximatedPoint || bz.points[j] instanceof InterpolatedPoint)
                    bz.points[j].draw();
                else {
                    const p = new ApproximatedPoint([bz.points[j].coords[0], bz.points[j].coords[1]]);
                    bz.points[j] = p;
                    p.draw();   
                }
            }
        }
    }

    drawApproximatedLines() {
        // Za vsak bezier poveži interpolirano in aproksimirano točko
        for (let i = 0; i < this.spline.curves.length; i++) {
            const bz = this.spline.curves[i];
            for (let j = 0; j < bz.points.length; j += 2) {
                const p0 = bz.points[j];
                const p1 = bz.points[j + 1];
                ctx.beginPath();
                ctx.setLineDash([5, 5]);
                ctx.moveTo(p0.coords[0], p0.coords[1]);
                ctx.lineTo(p1.coords[0], p1.coords[1]);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext("2d");

const app = new App();

onResize();

canvas.addEventListener('mousedown', (e) => {
    app.mouseDown(e.offsetX, e.offsetY)
});

canvas.addEventListener('mouseup', (e) => {
    app.mouseUp(e.offsetX, e.offsetY);
});

window.onresize = () => onResize();

function onResize() {
    const canvas = document.getElementById('myCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    app.drawApproximatedLines();
    app.drawSpline();
    app.drawPoints();
}