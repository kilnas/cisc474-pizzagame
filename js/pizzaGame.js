



//------GLOBAL VARIABLES

var PIZZAROTATE_DEG = 0;
var ROTATE_VAL = 30;
var PIZZASPEED = 15;
var GROUNDLINE = 400;
var GRAVITY = 9.8;
var FRICTION = .10;

//-------------- MODEL


var PizzaGame = function(level, pizzaPlayer, door){ // game object
    var self = this;
    this.lives = 3;
    this.level = level;
    this.score = 0;
    this.listOfEnemies = {};
    this.listOfIngredients = {};
    this.listOfToppings = {};
    this.listOfPlatforms = {};
    this.pizzaPlayer = pizzaPlayer;
    this.door = door;
    this.width = 900;
    this.height = 400;
    this.isRunning = false;
    //this.ingredientsComplete = false;

    this.update = function(){
    
    };
    
    //check if player has collected all ingredients
    this.checkIngredientCompletion = function(){
        var complete = true;
        for(var i=0; i < self.listOfIngredients.length; i++){
            console.log("checkin " + self.listOfIngredients[i].type);
            complete = complete && self.listOfIngredients[i].isCollected;
        }
        
        //If collected all ingredients, now can collect toppings, exit level, etc.
        if(complete){
            self.ingredientsComplete = true;
            self.door.isUnlocked = true;
            console.log("You collected all the ingredients! Now you can get toppings and be eaten.");
            //alert("You collected all the ingredients! Now you can get toppings and be eaten.");
        }
    };
}


var PizzaPlayer = function(xPos, yPos, width, height){ // main character player
    var self = this;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.yVel = 0;
    this.xVel = 0;
    this.isMoving = false;
    this.isJumping = false;
    this.isOnPlatform = false;
    this.toppings = [];
    this.currToppingsLength = 0; //counter to check for change
    this.isHittingDoor = false;
    this.isHittingEnemy=false;
    this.isHittingTopping = false;
    this.isHittingIngredient = false;

    this.moveLeft = function(value){
        //console.log(self.xVel);
            self.xVel = -200;
            self.isMoving = true;
            
            
            
        //UNUSED
        if(self.isJumping){
          
        }else{
            //self.xPos = self.xPos - value;
        }
        
    }
    
    this.moveRight = function(value){
        //console.log(self.xVel);
        self.xVel = 200;
        self.isMoving = true;
        
        
        //UNUSED
        if(self.isJumping){ // if jumping
            //self.xVel = 60;
            //self.isMoving = true;
        }else{
            //self.xPos = self.xPos + value;
        }
        
        
    }
    
    
    
    this.jump = function(){
        if (self.isJumping == false) {
            self.yVel = -50;//-60
            
        self.isJumping = true;
        }
     
    }

    
    
}

//a platform in the game map
var Platform = function(xPos, yPos, width, height){
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
}

//return true if player is on the given platform
var playerOnPlatform = function(player, platform){
    var tol = 30; //height tolerance (within X pixels of platform height counts as on platform)

    return(
        player.yPos + player.height >= platform.yPos - tol //player is at platform height given tolerance
        && player.yPos + player.height <= platform.yPos + tol 
        && player.xPos < platform.xPos + platform.width//player left edge <= platform right edge
        && player.xPos + player.width > platform.xPos//player right edge >= platform left edge
        );
}

//Check if player is on ANY platform in game & return that platform
var playerOnAnyPlatform = function(game){
    var platform = null;
    for(var i=0; i < game.listOfPlatforms.length; i++){
        if(playerOnPlatform(game.pizzaPlayer, game.listOfPlatforms[i])){
            platform = game.listOfPlatforms[i];
            return platform;
        };
    }
    //if not on platform, return null
    return platform;
}

//update game according to whether player landed on or fell off platform
var checkPlatformEvents = function(game){
    
    var landedPlat = playerOnAnyPlatform(game); //current platform
    var pizza = game.pizzaPlayer;
    
     //if moving down, check if landed on platform
    if(pizza.yVel >= 0 && landedPlat != null){
        pizza.yPos = landedPlat.yPos - pizza.height;
        pizza.yVel = 0;
        pizza.isJumping = false;
        pizza.isOnPlatform = true;
    }
    
        
     //if already on platform, check if moved off the platform
    if(pizza.isOnPlatform){ 
        //console.log("pizza left edge at " + pizza1.xPos + ", platform right edge at " + (testPlatform.xPos + testPlatform.width)); 
        //console.log("pizza at (" + pizza1.xPos + ", " + pizza1.yPos + "), platform at (" + testPlatform.xPos + ", " + testPlatform.yPos + ")"); 
         if(landedPlat == null){
             pizza.isOnPlatform = false;
             //apply gravity?
             pizza.isJumping = true;
           }
        }
};

//The door for completing the game. Unlocks after you collect the basic ingredients.
var Door = function(xPos, yPos, width, height){
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.isUnlocked = false;
}


//items that can increase score
var Collectable = function(type, points, required, xPos, yPos, width, height){
    var self = this;
    this.type = type;//can be the same as the image filename
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.isCollected = false;
    this.points = points;
    this.isRequired = required; //delete later maybe?
}

//return true if player and object are colliding (assumes both have xPos, yPos, width, height)
var colliding = function(player, object){
    //look for gaps btwn rectangles
    
    var isGap =
    (((player.yPos + player.height) < object.yPos) || //player above
    (player.yPos > (object.yPos + object.height)) || //player below
    ((player.xPos + player.width) < object.xPos) || //player left
    (player.xPos > (object.xPos + object.width)) //player right
    );
   /* if(isGap){
        console.log("Pizza :" + player.xPos + ", " + player.yPos);
        console.log("Object :" + object.xPos + ", " + object.yPos);
        console.log("--------");
    }*/
    return !isGap;
}

//check this item off the game's list and update score/lives/door/etc.
var collectItem = function(game, itemIndex, array){
    var item = array[itemIndex];
    //if ingredient, check if we can unlock the door now
    if(item.isRequired){
        item.isCollected = true;
        game.score += item.points;
        game.checkIngredientCompletion(); 
        console.log("collected " + item.type + " at " + item.xPos + ", " + item.yPos);
        console.log("score: " + game.score);
    }
    //if topping, and allowed to collect toppings, increase score
    else if(game.ingredientsComplete){
        item.isCollected = true;
        game.score += item.points;
        console.log("collected " + item.type + " at " + item.xPos + ", " + item.yPos);
        console.log("score: " + game.score);
    } 
    //else, you tried to collect topping when not allowed yet
    else{
        console.log("You can't collect toppings until you have the basic ingredients!");
    }
};

//return true if player is hitting anything in array besides the exception (current hit item)
var isHittingThingInArray = function(player, list, current){
  var hit = false;
   for(var i=0; i < list.length && !hit; i++){
       //if (!i == current){
        hit = hit || colliding(player, list[i]);
       //}
   }
   console.log("is it hitting anything? " + hit);
   return hit;
}

//check if player collided with any uncollected objects/enemies & react accordingly
var checkCollisions = function(game){
    
    //check ingredients
    for(var i=0; i < game.listOfIngredients.length; i++){
        if(colliding(game.pizzaPlayer, game.listOfIngredients[i]) 
        && !game.listOfIngredients[i].isCollected){
            //collect
            collectItem(game, i, game.listOfIngredients);
        }
    }
    
    //check toppings
    for(var i=0; i < game.listOfToppings.length; i++){
        if(colliding(game.pizzaPlayer, game.listOfToppings[i]) && !game.listOfToppings[i].isCollected
        && !game.pizzaPlayer.isHittingTopping){
           //collect
            collectItem(game, i, game.listOfToppings);
        }
    }
    
    //check enemies
    var hitEnemyThisRound = false;
    for(var i=0; i < game.listOfEnemies.length; i++){
        //if this is the first enemy we collided with this round, do stuff
         if(colliding(game.pizzaPlayer, game.listOfEnemies[i]) && !hitEnemyThisRound){
         hitEnemyThisRound = true; //don't check for any other collisions
            if(!game.pizzaPlayer.isHittingEnemy){//only acknowledge this collision if you're not already hitting enemy from last round
                game.pizzaPlayer.isHittingEnemy = true;
                game.lives -= 1;
                drawLives(game);
                console.log("you got eaten a bit!");
            //console.log("enemy: " + game.listOfEnemies[i].xPos + ", " + game.listOfEnemies[i].yPos);
            //console.log("you: " + game.pizzaPlayer.xPos + ", " + game.pizzaPlayer.yPos);
            //console.log("isHitting: " + game.pizzaPlayer.isHittingEnemy + "; this round: " + hitEnemyThisRound);
         }
        }
    }
    
    //if we didn't hit anything this round, reset isHittingEnemy. Now we can hit enemies again.
    if(!hitEnemyThisRound){
       // console.log("did not hit any enemies");
        game.pizzaPlayer.isHittingEnemy=false;
    }
    
    //check door
    if(colliding(game.pizzaPlayer, game.door) && !game.pizzaPlayer.isHittingDoor){
        console.log("HIT DOOR");
        game.pizzaPlayer.isHittingDoor = true;
    }else if(!colliding(game.pizzaPlayer, game.door)){
        game.pizzaPlayer.isHittingDoor = false;
    }
}


var Enemy = function(xPos, yPos, type, speed, width, height,minx,maxx){
    var self=this;
    this.type=type;
    this.xPos=xPos;
    this.speed=speed;
    this.yPos=yPos;
    this.width = width;
    this.height = height;
    this.leftEdge=this.xPos-90;
    this.rightEdge=this.xPos+90;
    this.minx=minx;
    this.maxx=maxx;
    var count=1;
    this.setPosition=function(x,y){
        self.xPos=x;
        self.yPos=y;
    };
    
    this.updateEnemy = function(){
      
        self.xPos+=count;
          if(self.xPos<minx){
              count*=-1;
              self.xPos+=speed;
              self.xPos=minx;
          }
          else if(self.xPos>maxx){
              count*=-1;
              self.xPos-=speed;
              self.xPos=maxx;
          }

    }
}

   


// var updateToppings = function(){
//     var toppings = getToppings();
//     var ingredients = getIngredients();
//     var currToppingsLen = toppings.length;
//         for (var i=0; i<toppings.length; i++){
//             //self.drawTopping(i);
//             currToppingsLength = toppings.length;
//         }
//     }
//     if (currToppingsLen != toppings.length){
//         updateToppings();
//     }





//--------------------------------------VIEW stuff (drawing)

var drawPizzaPlayer = function(pizzaPlayer){
    var xPos = pizzaPlayer.xPos + "px";
    var yPos = pizzaPlayer.yPos + "px";
    $("#pizzaPlayer").css("left", xPos);
    $("#pizzaPlayer").css("top", yPos);
    
    $("#pizzaPlayer").css({
               "-webkit-transform": "rotate(" + PIZZAROTATE_DEG + "deg)",
               "transform": "rotate(" + PIZZAROTATE_DEG + "deg)"
    });
           
           
    var drawTopping = function(){
        //apply abstract css class
    }
    //do stuff with height/width scaling
}

var drawScore = function(game){
    var points = document.getElementById('points');
    points.innerHTML = game.score.toString();
}

//draw enemy
var drawEnemy = function(Enemy){
    var $Enemy = document.createElement('div');
    $Enemy.style.left=Enemy.xPos+"px";
    $Enemy.style.top= Enemy.yPos+"px";
    $Enemy.style.width=Enemy.width+"px";
    $Enemy.style.height=Enemy.height+"px";
    $Enemy.style.backgroundColor = "red";
    $Enemy.classList.add("Enemy");
    $("#gameBoard").append($Enemy);
   
  /* for(var i=0; i < game.listOfEnemies.length; i++){
    drawEnemy(game.listOfEnemies[i]);
    }*/
}
var drawEnemies = function(game){
    $(".Enemy").remove();
    
    for(var i=0; i<game.listOfEnemies.length; i++){
        drawEnemy(game.listOfEnemies[i]);
       game.listOfEnemies[i].updateEnemy();
    }
      
   
}
//draw a single collectable item
var drawCollectable = function(item){

    if(!item.isCollected){
    
        var $item = document.createElement('div');
     
        $item.classList.add("collectable");
    
        if (item.isRequired){
            $item.classList.add("ingredient");
            $item.style.backgroundColor = "green";
        }
        else{
            $item.classList.add("topping");
            $item.style.backgroundColor = "blue";
        }
    
        if(item.isCollected){
            $item.classList.add("collected");
        }
        
        $item.style.left = item.xPos+"px";
        $item.style.top = item.yPos+"px";
        $item.style.width = item.width + "px",
        $item.style.height = item.height + "px",
    
        /*console.log("X: " + item.xPos);
        console.log("Y: " + item.yPos);
        console.log("-----");*/

        $("#gameBoard").append($item);
    }
}

//draw all collectable items (ingredients & toppings)
var drawCollectables = function(game){
    //clear all collectables from screen
    $(".collectable").remove();
    
    //redraw
    for(var i=0; i < game.listOfIngredients.length; i++){
        drawCollectable(game.listOfIngredients[i]);
    }
    
      for(var i=0; i < game.listOfToppings.length; i++){
        drawCollectable(game.listOfToppings[i]);
    }
}

// global flag for lives check
var livesFlag = true;

var drawLives = function(game) {
    var initialize = function(){
        //life 1
        var circle1 = document.createElement('ul');
        circle1.setAttribute('id','circle1');
        var slice1 = document.createElement('li');
        slice1.setAttribute('id','slice');
        var slice1contents = document.createElement('div');
        slice1contents.setAttribute('id','slice-contents');
        slice1.appendChild(slice1contents);
        circle1.appendChild(slice1);
        
        //life 2
        var circle2 = document.createElement('ul');
        circle2.setAttribute('id','circle2');
        var slice2 = document.createElement('li');
        slice2.setAttribute('id','slice');
        var slice2contents = document.createElement('div');
        slice2contents.setAttribute('id','slice-contents');
        slice2.appendChild(slice2contents);
        circle2.appendChild(slice2);
        
        //life 3
        var circle3 = document.createElement('ul');
        circle3.setAttribute('id','circle3');
        var slice3 = document.createElement('li');
        slice3.setAttribute('id','slice');
        var slice3contents = document.createElement('div');
        slice3contents.setAttribute('id','slice-contents');
        slice3.appendChild(slice3contents);
        circle3.appendChild(slice3);
        
        var lives = document.getElementById('lives');
        lives.appendChild(circle1);
        lives.appendChild(circle2);
        lives.appendChild(circle3);
    }
    if (livesFlag){
        initialize();
        livesFlag = false;
    }
    if (game.lives == 2){
        if ($('#circle3').length > 0) { //check if circle3 exists
            var lives = document.getElementById('lives');
            var circle3 = document.getElementById('circle3');
            lives.removeChild(circle3);
        }
    }
    if (game.lives == 1){
        if ($('#circle2').length > 0) { //check if circle2 exists
            var lives = document.getElementById('lives');
            var circle2 = document.getElementById('circle2');
            lives.removeChild(circle2);
        }
    }
    if (game.lives == 0){
        if ($('#circle1').length > 0) { //check if circle1 exists
            var lives = document.getElementById('lives');
            var circle1 = document.getElementById('circle1');
            lives.removeChild(circle1);
        }
    }
}

var drawDoor = function(door){
    var $door = document.createElement("div");
    $door.setAttribute('id', 'mouthDoor');
    $door.style.left = door.xPos + 'px';
    $door.style.top = door.yPos + 'px';
    $door.style.width = door.width + 'px';
    $door.style.height = door.height + 'px';
    //$door.css('left', xPos + "px");
    
    $('#gameBoard').append($door);
    
}

var drawPlatform = function(platform){
    var $item = document.createElement("div");
    $item.classList.add("platform");
    $item.style.left = platform.xPos+"px";
    $item.style.top = platform.yPos+"px";
    $item.style.width = platform.width + "px",
    $item.style.height = platform.height + "px",
    $item.style.backgroundColor = "black";
    
    $('#gameBoard').append($item);
}

var drawPlatforms = function(game){
    //clear all collectables from screen
    $(".platform").remove();
    
    //redraw
    for(var i=0; i < game.listOfPlatforms.length; i++){
        drawPlatform(game.listOfPlatforms[i]);
        //console.log("platform: " + game.listOfPlatforms[i].width + ", " + game.listOfPlatforms[i].height);
    }
}


var drawGround = function(height){
    //console.log("HERE" + $('#ground').css('height'));
    $('#ground').css('opacity', 1);
    $('#ground').css('top',  GROUNDLINE + height + 50 + 'px');
    $('#ground').css('height', height + 'px');
    //$('#ground').attr('top', GROUNDLINE + height + 'px');
    
    

}

//-------------------------------------- CONTROLLER stuff




// player key press
var movePlayer = function(pizzaPlayer){
    //console.log(pizzaPlayer);
    $("body").keydown(function(e){
        var code = e.which; //e.keyCode || 
        
        
        if(code == 37 || code == 65){//move left
           pizzaPlayer.moveLeft(PIZZASPEED);
           //$("#pizzaPlayer").prop("-webkit-transform", "rotate(-3deg)");
           //$("#pizzaPlayer").animate({transform: 'rotate(-3deg)'});
           PIZZAROTATE_DEG -= ROTATE_VAL;
    
           
           //drawPizzaPlayer(pizzaPlayer);
           /*console.log("pizza X: " + pizzaPlayer.xPos);
           console.log("pizza Y: " + pizzaPlayer.yPos);
           console.log("------");*/

           
        }else if(code == 39 || code == 68){//move right
            pizzaPlayer.moveRight(PIZZASPEED);
            //$("#pizzaPlayer").prop("transform", "rotate(3deg)");
            PIZZAROTATE_DEG += ROTATE_VAL;
                
            //drawPizzaPlayer(pizzaPlayer);
            
        }else if((code == 39 || code == 68) && (code == 38 || code == 87)){//move right and up // ATTEMPT
            pizzaPlayer.moveRight(PIZZASPEED);
            //$("#pizzaPlayer").prop("transform", "rotate(3deg)");
            PIZZAROTATE_DEG += ROTATE_VAL;
                
            pizzaPlayer.jump();
            
        }else{
            // do nothing if other keys
       
        }
        
        if(code == 38 || code == 87){//up
            pizzaPlayer.jump();
         
            //drawPizzaPlayer(pizzaPlayer);
        }
    });
     
    
};


var startGame = function(game, player){
  //testCollide();
    if(game.isRunning){
        drawDoor(testDoor);
        drawGround(20);
        if(player.xPos >= GROUNDLINE){
            $("#pizzaPlayer").css({
                  "-webkit-transition": "all 0.3s ease-out",
                    "transition": "all 0.3s ease-out"
            });
        }
        movePlayer(player);
    testUpdate();
    }  
}


//button press


$("#startButton").click(function(){
    testGame.isRunning = true;
    livesFlag = true;
    startGame(testGame, pizza1);
    
});

//----------------------------------------- game stuff

var pizza1 = new PizzaPlayer(20, 400, 50, 50);
var testDoor = new Door(500, 200, 100, 100);
var testGame = new PizzaGame(1, pizza1, testDoor);


console.log(testGame.isRunning);


//testenemy
var testEnemy = [
    
   new Enemy(200,400,"Squirrel",10,20,20,150,250),
   new Enemy(400,300,"Bird", 10, 20, 20, 300,450),
   new Enemy(400,100,"Bird", 10,20,20,450,550)
    ];

var testIngredients = [
    new Collectable("sauce", 50, true, 300, 350, 20, 20),
    new Collectable("cheese", 50, true, 500, 350, 20, 20)
];


var testToppings = [
    new Collectable("anchovies", 50, false, 100, 300, 20, 20),
    new Collectable("pepperoni", 50, false, 600, 300, 20, 20)
];


//75 is the ideal vertical distance btwn platforms
var testPlatforms = [
    new Platform(300, 350, 120, 20),
    new Platform(400, 275, 100, 20),
    new Platform(300, 200, 200, 20)
];

testGame.listOfIngredients = testIngredients;
testGame.listOfToppings = testToppings;
testGame.listOfPlatforms = testPlatforms;

testGame.listOfEnemies=testEnemy;

//test update - checks for collisions and collectable updates every 70ms
var testUpdate = function(){
    setTimeout(function(){
        drawPizzaPlayer(pizza1); //note: draw before collision checks!
        
        checkCollisions(testGame);
        drawPlatforms(testGame);
        drawCollectables(testGame);
        drawEnemies(testGame);
        drawLives(testGame);
        
        
         if (pizza1.isJumping) {
            pizza1.yVel += GRAVITY; 
            pizza1.yPos += pizza1.yVel;
            //console.log("YVEL: " + pizza1.yVel);
            //console.log("YLOC: " + pizza1.yPos);
            FRICTION = .25;
         if (pizza1.yPos > GROUNDLINE) {
             pizza1.yPos = GROUNDLINE;
             pizza1.yVel = 0;
             pizza1.isJumping = false;
             //console.log("YVEL at groundline: " + pizza1.yVel);
            }
        }else{
            FRICTION = .1;
        }
        
        if(pizza1.isMoving){//&& pizza1.isJumping
            //console.log(pizza1.xVel);
            pizza1.xVel = pizza1.xVel * FRICTION;
            pizza1.xPos += pizza1.xVel;
        }else if(!pizza1.isMoving){ //&& !pizza1.isJumping
            pizza1.xVel = 0;
        }
        if(pizza1.xVel <= 5 && pizza1.xVel >= -5){
            pizza1.isMoving = false;
            
        }
     
     //check if landed on or fell off a platform 
     checkPlatformEvents(testGame);

        testUpdate();
    }, 70);
}

//for testing the collision function
var testCollide = function(){
    var pizza1 = new PizzaPlayer(20, 400, 50, 50);
    pizza1.xPos = 50;
    pizza1.yPos = 50;
    var sauce1 = new Collectable("sauce", 50, true, 100, 350, 50, 50);
    sauce1.xPos = 50;
    sauce1.yPos = 50;
    console.log("Collision: " + colliding(pizza1, sauce1));
    
    sauce1.xPos = 0;
    console.log("Collision: " + colliding(pizza1, sauce1));
    
    sauce1.xPos = -1;
    console.log("Collision F: " + colliding(pizza1, sauce1));
    
    sauce1.xPos = 100;
    console.log("Collision: " + colliding(pizza1, sauce1));
    
    sauce1.xPos = 101;
    console.log("Collision F: " + colliding(pizza1, sauce1));
    
    sauce1.xPos = 0
    sauce1.yPos = 0;
    console.log("Collision: " + colliding(pizza1, sauce1));
    
    sauce1.xPos = -1;
    console.log("Collision F: " + colliding(pizza1, sauce1));
    
    sauce1.xPos = 100;
    console.log("Collision: " + colliding(pizza1, sauce1));
    
    sauce1.xPos = 101;
    console.log("Collision F: " + colliding(pizza1, sauce1));
    
    sauce1.yPos = 100;
    console.log("Collision FL " + colliding(pizza1, sauce1));
    
    sauce1.xPos = 100;
    console.log("Collision: " + colliding(pizza1, sauce1));
    
    sauce1.xPos = 0;
    console.log("Collision: " + colliding(pizza1, sauce1));
    
    sauce1.xPos = -1;
    console.log("Collision F: " + colliding(pizza1, sauce1));
    
}




    
    
$(document).ready(function(){
    
});

