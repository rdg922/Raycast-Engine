var p5Inst = new p5(null, 'sketch');

window.preload = function () {
  //initMobileControls(p5Inst);
  p5Inst._predefinedSpriteAnimations = {};
  p5Inst._pauseSpriteAnimationsByDefault = false;
  var animationListJSON = {"orderedKeys":[],"propsByKey":{}};
  var orderedKeys = animationListJSON.orderedKeys;
  var allAnimationsSingleFrame = false;
  orderedKeys.forEach(function (key) {
    var props = animationListJSON.propsByKey[key];
    var frameCount = allAnimationsSingleFrame ? 1 : props.frameCount;
    var image = loadImage(props.rootRelativePath, function () {
      var spriteSheet = loadSpriteSheet(
          image,
          props.frameSize.x,
          props.frameSize.y,
          frameCount
      );
      p5Inst._predefinedSpriteAnimations[props.name] = loadAnimation(spriteSheet);
      p5Inst._predefinedSpriteAnimations[props.name].looping = props.looping;
      p5Inst._predefinedSpriteAnimations[props.name].frameDelay = props.frameDelay;
    });
  });

  function wrappedExportedCode(stage) {
    if (stage === 'preload') {
      if (setup !== window.setup) {
        window.setup = setup;
      } else {
        return;
      }
    }
// -----

//objects are always assigned variables so you can access it later on

//player inputs
var p1inputs = {
  moveLeft: 'a',
  moveRight: 'd',
  moveForward: 'w',
  moveBackward: 's',
  lookLeft: 'q',
  lookRight: 'e'

}

var p2inputs = {
  moveLeft: 'left',
  moveRight: 'right',
  moveForward: 'up',
  moveBackward: 'down',
  lookLeft: '1',
  lookRight: '2'
}


var player = new Player(windowWidth/2, windowHeight/2, 1, 1, p1inputs); // create new player object. normally the constructor is capitalized (I told you the wrong thing)
var gui = new Gui(0, 0, windowWidth, 100); // create Gui Bar at the very top with the origin on the box at the top left


var player2 = new Player(windowWidth/2, windowHeight/3, 1, 1, p2inputs);

var test = new Walls();
for(var i = 0; i < 5; i++){
  test.walls.push(new Boundary( random(1,windowWidth), random(1,windowHeight), random(1,windowWidth), random(1,windowHeight), [random(1,360),150,80])); //creates a single line of a preset color
}
var ray = new Ray(500,500,0,1);

var boundaries = [test] //array of all boundaries

createCanvas(windowWidth, windowHeight); //self explanatory

//console.log(Player) // just check if the player is created and what its default attributes are
World.frameRate = 60;
colorMode(HSB);
function draw(){
  player.checkCollision(test.walls);
  player.update() //handles keyboard input and whatnot
  player.collisionRay.castAll(test.get());
  var output = player.castRays(45, windowWidth/4, test.get())
  
  player2.checkCollision(test.walls);
  player2.update() //handles keyboard input and whatnot
  player2.collisionRay.castAll(test.get());
  var output2 = player2.castRays(45, windowWidth/4, test.get())
  

  //gui always happens at the end
  gui.updateValue("x", player.pos.x);
  gui.updateValue("y", player.pos.y);
  gui.updateValue("rotation", player.getLookRotation());
  gui.updateValue("Framerate", frameRate());

  //draw orders
  background(0);
  drawRays(output, 0, 0, windowWidth/2,windowHeight);
  drawRays(output2, windowWidth/2, 0, windowWidth ,windowHeight);
  stroke(255);
  line(windowWidth/2,0,windowWidth/2,windowHeight);
  //player.show() // draws before the gui and after the lines (to show the direction on top of the boundaries)
  //player2.show();
  gui.show(); //draws Gui on top
  

}

function drawRays(output, startx, starty, endx, endy){
  noStroke();
  for(var i = 0; i < output.length; i++){
    if (output[i].wall == null) continue;

    var height = windowHeight;
    var width = (endx - startx)/output.length;

    var inDist = 12000/output[i].dist;
    var top = height/2 + starty + inDist;
    var left = (width*i) + startx;
    var right = (width*(i+1)) + startx;
    var bottom = height/2 + starty - inDist; 


    fill([output[i].wall.color[0], output[i].wall.color[1], output[i].wall.color[2]  - output[i].dist/10 ] )
    quad(left, top, right, top, right, bottom, left, bottom);
   }
}

// -----
    try { window.draw = draw; } catch (e) {}
    switch (stage) {
      case 'preload':
        if (preload !== window.preload) { preload(); }
        break;
      case 'setup':
        if (setup !== window.setup) { setup(); }
        break;
    }
  }
  window.wrappedExportedCode = wrappedExportedCode;
  wrappedExportedCode('preload');
};

window.setup = function () {
  window.wrappedExportedCode('setup');
};
