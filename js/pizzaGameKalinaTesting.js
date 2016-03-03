

var PizzaPlayer = function(xPos, yPos, width, height){
    var self = this;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.ingredients = []; //required
    this.toppings = []; //extra
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

    this.update = function(){
    
    };
}

var drawPizzaPlayer = function(pizzaPlayer){
    var xPos = pizzaPlayer.xPos + "px";
    var yPos = pizzaPlayer.yPos + "px";
    $("#pizzaPlayer").css("left", xPos);
    $("#pizzaPlayer").css("top", yPos);
    //do stuff with height/width scaling
}

// player key press
var movePlayer = function(pizzaPlayer){
    console.log(pizzaPlayer);
    $("body").keydown(function(e){
        var code = e.which; //e.keyCode || 
        
        
        if(code == 37 || code == 65){//left
           pizzaPlayer.moveLeft(5);
           drawPizzaPlayer(pizzaPlayer);
           console.log("leftt");
           
        }else if(code == 39 || code == 68){//right
            pizzaPlayer.moveRight(5);
            drawPizzaPlayer(pizzaPlayer);
            console.log("riggghht");
            
        }else if(code == 38){//up
        console.log("NO");
            
        }else{
            // do nothing if other keys
            console.log("NO");
        }
        console.log(code);
    });
    
};

//----------------------------------------- game stuff

var pizza1 = new PizzaPlayer(20, 400, 50, 50);
$(document).ready(function(){
    console.log("OY");
    drawPizzaPlayer(pizza1);
    movePlayer(pizza1);
    
});