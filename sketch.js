  var PLAY=1;
  var END=0;
  var gameState=PLAY;

  var trex,trex_run,trex_collided;
  var ground,groundImage,invisibleGround;
  var sound,sound1,sound2,Cactus,gameOver;
  var score=0;
  var obgroup,restart;

function preload(){
  
  trex_run=loadAnimation("TREX2.png","TREX3.png","TREX1.png");
  groundImage=loadImage("ground.png");
  sound=loadSound("jump.mp3");
  sound1=loadSound("checkPoint.mp3");
  sound2=loadSound("die.mp3");
  Cactus=loadImage("cactus.png");
  gameOver=loadImage("gameover.png");
  restart=loadImage("restart.png");
  trex_collided=loadAnimation("TREX2.png");
  
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex=createSprite(100,height-70,50,20);
  trex.addAnimation("running",trex_run);
  trex.addAnimation("collided",trex_collided);
  trex.scale=0.3;
  
  ground=createSprite(width/2,height,width,2);
  ground.addImage(groundImage);
  ground.x=width/2;
  ground.scale=1;
  
  invisibleGround=createSprite(width/2,height-70,width,2);
  invisibleGround.visible=false;
  
  game=createSprite(width/2,height/2-50);
  game.addImage(gameOver);
  game.scale=0.3;
  
  restart1=createSprite(width/2,height/2+50);
  restart1.addImage(restart);
  restart1.scale=0.1;
  
  obgroup=new Group();
  
  obgroup=createGroup();
  
}


function draw() {
 
  background("white");

  if(gameState === PLAY){
  
  game.visible = false;
  restart1.visible=false;
    
    ground.velocityX = -(4 + 3* score/100) ;
    
  if(ground.x<250){
  ground.x=ground.width/2;
  }
    
  trex.setCollider("circle",5,-14);
    
  //scoring
  score = score + Math.round(getFrameRate()/60);
    
  if(score>0 && score%100 === 0){
  sound1.play();
  }
    
  trex.changeAnimation("running",trex_run);
    
  if (ground.x < 0){
  ground.x = ground.width/2;
  }
    
  //jump when the space key is pressed
  if((touches.length >0||keyDown("space"))&& trex.y >= height-120){
  trex.velocityY = -18;
  sound.play();
  touches=[];
  }
    
  //add gravity
  trex.velocityY = trex.velocityY + 0.8
  
  //spawn obstacles on the ground
  obstacle();
    
  if(obgroup.isTouching(trex)){
  gameState = END;
    sound2.play();
  }
    
  }else if(gameState === END){
  game.visible = true;
  restart1.visible = true;
     
  if(touches.lenght>0||mousePressedOver(restart1)) {
  reset();
    touches=[];
  }

  //change the trex animation
  trex.changeAnimation("collided",trex_collided);
    
  ground.velocityX = 0;
  trex.velocityY = 0
      
  obgroup.setLifetimeEach(-1);
  // cloudsGroup.setLifetimeEach(-1);
     
  obgroup.setVelocityXEach(0);
  //cloudsGroup.setVelocityXEach(0);
  }

  trex.collide(invisibleGround);
 
  
  text("SCORE:"+score,300,50);
  textSize=80;
  
  drawSprites();
}

function obstacle(){
  if(frameCount%80===0){
  var cactus=createSprite(600,height-125,20,30);
  cactus.addImage(Cactus);
  cactus.velocityX=-(6+score/100);
  cactus.lifetime=100;
  cactus.scale=0.2;
  
  obgroup.add(cactus);
  } 
}

function reset(){
  gameState=PLAY;
  restart.visible=false;
  game.visible=false;

  obgroup.destroyEach();
  //cloudsGroup.destroyEach();
  
  score=0;
}
