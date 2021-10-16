/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;
var obstaclesGroup, obstacle1;
var score=0;
var lives = 3;
var gameOver, restart;
var eatsound
var appleGroup, appleimg
var winimg, win
var loseimg, lose, losesound
var bananaimg, bananaGroup
var pauseimg, pause

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/sadKangaroo.png");

  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  appleimg = loadImage("assets/apple.png");
  winimg = loadImage("assets/win.png")
  loseimg = loadImage("assets/lose.png")
  bananaimg =loadImage("assets/bananaPeelObstacle.png")

  jumpSound = loadSound("assets/jump.mp3");
  collidedSound = loadSound("assets/collided.wav");
  eatsound = loadSound("assets/eatingsound.wav");
  losesound = loadSound("assets/lose.wav")
}

function setup() {
  createCanvas(950,600);
  //createing the background
  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;
  //creating the kangaroo
  kangaroo = createSprite(50,200,20,50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.15;
  //kangaroo.debug = true
  kangaroo.setCollider("circle",0,0,300)
  //creating ground for kangaroo to run on
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;
//creating gameOver, win and restart
  gameOver = createSprite(450,200);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5
  gameOver.visible = false

  restart = createSprite(450,310);
  restart.addImage(restartImg);
  restart.scale = 0.5
  restart.visible = false

  win = createSprite(450,200);
  win.addImage(winimg)
  win.visible = false

  lose = createSprite(465,220)
  lose.addImage(loseimg)
  //lose.scale = 0.75
  lose.visible = false


//creating the groups and setting the score
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  appleGroup = new Group()
  bananaGroup = new Group()
  score = 0;
}

function draw() {
  background(255);

   kangaroo.x=camera.position.x-270;
   
  if (gameState===PLAY){
    jungle.velocityX=-5
    if(jungle.x<200){
       jungle.x=400
    }

   console.log(kangaroo.y)
    if(keyDown("space")&& kangaroo.y>270) {
      jumpSound.play();
      kangaroo.velocityY = -18;
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();
    spawnApples()
    spawnBanana()

    kangaroo.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      lives = lives - 1
      gameState = END;
    }
    if(shrubsGroup.isTouching(kangaroo)){
      shrubsGroup[0].destroy()
      eatsound.play()
      score = score +2
    }
    if(appleGroup.isTouching(kangaroo)){
      appleGroup[0].destroy()
      eatsound.play()
      score = score +2
    }
    if(bananaGroup.isTouching(kangaroo)){
      collidedSound.play();
      lives = lives - 1
      gameState = END;
    }

    if(keyIsDown(UP_ARROW)){
      window.location.reload()
     }

    if(lives === 0){
      restart.visible = false
      gameOver.visible = false
      lose.visible = true
      obstaclesGroup.destroyEach()
      shrubsGroup.destroyEach();
      appleGroup.destroyEach();
      bananaGroup.destroyEach();

      losesound.play()
      setTimeout(reload,5000)
    }
    

    if(score === 30){
      win.visible = true
      lives = 3
      obstaclesGroup.destroyEach()
      shrubsGroup.destroyEach();
      appleGroup.destroyEach();
      bananaGroup.destroyEach()
      restart.visible = true;
     }

    
    if(mousePressedOver(restart)) 
    {
        reset();
    }

  }
  else if (gameState === END) {
    gameOver.visible = true
    restart.visible = true;
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    appleGroup.setVelocityXEach(0);
    bananaGroup.setVelocityXEach(0);
    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    appleGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)) 
    {
        reset();
    }
    
  }
 
  drawSprites();
  textSize(20)
  fill("white")
  text ("Score: " + score,20,30)
  text ("Lives: " + lives,130,30)
  text("Press space to jump! Help the Kangaroo to eat the plants and apples and avoid the rocks and bananas!",20,60)
  text("You have 3 Lives Get to a score of 30 to win!",20,90)
}

function spawnShrubs() {

  if (frameCount % 90 === 0) {

     var shrub = createSprite(camera.position.x+500,330,40,10);
   

    shrub.velocityX = -(6 + 3*score/4)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
         
    shrub.scale = 0.05;
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
   

    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(7 + 3*score/4)
    obstacle.scale = 0.15;   
 
    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}

function spawnBanana(){
  if(frameCount % 190 === 0) {
  var banana = createSprite(camera.position.x+400,330,40,40);
  banana.addImage(bananaimg);
  banana.velocityX = -(7 + 3*score/4)
  banana.scale = 0.25; 
  banana.lifetime = 400;
  bananaGroup.add(banana)
  }
}

function spawnApples(){
  if(frameCount % 80 === 0){
    var apple = createSprite(930,120,40,10);
    apple.scale = 0.15; 
    apple.addImage(appleimg);
    apple.velocityX = -(5 + 3*score/4)
    apple.lifetime = 300
    appleGroup.add(apple)
  }
}

function reset()
{
  gameState = PLAY;
  kangaroo.changeAnimation("running", kangaroo_running);
  gameOver.visible = false;
  restart.visible = false;
  win.visible = false
  lose.visible = false
  obstaclesGroup.destroyEach()
  shrubsGroup.destroyEach();
  appleGroup.destroyEach();
  bananaGroup.destroyEach();
  score = 0
}

function reload(){
  window.location.reload()
}