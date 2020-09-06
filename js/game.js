class Point{
	constructor(x, y) {
		this.x = x;
		this.y = y
	}
}

class GameObj{
	constructor(name, pos, size, sprite) {
		this.name = name;
		this.size = size;
		this.pos = pos;
		this.sprite = sprite;

		this.color = "#cccccc"
	}

	draw(){
		if(this.sprite != null){
			//draw sprite
		}
		else{
			ctx.fillStyle = this.color;
			ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		}

	}

	drawCollisionBorder(){
		ctx.strokeStyle = "#FF0000";
		ctx.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
	}

	collision(gameObj2){
		if(this.pos.x + this.size.x > gameObj2.pos.x &&
			this.pos.y + this.size.y > gameObj2.pos.y &&
			this.pos.x < gameObj2.pos.x + gameObj2.size.x &&
			this.pos.y < gameObj2.pos.y + gameObj2.size.y)
		{
			this.onCollision(gameObj2);
			return true;
		}
		return false;
	}

	onCollision(gameObj2){
		console.log(this.name + " collised whith " + gameObj2.name);
	}


}


class Star extends GameObj{
	constructor(pos, size){
		super("star", pos, size, null);
		this.color = "#00aaff";
	}

	onCollision(gameObj2){
		super.onCollision(gameObj2);
		if(gameObj2.name = "erraser"){
			var index = stars.indexOf(this);
			stars.splice(index, 1);
		}
	}
}

class Block extends GameObj{
	constructor(name, pos, size){
		super("block", pos, size, null);
		this.color = "#44aa00";
	}

	onCollision(gameObj2){
		super.onCollision(gameObj2);
		if(gameObj2.name = "erraser"){
			
			var index = blocks.indexOf(this);
			blocks.splice(index, 1);
			//blocks.pop();
			blocks.unshift(new Block(index, new Point(this.pos.x, -this.size.y), this.size));

			if(Math.random() < cones_max){
				var s = Math.random() * 3;
				var c = 0
				if(s < 1)
					c = 1;
				if(s >= 1 && s < 2)
					c = 2;
				if(s >= 2 && s < 3)
					c = 3;

				var side = this.pos.x + this.size.x;
				if(Math.random() > 0.5)
					side = gameWidth - this.size.x * 2;

				for (var i = 0; i < c; i++) {
					cones.unshift(new Cone(new Point(side, -this.size.y + (i * this.size.x)), new Point(this.size.x, this.size.x)))
				}
			}

			if(Math.random() < stars_max){
				stars.unshift(new Star(new Point(gameWidth/2 - this.size.x/2, -this.size.y + this.size.x), new Point(this.size.x, this.size.x)))
			}
		}
	}
}

class Cone extends GameObj{
	constructor(pos, size){
		super("cone", pos, size, null);
		this.color = "#ff0044";
	}

	onCollision(gameObj2){
		super.onCollision(gameObj2);
		if(gameObj2.name = "erraser"){
			var index = cones.indexOf(this);
			cones.splice(index, 1);
		}
	}
}

class Player extends GameObj{
	constructor(pos, size){
		super("player", pos, size, null);
		this.color = "#ff00ff";

		this.alive = true;
		this.isGrounded = true;
		this.side = false;
		this.jumpSpeed = scroll_speed * 2;
	}

	onCollision(gameObj2){
		super.onCollision(gameObj2);

		if(gameObj2.name == "cone"){
			this.alive = false;
			//alert(":/" + this.side);
		}

		if(gameObj2.name == "block"){
			this.isGrounded = true;

			if(this.side){
				this.pos.x = gameWidth - block_size.x * 2;
			}else{
				this.pos.x = block_size.x;
			}

		}

		if(gameObj2.name == "star"){
			score += 1;
			var index = stars.indexOf(gameObj2);
			stars.splice(index, 1);
		}
	}

	startJump(){
		if(this.isGrounded){
			this.isGrounded = false;
			this.side = !this.side;
		}
	}

	jump(){
		if(!this.isGrounded){
			if(this.side)
				this.pos.x += this.jumpSpeed;
			else
				this.pos.x -= this.jumpSpeed;
		}
	}
}

class Erraser extends GameObj{
	constructor(block_h){
		super("erraser", new Point(0, gameHeight + block_h), new Point(gameWidth, 10), null);
		this.color = "#ff0000";
	}
}

function drawRestartUI(time, score){
	offset = 0.2;
	size = 0.6;
	bcolor = "#00000088";
	ctx.fillStyle = bcolor;
	ctx.fillRect(offset * gameWidth, offset * gameHeight + 100, gameWidth * size, 200);

	ctx.font = "30px Comic Sans MS";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("GAME OVER", gameWidth/2 - 100, gameHeight/2);
	ctx.fillText("time: " + time, gameWidth/2 - 100, gameHeight/2 + 30);
	ctx.fillText("score: " + score, gameWidth/2 - 100, gameHeight/2 + 60);
}

var fps = 1000/30;
var cellSize = 64;

var gameWidth = 0;
var gameHeight = 0;

var skyColor = "#c0ffee";

var canv = null;
var ctx = null;



var scroll_speed = 4;

var score = 0;
var time = 0;

var player = null;

var block_size = new Point(100, 300);
var blocks_count = 0;
var blocks = [];

var stars = [];
var stars_max = 0.6; //%

var cones = []
var cones_max = 0.4; //%

var erraser;

function onStart(){
	console.log("start");

	clearCanvas()
	stars = [];
	cones = [];

	blocks_count = (gameHeight - (gameHeight % block_size.y));
	blocks = [blocks_count * 2];

	for (var i = 0 ; i < blocks_count; i++) {
		blocks[i] = new Block(i, new Point(0, (block_size.y + 1) * i), block_size);
		blocks[i + blocks_count] = new Block(i, new Point(gameWidth - block_size.x, (block_size.y + 1) * i), block_size);
	}

	player = new Player(new Point(block_size.x, gameHeight/2), new Point(block_size.x, block_size.x));

	erraser = new Erraser(block_size.y);

}

function clearCanvas(){
	ctx.fillStyle = skyColor;
	ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function onUpdate(){
	console.log("update");

	if(player.alive){
		time += 1;

		//scroll
		for (var i = 0; i < blocks.length; i++) {
			blocks[i].pos.y += scroll_speed;
			player.collision(blocks[i]);
			blocks[i].collision(erraser);
		}

		for (var i = 0; i < cones.length; i++) {
			cones[i].pos.y += scroll_speed;
			player.collision(cones[i]);
			cones[i].collision(erraser);
		}

		for (var i = 0; i < stars.length; i++) {
			stars[i].pos.y += scroll_speed;
			player.collision(stars[i]);
			stars[i].collision(erraser);
		}

		console.log(stars)

		player.jump();

		//draw
		clearCanvas();
		
		erraser.draw

		for (var i = 0; i < blocks.length; i++) {
			blocks[i].draw();
			//console.log(blocks);
		}

		for (var i = 0; i < cones.length; i++) {
			cones[i].draw();
		}

		for (var i = 0; i < stars.length; i++) {
			stars[i].draw();
		}


		player.draw();
	}
	else{
		console.log(time);
		console.log(score);
		stop_game();
		drawRestartUI(time, score);
	}

};

function onClick(event){
	console.log("click");
	console.log(event.currentTarget);
    console.log("x " + event.clientX + ":y " + event.clientY);

    m = new GameObj("click event", new Point(event.clientX, event.clientY), new Point(1, 1));
    m.color = "#00000000"

    if(player.isGrounded){
    	player.startJump();
    }
    if(!player.alive){
    	start_game();
    }
    //bb.collision(m);
}
var loop = null;

function start_game() {
	onStart();
	//game loop
	loop = setInterval(function() {
		onUpdate();
	}, fps);
};

function stop_game(){
	clearInterval(loop);
}

window.onload = function() {
    w = window.innerWidth;
    h = window.innerHeight;

    canv = document.getElementById("game_canv")
    ctx = canv.getContext("2d");

    canv.onclick = onClick;

    ctx.canvas.width  = w;
    ctx.canvas.height = h;

    /*if(h % cellSize != 0){
    	offsetY = (h % cellSize)/2;
    	gameHeight = h - (h % cellSize);
    }else{
    	gameHeight = h;
    }*/

    gameWidth = w;
    gameHeight = h;

    console.log(gameWidth + " " + gameHeight);

    ctx.fillStyle = skyColor;
	ctx.fillRect(0, 0, gameWidth, gameHeight);

    start_game();

};