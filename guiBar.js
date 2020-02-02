class Gui{

    constructor(x, y, width, height){ //origin will be top left 

        this.x = x + width/2;
        this.y = y + height/2;
        this.width = width;
        this.height = height;
        this.contents = {};
        
    }

    show(){
        rectMode(CENTER);
        stroke(255);
        textAlign(CENTER, CENTER);
        
        var width = this.width/Object.keys(this.contents).length; //assigns w of boxes based on how many there will be. This allows the amount of boxes to change as needed
        var height = this.height; //height will NOT change

        for(var i = 0; i < Object.keys(this.contents).length; i++){
            
            var x = (width*i)+width/2;
            var y = this.y;

            fill(0);
            rect(x,y,width,height); //draws boxes
            fill(255);

            text(Object.keys(this.contents)[i] + ": " + this.contents[ Object.keys(this.contents)[i] ] ,x,y)  ; //draws text within Boxes

        }
    }

    updateValue(key, value){
        this.contents[key] = round(value);
    }

    reportContents(){ //output every key and its corresponding value
        for(let content of Object.keys(this.contents) ){
            console.log( content + ": " + this.contents[(content)]);
        }
    }

}