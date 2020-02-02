class Ray{
    constructor(startx, starty, xdir, ydir){ // input start position of ray and direction
        this.pos = {
            x: startx,
            y: starty
        }
        this.dir = {
            x: xdir,
            y: ydir
        }
    }

    show(){
        stroke(255);
        //line(this.pos.x, this.pos.y, this.pos.x + this.dir.x, this.pos.y + this.dir.y);
    }

    cast(wall, checkCollision){

        var x1 = this.pos.x;
        var y1 = this.pos.y;
        var x2 = this.pos.x + this.dir.x;
        var y2 = this.pos.y + this.dir.y;

        var x3 = wall.a.x;
        var y3 = wall.a.y;
        var x4 = wall.b.x;
        var y4 = wall.b.y;
        var den = (x1 - x2) * (y3 - y4) - (y1-y2) * (x3 - x4);
              
        if(den == 0)return;
      
        var u = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        var t = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        
        var pt = {
            x: x1 + u * (x2-x1),
            y: y1 + u * (y2-y1),
            wall: wall,
            collided: false
        };

        if(checkCollision && ( t > 0 && t < 1 && u > 0 && u < 1) ){
            pt.collided = true;
        }

        if( t > 0 && t < 1 && u > 0){
            //stroke(255);
            return pt;
        }

    }



    castAll(walls, checkCollision){
        var points = [];
        var closest;
        var record = Infinity;
        var getDist = (pt) => abs(dist(pt.x, pt.y, this.pos.x, this.pos.y))
        for(var wall of walls){
            if(this.cast(wall) != undefined)points.push(this.cast(wall, checkCollision));
        }
        for(var pt of points){
            if(pt == undefined)continue;
            if (getDist(pt) < record){
                record = getDist(pt);
                closest = pt;
            } 
        }
        if(closest){
            line(closest.x, closest.y, this.pos.x, this.pos.y);
            return(closest)
        }
    }

    getRotation() { //returns an angle
        return (round(atan2(this.dir.y, this.dir.x)));
    };

    setRotation(angle) { // sets the direction based on an angle
        this.dir.x = cos(angle) * 100;
        this.dir.y = sin(angle) * 100;
    }
}