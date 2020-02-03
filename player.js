class Player {
    //constructor is the function that is called upon initialization
    constructor(startX, startY, movementSpeed, rotationSpeed, keys) {
        this.pos = createVector(); //create an object with vector properties, see more below
        this.pos.x = startX;
        this.pos.y = startY;

        this.moveDir = createVector(); //create a vector for moving
        this.moveDir.x = 0;
        this.moveDir.y = -10;

        this.lookDir = createVector();
        this.lookDir.x = 0;
        this.lookDir.y = -10;

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
        this.collided = false;

        this.collisionRay = new Ray(this.pos.x, this.pos.y, this.moveDir.x, this.moveDir.y)

        //player input

        this.input = { //default player inputs
            moveLeft: 'a',
            moveRight: 'd',
            moveForward: 'w',
            moveBackward: 's',
            lookLeft: 'left',
            lookRight: 'right'
        };

        if(keys)this.input = { //inputs are overwritten if there is no keys
            moveLeft: keys.moveLeft,
            moveRight: keys.moveRight,
            moveForward: keys.moveForward,
            moveBackward: keys.moveBackward,
            lookLeft: keys.lookLeft,
            lookRight: keys.lookRight
        }

    }   

    getLookRotation() { //returns an angle
        return (round(atan2(this.lookDir.y, this.lookDir.x)));
    };

    setLookRotation(angle) { // sets the direction based on an angle
        this.lookDir.x = cos(angle) * this.collisionSize;
        this.lookDir.y = sin(angle) * this.collisionSize;
    }

    getMoveRotation() { //returns an angle
        return (round(atan2(this.moveDir.y, this.moveDir.x)));
    };

    setMoveRotation(angle) { // sets the direction based on an angle
        this.moveDir.x = cos(angle) * this.collisionSize;
        this.moveDir.y = sin(angle) * this.collisionSize;
    }


    move(amount) {
        //notice how this is similar to setting the rotation?

        var xprime = this.pos.x + cos(this.getMoveRotation()) * amount; //I use the values xprime and yprime to figure out how to move the player before actually moving
        var yprime = this.pos.y + sin(this.getMoveRotation()) * amount; //Once you have these values, you can check for collision by putting using line-line collision later on [not implemented]

        this.pos.x = (xprime);
        this.pos.y = (yprime);
    }

    update() {

        /*
        About variables within classes
        using local variables mean you don't nead the 'this.' in every single time you use it, but you cant use it everywhere
        In order to create a global varibal, use the constructor function
        */

        var moveForward = keyDown('w');

        //look direction directly is changed by the left and arrow keys
        if(keyDown(this.input.lookLeft))this.setLookRotation(this.getLookRotation() - this.rotSpeed)
        if(keyDown(this.input.lookRight))this.setLookRotation(this.getLookRotation() + this.rotSpeed);

        var xinput = keyDown(this.input.moveRight) - keyDown(this.input.moveLeft);
        var yinput = keyDown(this.input.moveForward) - keyDown(this.input.moveBackward);

        
        
        //I need this to work so I only need to check the ray ONCE per frame BEFORE MOVING.
        //I do this by changing the move direction based on the look direction
        this.setMoveRotation( this.getLookRotation() );
        if(xinput && !yinput)this.setMoveRotation(this.getLookRotation() + 90 * xinput);
        else if(xinput && yinput != 1) this.setMoveRotation(this.getLookRotation() + 180 + 45 * -xinput);
        else if(yinput == -1)this.setMoveRotation(this.getLookRotation() + 180);
        else if(xinput && yinput == 1 ) this.setMoveRotation( this.getLookRotation() + 45 * xinput);


        var will_move = abs(xinput || yinput)

        this.move(will_move * this.moveSpeed * !this.collided);
        this.collisionRay.pos = this.pos;
        this.collisionRay.moveDir = this.lookDir;
    }

    show() {
        //draw a line for the player
        stroke(255);
        line(this.pos.x, this.pos.y, this.pos.x + this.lookDir.x, this.pos.y + this.lookDir.y);
        stroke('red')
        fill(255);
        ellipse(this.pos.x + this.lookDir.x, this.pos.y + this.lookDir.y, 8);
        line(this.pos.x, this.pos.y, this.pos.x + this.moveDir.x, this.pos.y + this.moveDir.y)
        this.collisionRay.show();
    }

    checkCollision(walls) {
        this.collisionRay.dir = this.moveDir;
        var closest = this.collisionRay.castAll(walls, true);
        if(closest && closest.collided == true){
            this.collided = true;
        }else{
            this.collided = false;
        }
    }

    updateCollisionRay(){

    }

    drawRays(fov, rayCount, walls){
        var output = [];

        var dir = this.getLookRotation();
        var increment = fov/rayCount;
        this.setLookRotation(dir-fov/2);
        for(var a = dir-fov/2; a < dir+fov/2; a+=increment){
            this.setLookRotation(a)

            var outputData = {
                //exists: false,
                wall: null,
                dist: null,
                //ray: null,
                //pt: null,
                //angle: null
            }

            var ray = new Ray(this.pos.x, this.pos.y, this.lookDir.x, this.lookDir.y)
            var pt = ray.castAll(walls);
            if(pt){
                outputData.wall = pt.wall;
                outputData.dist = abs(dist(pt.x, pt.y, this.pos.x, this.pos.y));
                //outputData.ray = ray;
                //outputData.pt = pt;
                //outputData.angle = a;
                //outputData.exists = true
            }
            output.push(outputData);
        }
        this.setLookRotation(dir);
        return(output);
    }

}