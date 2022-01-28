class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colliding = false;
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2;
    }

    contains(circle) {
        let distance = (circle.x - this.x) ** 2 + (circle.y - this.y) ** 2;
        return distance <= this.radius ** 2;
    }

    intersects(circle) {
        let dx = this.x + this.radius - (circle.x + circle.radius);
        let dy = this.y + this.radius - (circle.y + circle.radius);
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + circle.radius) {
            return true;
        }
        return false;
    }

    update() {
        // Odboj od stene
        if (this.x + this.radius >= WIDTH || this.x - this.radius <= 0)
            this.dx = -this.dx;
        if (this.y + this.radius >= HEIGHT || this.y - this.radius <= 0)
            this.dy = -this.dy;

        this.x += this.dx * 1.5;
        this.y += this.dy * 1.5;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "green";
        if (this.colliding) {
            ctx.fillStyle = "red";
        }
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

class Square {
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
    }

    contains(circle) {
        // Poglej če je krog znotraj kvadrata
        return (
            circle.x - circle.radius >= this.x &&
            circle.x + circle.radius <= this.x + this.w &&
            circle.y - circle.radius >= this.y &&
            circle.y + circle.radius <= this.y + this.w
        );
    }

    intersects(range) {
        // Preveri ali se nahaja zunaj kvadrata in vrni not
        return !(
            this.x > range.x + range.w ||
            this.x + this.w < range.x ||
            this.y > range.y + range.w ||
            this.y + this.w < range.y
        );
    }
}

class QuadTree {
    constructor(boundary, capacity = 5) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.divided = false;
        this.circles = [];
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;

        let tl = new Square(x, y, w / 2, w / 2);
        let tr = new Square(x + w / 2, y, w / 2, w / 2);
        let br = new Square(x + w / 2, y + w / 2, w / 2, w / 2);
        let bl = new Square(x, y + w / 2, w / 2, w / 2);

        this.topleft = new QuadTree(tl);
        this.topright = new QuadTree(tr);
        this.bottomright = new QuadTree(br);
        this.bottomleft = new QuadTree(bl);

        this.divided = true;
    }

    insert(circle) {
        // Če prejet krogec ni v poddrevesu, končaj
        if (!this.boundary.contains(circle)) {
            return;
        }
        // Če je število krogcev v poddrevesu manjše od nastavljene kapacitete, ali pa smo na največji stopnji delitve, dodaj
        if (
            this.circles.length < this.capacity ||
            this.boundary.w == MAX_DEPTH
        ) {
            this.circles.push(circle);
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            this.topleft.insert(circle);
            this.topright.insert(circle);
            this.bottomright.insert(circle);
            this.bottomleft.insert(circle);
        }
    }

    getCirclesInRange(range) {
        let found_circles = [];
        if (!this.boundary.intersects(range)) {
            return found_circles;
        }
        // Za vsak krogec v tem vozlišču poglej ali je znotraj podane meje, če je ga shrani
        for (let circle of this.circles) {
            if (range.contains(circle)) {
                found_circles.push(circle);
            }
        }
        // Če imamo sinove preglej še te in dodajaj v seznam najdenih krogcev
        if (this.divided) {
            Array.prototype.push.apply(
                found_circles,
                this.topleft.getCirclesInRange(range)
            );
            Array.prototype.push.apply(
                found_circles,
                this.topright.getCirclesInRange(range)
            );
            Array.prototype.push.apply(
                found_circles,
                this.bottomright.getCirclesInRange(range)
            );
            Array.prototype.push.apply(
                found_circles,
                this.bottomleft.getCirclesInRange(range)
            );
        }

        return found_circles;
    }

    draw() {
        if (SHOW_BOUDARIES) {
            ctx.beginPath();
            ctx.rect(
                this.boundary.x,
                this.boundary.y,
                this.boundary.w,
                this.boundary.w
            );
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
        if (this.divided) {
            this.topleft.draw();
            this.topright.draw();
            this.bottomright.draw();
            this.bottomleft.draw();
        }
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function addCircles() {
    let numberOfCircles = parseInt(input[0].value);
    input[0].value = "";
    for (let i = 0; i < numberOfCircles; i++) {
        let x = getRandomIntInclusive(0 + RADIUS, WIDTH - RADIUS);
        let y = getRandomIntInclusive(0 + RADIUS, HEIGHT - RADIUS);
        let circle = new Circle(x, y, RADIUS);
        objects.push(circle);
    }
}

function main() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    let quadTree = new QuadTree(new Square(0, 0, WIDTH));

    for (let circle of objects) {
        quadTree.insert(circle);
        circle.update();
        circle.draw();
        circle.colliding = false;
    }

    for (const object of objects) {
        const range = new Circle(object.x, object.y, RADIUS * 2); // gledamo le za 1 premer več v okolici krogca
        const others = quadTree.getCirclesInRange(range);
        for (const other of others) {
            COLLISION_CHECKS++;
            if (object !== other && object.intersects(other)) {
                object.colliding = true;
                other.colliding = true;
                COLLISIONS++;
            }
        }
    }

    // Za primerjavo - primerjamo vsakega z vsakim
    // for (let object of objects) {
    //     for (let other of objects) {
    //         if (object !== other && object.intersects(other)) {
    //             object.colliding = true;
    //             other.colliding = true;
    //         }
    //     }
    // }

    quadTree.draw();

    // STATS
    label[0].innerHTML = objects.length;
    label[1].innerHTML = COLLISIONS;
    label[2].innerHTML = COLLISION_CHECKS;
    label[3].innerHTML = objects.length ** 2;
    label[4].innerHTML = Math.floor(objects.length ** 2 / COLLISION_CHECKS);

    // RESET STATS
    COLLISIONS = 0;
    COLLISION_CHECKS = 0;

    requestAnimationFrame(main);
}

const WIDTH = 1000;
const HEIGHT = 1000;
const RADIUS = 8;
const MAX_DEPTH = WIDTH / 16 // globina 5, 1 = globina 1, 2 = globina 2, 4 = globina 3, 8 = globina 4
let COLLISIONS = 0;
let COLLISION_CHECKS = 0;
let SHOW_BOUDARIES = true;
let RUNNING = false;
let objects = [];

const cvs = document.getElementById("myCanvas");
const ctx = cvs.getContext("2d");
cvs.width = WIDTH;
cvs.height = HEIGHT;

const input = document.getElementsByTagName("input");
input[0].addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addCircles();
        if (!RUNNING) {
            RUNNING = true;
            main();
        }
    }
});

const button = document.getElementsByTagName("button");
button[0].addEventListener("click", function (event) {
    SHOW_BOUDARIES = !SHOW_BOUDARIES;
});

const label = document.getElementsByTagName("label");
