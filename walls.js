import { Boundary } from './boundary'
class Walls{
    
    constructor(){
        this.walls = [];
    }

    createNewWall(x1, y1, x2, y2){
        this.walls.push(new Boundary())
    }

    getWalls(){

    }

}