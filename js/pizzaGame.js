

var PizzaPlayer = function(xPos, yPos, width, height){
    var self = this;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.toppings = [];
    this.currToppingsLength = 0; //counter to check for change

    this.moveLeft = function(value){
        self.xPos = self.xPos - value;
        
    }
    
    this.moveRight = function(value){
        self.xPos = self.xPos + value;
        
    }
    
    this.jump = function(){
        self.yPos = self.yPos + 100;// FIGURE OUT PHYSICS
        
    }
    
    this.updatePosition = function(){ //????????????
        
    }
    
    //this.initialize();
    
    
}


var PizzaGame = function(level, pizzaPlayer, door){
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
    //this.ingredientsComplete = false;
    var getIngredients = function(){
        return self.listOfIngredients;
    }
    var getToppings = function(){
        return self.listOfToppings;
    }

    this.update = function(){
    
    };
    
    var checkIngredientCompletion = function(){
        
    }
}

var drawPizzaPlayer = function(pizzaPlayer){
    var xPos = pizzaPlayer.xPos + "px";
    var yPos = pizzaPlayer.yPos + "px";
    $("#pizzaPlayer").css("left", xPos);
    $("#pizzaPlayer").css("top", yPos);
    var drawTopping = function(t){
        //apply abstract css class
    }
    //do stuff with height/width scaling
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

//return true if player and object are colliding
var colliding = function(player, object){
    return
    //look for gaps btwn rectangles
    !(((player.yPos + player.height) < (object.yPos)) || //player above
    (player.yPos > (object.yPos + object.height)) || //player below
    ((player.xPos + player.width) < object.xPos) || //player left
    (player.xPos > (object.xPos + object.width))); //player right
}

//check this item off the game's list and update score/lives/door/etc.
var collectItem = function(game, itemIndex, array){
    var item = array[itemIndex];
    item.isCollected = true;
    
    //if ingredient, check if we can unlock the door now
    if(item.isRequired){
        game.checkIngredientCompletion();   
    }
    //if topping, increase score
    else{
        game.score += item.points;
    }
};


//check if player collided with any objects/enemies & react accordingly
var checkCollisions = function(game){
    
    //check ingredients
    for(var i=0; i < game.listOfIngredients.length; i++){
        if(colliding(game.pizzaPlayer, game.listOfIngredients[i]) && !game.listOfIngredients[i].isCollected){
            collectItem(game.pizzaPlayer, i, game.listOfIngredients);
        }
    };
    
    //check toppings
    for(var i=0; i < game.listOfToppings.length; i++){
        if(colliding(game.pizzaPlayer, game.listOfToppings[i]) && !game.listOfToppings[i].isCollected){
            collectItem(game.pizzaPlayer, i, game.listOfToppings);
        }    
    }
    
    //check enemies
    for(var i=0; i < game.listOfEnemies.length; i++){
        if(colliding(game.pizzaPlayer, game.listOfEnemies[i])){
          //make lives go down or w/e depending on enemy
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




//-------------------------------------- CONTROLLER stuff

var pizzaRotateDeg = 0;
var rotateVal = 18;
// player key press
var movePlayer = function(pizzaPlayer){
    console.log(pizzaPlayer);
    $("body").keydown(function(e){
        var code = e.which; //e.keyCode || 
        
        
        if(code == 37 || code == 65){//move left
           pizzaPlayer.moveLeft(5);
           //$("#pizzaPlayer").prop("-webkit-transform", "rotate(-3deg)");
           //$("#pizzaPlayer").animate({transform: 'rotate(-3deg)'});
           pizzaRotateDeg -= rotateVal;
           $("#pizzaPlayer").css({
               "-webkit-transform": "rotate(" + pizzaRotateDeg+ "deg)",
               "transform": "rotate(" + pizzaRotateDeg+ "deg)"
           });
           
           
           drawPizzaPlayer(pizzaPlayer);

           
        }else if(code == 39 || code == 68){//move right
            pizzaPlayer.moveRight(5);
            //$("#pizzaPlayer").prop("transform", "rotate(3deg)");
            pizzaRotateDeg += rotateVal;
                $("#pizzaPlayer").css({
               "-webkit-transform": "rotate(" + pizzaRotateDeg + "deg)",
               "transform": "rotate(" + pizzaRotateDeg + "deg)"
           });
            drawPizzaPlayer(pizzaPlayer);
        
            
        }else if(code == 38){//up
     
            
        }else{
            // do nothing if other keys
       
        }
   
    });
     
    
};

//----------------------------------------- game stuff

var pizza1 = new PizzaPlayer(20, 400, 50, 50);
$(document).ready(function(){
    console.log("OY");
    drawPizzaPlayer(pizza1);
    movePlayer(pizza1);
    
});

