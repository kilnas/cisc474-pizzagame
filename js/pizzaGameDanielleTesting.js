



//------GLOBAL VARIABLES

var PIZZAROTATE_DEG = 0;
var ROTATE_VAL = 25;
var PIZZASPEED = 15;
var GROUNDLINE = 400;
var GRAVITY = 9.8;

//-------------- MODEL


var PizzaGame = function(level, pizzaPlayer, door){ // game object
    var self = this;
    this.lives = 3;
    this.level = level;
    this.score = 0;
    this.listOfEnemies = {};
    this.listOfIngredients = {};
    this.listOfToppings = {};
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
        console.log("checkin " + self.listOfIngredients);
        var complete = true;
        for(var i=0; i < self.listOfIngredients.length, complete; i++){
            complete = complete && self.listOfIngredients[i].isCollected;
        }
        
        //If collected all ingredients, now can collect toppings, exit level, etc.
        if(complete){
            self.ingredientsComplete = true;
            self.door.isUnlocked = true;
            console.log("You collected all the ingredients! Now you can get toppings and be eaten.");
            alet("You collected all the ingredients! Now you can get toppings and be eaten.");
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
    this.isJumping = false;
    this.toppings = [];
    this.currToppingsLength = 0; //counter to check for change

    this.moveLeft = function(value){
        self.xPos = self.xPos - value;
        
    }
    
    this.moveRight = function(value){
        self.xPos = self.xPos + value;
        
    }
    
    this.jump = function(){
        if (self.isJumping == false) {
            self.yVel = -60;
        self.isJumping = true;
    }
        //self.yPos = self.yPos - 100;// FIGURE OUT PHYSICS
     
    }
    
    this.updatePosition = function(){ //????????????
        
    }
    
    //this.initialize();
    
     /*while(self.yPos <= GROUNDLINE){
        self.yPos = self.yPos + 10;
        console.log(self.yPos);}
    drawPizzaPlayer(self); */
    
    
}




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
    console.log("collecting item: " + item.type());
    //if ingredient, check if we can unlock the door now
    if(item.isRequired){
        item.isCollected = true;
        game.score += item.points;
        game.checkIngredientCompletion(); 
        console.log("score: " + game.score);
    }
    //if topping, and allowed to collect toppings, increase score
    else if(game.ingredientsComplete){
        item.isCollected = true;
        game.score += item.points;
        console.log("score: " + game.score);
    } 
    //else, you tried to collect topping when not allowed yet
    else{
        console.log("You can't collect toppings until you have the basic ingredients!");
    }
};


//check if player collided with any uncollected objects/enemies & react accordingly
var checkCollisions = function(game){
    
    //check ingredients
    for(var i=0; i < game.listOfIngredients.length; i++){
        if(colliding(game.pizzaPlayer, game.listOfIngredients[i]) && !game.listOfIngredients[i].isCollected){
            //collect
            collectItem(game, i, game.listOfIngredients);
        }
    }
    
    //check toppings
    for(var i=0; i < game.listOfToppings.length; i++){
        if(colliding(game.pizzaPlayer, game.listOfToppings[i]) && !game.listOfToppings[i].isCollected){
           //collect
            collectItem(game, i, game.listOfToppings);
        }    
    }
    
    //check enemies
    for(var i=0; i < game.listOfEnemies.length; i++){
        if(colliding(game.pizzaPlayer, game.listOfEnemies[i])){
          //make lives go down or w/e depending on enemy
         PizzaGame.lives -= 1;
        }    
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
    this.minx=minx;
    this.maxx=maxx;
    this.initialize=function(){
        
    };
    this.setPosition=function(x,y){
        self.xPos=x;
        self.yPos=y;
    };
    this.update=function(){
        
    }
  // this.updatePos=function(time){
       //var distance= speed*time;
      // if(xPos<self.minx){
      //     self.xPos=self.xPos+distance;
      // }
      // else if(xPos>self.maxx){
      //     self.xPos=self.xPos-distance;
      // }
      function updateEnemy(){
          if (xPos<self.minx){
              self.xPos+=1;
              self.update();
          }
          else if(xPos>self.maxx){
              self.xPos-=1;
              self.update();
          }
      } 
    this.initialize();
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
           
           
    var drawTopping = function(t){
        //apply abstract css class
    }
    //do stuff with height/width scaling
}
//draw enemy
var drawEnemy = function(Enemy){
    var $Enemy = document.createElement('div');
    $Enemy.style.left=Enemy.xPos+"px";
    $Enemy.style.top= Enemy.yPos+"px";
    $Enemy.style.width=Enemy.width+"px";
    $Enemy.style.height=Enemy.height+"px";Enemy
    $Enemy.style.backgroundColor = "red";
    $("#gameBoard").append($Enemy);
  /* for(var i=0; i < game.listOfEnemies.length; i++){
    drawEnemy(game.listOfEnemies[i]);
    }*/
}
var drawEnemies = function(game){
    $(".Enemy").remove();
    for(var i=0; i<game.listOfEnemies.length; i++){
        drawEnemy(game.listOfEnemies[i]);
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

var drawLives = function() {
    var initialize = function(){
        //life 1
        var circle1 = document.createElement('ul');
        circle1.setAttribute('id','circle1');
        var slice1 = document.createElement('li');
        slice1.setAttribute('id','slice');
        var slice1contents = document.createElement('div');
        slice1contents.setAttribute('id','slice1-contents');
        slice1.appendChild(slice1contents);
        circle1.appendChild(slice1);
        
        //life 2
        var circle2 = document.createElement('ul');
        circle2.setAttribute('id','circle2');
        var slice2 = document.createElement('li');
        slice2.setAttribute('id','slice');
        var slice2contents = document.createElement('div');
        slice2contents.setAttribute('id','slice2-contents');
        slice2.appendChild(slice2contents);
        circle2.appendChild(slice2);
        
        //life 3
        var circle3 = document.createElement('ul');
        circle3.setAttribute('id','circle3');
        var slice3 = document.createElement('li');
        slice3.setAttribute('id','slice');
        var slice3contents = document.createElement('div');
        slice3contents.setAttribute('id','slice3-contents');
        slice3.appendChild(slice3contents);
        circle3.appendChild(slice3);
        
        var lives = document.getElementById('lives');
        lives.appendChild(circle1);
        lives.appendChild(circle2);
        lives.appendChild(circle3);
    }
}

var drawDoor = function(door){
    var $door = document.createElement("div");
    $door.setAttribute('id', '#mouthDoor');
    $door.style.left('left', door.xPos + 'px');
    //$door.css('left', xPos + "px");
    
    $('#gameBoard').append($door);
    
}

//-------------------------------------- CONTROLLER stuff




// player key press
var movePlayer = function(pizzaPlayer){
    console.log(pizzaPlayer);
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
        
            
        }else if(code == 38 || code == 87){//up
            pizzaPlayer.jump();
         
            //drawPizzaPlayer(pizzaPlayer);
            console.log(pizzaPlayer);
            
        }else{
            // do nothing if other keys
       
        }
   
    });
     
    
};


var startGame = function(game, player){
  //testCollide();
    if(game.isRunning){
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
    startGame(testGame, pizza1);
    
});

//----------------------------------------- game stuff

var pizza1 = new PizzaPlayer(20, 400, 50, 50);
var testDoor = new Door(100, 100, 300, 200);
var testGame = new PizzaGame(1, pizza1, testDoor);
console.log(testGame.isRunning);


//testenemy
var testEnemy = [
    new Enemy(50, 100, "Squirrel", 1, 20, 20, 0,10),
    new Enemy(90, 100, "Bird", 2, 20, 20, 0, 10)
    ];

var testIngredients = [
    new Collectable("sauce", 50, true, 300, 350, 20, 20),
    new Collectable("cheese", 50, true, 500, 350, 20, 20)
];


var testToppings = [
    new Collectable("anchovies", 50, false, 100, 300, 20, 20),
    new Collectable("pepperoni", 50, false, 600, 300, 20, 20)
];

testGame.listOfIngredients = testIngredients;
//testGame.listOfToppings = testToppings;



//test update - checks for collisions and collectable updates every 200ms
var testUpdate = function(){
    setTimeout(function(){
        checkCollisions(testGame);
        drawCollectables(testGame);
        
        drawPizzaPlayer(pizza1);
        drawDoor(800, 500);
        
         if (pizza1.isJumping) {
            pizza1.yVel += GRAVITY;
            pizza1.yPos += pizza1.yVel;
         if (pizza1.yPos > GROUNDLINE) {
             pizza1.yPos = GROUNDLINE;
             pizza1.yVel = 0;
             pizza1.isJumping = false;
            }
     }

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

