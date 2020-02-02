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
var player = new Player(200,200, 10, 10); // create new player object. normally the constructor is capitalized (I told you the wrong thing)
var gui = new Gui(0, 0, windowWidth, 100); // create Gui Bar at the very top with the origin on the box at the top left
var test = new Boundary(200,200,300,200, [random(1,360),150,80]); //creates a single line of a preset color

var ray = new Ray(500,500,0,1);

var boundaries = [test] //array of all boundaries

createCanvas(windowWidth, windowHeight); //self explanatory

//console.log(Player) // just check if the player is created and what its default attributes are
World.frameRate = 60;

function draw(){
  background(0);

  player.update() //handles keyboard input and whatnot
  //player.checkCollision(boundaries);

  ray.pos.x = player.pos.x;
  ray.pos.y = player.pos.y;
  ray.setRotation(player.getRotation());
  ray.cast(boundaries[0]);


  //gui always happens at the end
  gui.updateValue("x", player.pos.x);
  gui.updateValue("y", player.pos.y);
  gui.updateValue("rotation", player.getRotation());
  gui.updateValue("Framerate", frameRate());

  //draw orders
  ray.show();
  for(b of boundaries)b.show() //draws a single line for each boundary
  player.show() // draws before the gui and after the lines (to show the direction on top of the boundaries)
  gui.show(); //draws Gui on top
  

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
