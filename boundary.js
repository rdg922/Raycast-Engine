class Boundary{
    constructor(x1, y1, x2, y2, color){ //I decided to experiment with using .ts meaning its typed (google typescript)
        this.a = createVector();
        this.a.x = x1;
        this.a.y = y1;

        this.b = createVector();
        this.b.x = x2;
        this.b.y = y2;

        this.color = color; //color will be an array in order to correctly store the individual values
    }

    show(){
        stroke(this.color[0], this.color[1], this.color[2] );
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }

}

class Walls{
    
    constructor(){
        this.walls = [];
    }

    get(){
        return this.walls;
    }

    show(){
        for(var wall of this.walls){
            wall.show();
        }
    }

}