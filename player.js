class Player {
    //constructor is the function that is called upon initialization
    constructor(startX, startY, movementSpeed, rotationSpeed) {
        this.pos = createVector(); //create an object with vector properties, see more below
        this.pos.x = startX;
        this.pos.y = startY;

        this.dir = createVector(); //create an object with vector properties, see more below
        this.dir.x = 0;
        this.dir.y = -10;

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

        this.collisionRay = new Ray(this.pos.x, this.pos.y, this.dir.x, this.dir.y)

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
        var moveOther = (keyDown('a') || keyDown('s') || keyDown('d') || keyDown('a') || keyDown('d') || keyDown('s'))

        if(keyDown('left'))this.setRotation(this.getRotation() - this.rotSpeed)
        if(keyDown('right'))this.setRotation(this.getRotation() + this.rotSpeed);

        // var xinput = keyDown('d') - keyDown('a');
        // var yinput = keyDown('w') - keyDown('s');

        // this.collisionRay.dir = this.dir;
        // this.move(this.moveSpeed * !this.collided * yinput);
        
        //this bit will make sure that the direction changes only once per frame. I need this to work so I only need to check the ray one per frame BEFORE MOVING.
        //I do this by changing direction only if the key changes
        
        if(keyWentDown('d')){
            this.setRotation(this.getRotation() + 90)
        }

        if(keyWentUp('d')){
            this.setRotation(this.getRotation() - 90)
        }

        if(keyWentDown('a')){
            this.setRotation(this.getRotation() - 90)
        }

        if(keyWentUp('a')){
            this.setRotation(this.getRotation() + 90)
        }

        if(keyWentDown('s')){
            this.setRotation(this.getRotation() - 180);
            
        }

        if(keyWentUp('s')){
            this.setRotation(this.getRotation() - 180);
            
        }

        //this.strafe(strafe, this.moveSpeed);
        
        //this.setRotation(this.getRotation() + rotDir * this.rotSpeed);
        this.move((moveForward || moveOther) * this.moveSpeed * !this.collided);
        this.collisionRay.pos = this.pos;
        this.collisionRay.dir = this.dir;
    }

    show() {
        //draw a line for the player
        stroke(255);
        line(this.pos.x, this.pos.y, this.pos.x + this.dir.x, this.pos.y + this.dir.y);
        stroke('red')
        fill(255);
        ellipse(this.pos.x + this.dir.x, this.pos.y + this.dir.y, 8);
        this.collisionRay.show();
    }

    checkCollision(walls) {

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

        
        if(keyDown('a') || keyWentDown('a'))this.setRotation(this.getRotation() + 90);
        if(keyDown('d') || keyWentDown('d') )this.setRotation(this.getRotation() - 90);
        if(keyDown('s') || keyWentDown('s'))this.setRotation(this.getRotation() + 180);

        var dir = this.getRotation();
        var increment = fov/rayCount;
        this.setRotation(dir-fov/2);
        for(var a = dir-fov/2; a < dir+fov/2; a+=increment){
            this.setRotation(a)

            var outputData = {
                exists: false,
                wall: null,
                dist: null,
                ray: null,
                pt: null,
                angle: null
            }

            var ray = new Ray(this.pos.x, this.pos.y, this.dir.x, this.dir.y)
            var pt = ray.castAll(walls);
            if(pt){
                outputData.wall = pt.wall;
                outputData.dist = abs(dist(pt.x, pt.y, this.pos.x, this.pos.y));
                outputData.ray = ray;
                outputData.pt = pt;
                outputData.angle = a;
                outputData.exists = true
            }
            output.push(outputData);
        }
        this.setRotation(dir);
        if(keyDown('a') ||keyWentDown('a') )this.setRotation(this.getRotation() - 90);
        if(keyDown('d') ||keyWentDown('d'))this.setRotation(this.getRotation() + 90);
        if(keyDown('s') ||keyWentDown('s'))this.setRotation(this.getRotation() + 180);
        return(output);
    }

}