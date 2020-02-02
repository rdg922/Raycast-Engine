class Player {

    //constructor is the function that is called upon initialization
    constructor(startX, startY, movementSpeed, rotationSpeed) {
        this.pos = createVector(); //create an object with vector properties, see more below
        this.pos.x = startX;
        this.pos.y = startY;

        this.futurePos = this.pos;

        this.dir = createVector(); //create an object with vector properties, see more below
        this.dir.x = 0;
        this.dir.y = 1;

        this.moveSpeed = movementSpeed;
        this.rotSpeed = rotationSpeed;

        /*
        about createVector()
        It essentially creates a new object with a few values, like an x, and y, and some other ones we don't need
        the Vector is p5.js exclusive, meaning it will not work on most other programming languages

        to circumvent this, I used to create objects on code.org.
        I created it like this:
        this.pos = {
            x: some value,
            y: some other value
        };

        and a similar thing for the dir
        but p5.js has a createVector() which could be used for nifty math tricks later on I think.
        */

        this.collisionSize = 10; //will be used to make sure collisions won't happen;

    }

    getRotation() { //returns an angle
        return (round(atan2(this.dir.y, this.dir.x)));
    };

    setRotation(angle) { // sets the direction based on an angle
        this.dir.x = cos(angle) * this.collisionSize;
        this.dir.y = sin(angle) * this.collisionSize;
    }


    move(amount) {
        //notice how this is similar to setting the rotation?

        var xprime = this.pos.x + cos(this.getRotation()) * amount; //I use the values xprime and yprime to figure out how to move the player before actually moving
        var yprime = this.pos.y + sin(this.getRotation()) * amount; //Once you have these values, you can check for collision by putting using line-line collision later on [not implemented]

        this.futurePos.x = (xprime);
        this.futurePos.y = (yprime);
    }

    strafe(xdir, amount) { //side to side movement of the player seen in the original DOOM

        //uses a nifty trick of just rotating left or right and then moves forward and rotates back 

        this.setRotation(this.getRotation() + 90);
        this.move(amount * xdir) // if xdir is 1, moves rotates left and then moves forward, if -1, moves backward. All of this happens before rotating back. If xdir is 0, no movement
        this.setRotation(this.getRotation() - 90);
    }

    update() {

        /*
        About variables within classes
        using local variables mean you don't nead the 'this.' in every single time you use it, but you cant use it everywhere
        In order to create a global varibal, use the constructor function
        */
        var forwardDir = keyDown('w') - keyDown('s'); //returns 1 (forward), 0 ( both keys are pressed, no movement) or -1 (move backwards)
        var rotDir = keyDown('d') - keyDown('a'); //returns 1, 0, or -1 but for left, no rotation, or right respectively

        var strafe = keyDown('right') - keyDown('left'); //ill use this to move left and right based on rotation

        this.move(forwardDir * this.moveSpeed);
        this.strafe(strafe, this.moveSpeed);
        this.setRotation(this.getRotation() + rotDir * this.rotSpeed);

    }

    show() {
        //draw a line for the player
        stroke(255);
        line(this.pos.x, this.pos.y, this.pos.x + this.dir.x, this.pos.y + this.dir.y);

    }

    checkCollision(lines) {

        var collided = false; // so far has no collided

        for (var l of lines) {
            var x1 = this.pos.x;
            var y1 = this.pos.y;
            var x2 = this.futurePos.x;
            var y2 = this.futurePos.y;
            var x3 = l.a.x;
            var y3 = l.a.y;
            var x4 = l.b.x;
            var y4 = l.b.y;

            var den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

            if (den == 0) continue; // if denominator is 0, lines are parallel and cannot collide, so skip to the next one

            var t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
            var u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

            if (t > 0 && t < 1 && u > 0) {
                collided = true;
                break;
            }

        }

        //if(collided)this.pos = this.futurePos;

    }

}