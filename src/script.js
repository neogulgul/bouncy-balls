function getElement(element) {
	return document.querySelector(element)
}

const canvas = getElement("canvas")
const context = canvas.getContext("2d")

canvas.width = 1920
canvas.height = 1080

const BLOCKLENGTH = 1920 / 16

// todo: todos
// todo: clean up

/* ideas:
singleplayer - avoid your own balls
highscore
multiplayer - duel
ammo + ammo crates
ability to choose gamemode
*/

// maps (p => player, o => obstacle)
const map1 = [
	["o", "o", "o", "o", "o", " ", " ", " ", " ", " ", " ", " ", " ", " ", "o", "o"],
	["o", " ", " ", " ", "o", " ", " ", " ", " ", " ", " ", " ", " ", " ", "o", "o"],
	["o", " ", "p", " ", " ", " ", " ", "o", "o", " ", "o", "o", " ", " ", " ", " "],
	["o", " ", " ", " ", "o", " ", " ", "o", " ", " ", " ", "o", " ", " ", " ", " "],
	["o", "o", " ", "o", "o", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", "o", " ", " ", " ", "o", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", "o", "o", " ", "o", "o", " ", "o", "o", " "],
	[" ", "o", "o", "o", " ", " ", " ", " ", " ", " ", " ", " ", " ", "o", "o", " "],
	[" ", "o", "o", "o", " ", " ", " ", " ", "o", "o", "o", " ", " ", "o", "o", " "],
]

const game = {
	points: 0,
	wave: 1,
	balls: 0,
	time: 0,
	nextWave: 10,
	playing: false,
	objects: [],
	getTexture: (src) => {
		image = new Image
		image.src = `./textures/${src}`
		return image
	},

	ballgorithm: () => {
		return 5 * game.wave
	},

	init: () => {},

	start: () => {
		game.mapLoad(map1)
	},

	mapLoad: (map) => {
		for (let i = 0; i < map.length; i++) {
			let row = map[i]
			for (let j = 0; j < row.length; j++) {
				let square = row[j]
				if (square === "p") {
					player = new Player(j * BLOCKLENGTH + BLOCKLENGTH / 4, i * BLOCKLENGTH + BLOCKLENGTH / 4)
					game.objects.push(player)
				}
				else if (square === "o") {
					obstacle = new Obstacle(j * BLOCKLENGTH, i * BLOCKLENGTH, BLOCKLENGTH, BLOCKLENGTH)
					game.objects.push(obstacle)
				}
			}
		}
	},

	collision: (object) => {
		// canvas collision
		if (object.type === "player") {
			// top
			if (object.position.y + object.velocity.y < 0) {
				object.position.y = 0
				object.velocity.y = 0
			}
			// bottom
			else if (object.position.y + object.velocity.y > canvas.height - object.height) {
				object.position.y = canvas.height - object.height
				object.velocity.y = 0
			}
			// left
			if (object.position.x + object.velocity.x < 0) {
				object.position.x = 0
				object.velocity.x = 0
			}
			// right
			else if (object.position.x + object.velocity.x > canvas.width - object.width) {
				object.position.x = canvas.width - object.width
				object.velocity.x = 0
			}
		}

		else if (object.type === "ball") { // todo: do better
			// top
			if (object.position.y + object.velocity.y < 0) {
				object.collision.bottom = true
			}
			// bottom
			else if (object.position.y + object.velocity.y > canvas.height) {
				object.collision.top = true
			}
			// left
			if (object.position.x + object.velocity.x < 0) {
				object.collision.right = true
			}
			// right
			else if (object.position.x + object.velocity.x > canvas.width) {
				object.collision.left = true
			}
		}

		// obstacle collision
		game.objects.forEach((obstacle) => {
			if (obstacle.type === "obstacle") {
				// top
				if (object.position.x > obstacle.position.x - object.width &&
					object.position.x < obstacle.position.x + obstacle.width &&
					object.position.y + object.velocity.y < obstacle.position.y &&
					object.position.y + object.velocity.y > obstacle.position.y - object.height) {
					if (object.type === "player") {
						object.position.y = obstacle.position.y - object.height
						object.velocity.y = 0
					} else if (object.type === "ball") {
						object.collision.top = true
					}
				}
				// bottom
				else if (object.position.x > obstacle.position.x - object.width &&
					object.position.x < obstacle.position.x + obstacle.width &&
					object.position.y + object.velocity.y > obstacle.position.y + obstacle.height - object.height &&
					object.position.y + object.velocity.y < obstacle.position.y + obstacle.height) {
					if (object.type === "player") {
						object.position.y = obstacle.position.y + obstacle.height
						object.velocity.y = 0
					} else if (object.type === "ball") {
						object.collision.bottom = true
					}
				}
				// left
				if (object.position.y > obstacle.position.y - object.height &&
					object.position.y < obstacle.position.y + obstacle.height &&
					object.position.x + object.velocity.x < obstacle.position.x &&
					object.position.x + object.velocity.x > obstacle.position.x - object.width) {
					if (object.type === "player") {
						object.position.x = obstacle.position.x - object.width
						object.velocity.x = 0
					} else if (object.type === "ball") {
						object.collision.left = true
					}
				}
				// right
				else if (object.position.y > obstacle.position.y - object.height &&
					object.position.y < obstacle.position.y + obstacle.height &&
					object.position.x + object.velocity.x > obstacle.position.x + obstacle.width - object.width &&
					object.position.x + object.velocity.x < obstacle.position.x + obstacle.width) {
					if (object.type === "player") {
						object.position.x = obstacle.position.x + obstacle.width
						object.velocity.x = 0
					} else if (object.type === "ball") {
						object.collision.right = true
					}
				}
			}

			else if (object.type === "ball") {
				if (object.position.x > player.position.x - object.width &&
					object.position.x < player.position.x + player.width &&
					object.position.y > player.position.y - object.height &&
					object.position.y < player.position.y + player.height) {
					player.alive = false
				}
			}
		})
	},

	render: () => {
		context.clearRect(0, 0, canvas.width, canvas.height) // clear canvas

		game.objects.forEach((object) => {
			if (["player", "ball"].includes(object.type)) {
				object.update()
			}
			object.draw()
		})
	},

	updateGameInfo: () => {
		let paused = ""
		if (!game.playing) {
			paused = " (paused)"
		}
		getElement("#next-wave").style.display = "none"
		if (game.nextWave < 10) {
			getElement("#next-wave").style.display = "flex"
			getElement("#next-wave span").innerText = Math.floor(game.nextWave)
		}
		getElement("#game div:nth-child(1) span").innerText = game.points
		getElement("#game div:nth-child(2) span").innerText = game.wave
		getElement("#game div:nth-child(3) span").innerText = game.balls + "/" + game.ballgorithm()
		getElement("#game div:nth-child(4) span").innerText = Math.floor(game.time) + paused
	}
}

class Player {
	constructor(x, y) {
		this.width = BLOCKLENGTH / 2
		this.height = BLOCKLENGTH / 2
		this.position = {
			x: x,
			y: y
		}
		this.velocity = {
			x: 0,
			y: 0
		}
		this.acceleration = 0.75
		this.deceleration = 0.25
		this.maxVelocity = 6
		this.ballVelocity = 10
		this.alive = true
		this.type = "player"
		this.move = {
			up: false,
			down: false,
			left: false,
			right: false
		}
		this.shoot = {
			up: false,
			down: false,
			left: false,
			right: false
		}
		this.shootTimer = 0
	}

	shootBall() {
		let x = this.position.x + this.width / 2
		let y = this.position.y + this.height / 2
		let velocityX = 0
		let velocityY = 0

		if (this.shoot.up) {
			y -= this.height
			velocityY = -this.ballVelocity
		}
		if (this.shoot.down) {
			y += this.height
			velocityY = this.ballVelocity
		}
		if (this.shoot.left) {
			x -= this.width
			velocityX = -this.ballVelocity
		}
		if (this.shoot.right) {
			x += this.width
			velocityX = this.ballVelocity
		}

		let ball = new Ball(x, y, velocityX, velocityY)
		game.objects.push(ball)
	}

	update() {
		// acceleration / deceleration
		// up
		if (this.move.up) {
			this.velocity.y -= this.acceleration
		} else if (this.velocity.y < 0) {
			this.velocity.y += this.deceleration
		}
		// down
		if (this.move.down) {
			this.velocity.y += this.acceleration
		} else if (this.velocity.y > 0) {
			this.velocity.y -= this.deceleration
		}
		// left
		if (this.move.left) {
			this.velocity.x -= this.acceleration
		} else if (this.velocity.x < 0) {
			this.velocity.x += this.deceleration
		}
		// right
		if (this.move.right) {
			this.velocity.x += this.acceleration
		} else if (this.velocity.x > 0) {
			this.velocity.x -= this.deceleration
		}
		// up && down
		if (this.move.up && this.move.down) {
			if (this.velocity.y < 0) {
				this.velocity.y += this.deceleration
			} else if (this.velocity.y > 0) {
				this.velocity.y -= this.deceleration
			}
		}
		// left && right
		if (this.move.left && this.move.right) {
			if (this.velocity.x < 0) {
				this.velocity.x += this.deceleration
			} else if (this.velocity.x > 0) {
				this.velocity.x -= this.deceleration
			}
		}

		// limiting maxVelocity
		// up
		if (this.velocity.y < -this.maxVelocity) {
			this.velocity.y = -this.maxVelocity
		}
		// down
		if (this.velocity.y > this.maxVelocity) {
			this.velocity.y = this.maxVelocity
		}
		// left
		if (this.velocity.x < -this.maxVelocity) {
			this.velocity.x = -this.maxVelocity
		}
		// right
		if (this.velocity.x > this.maxVelocity) {
			this.velocity.x = this.maxVelocity
		}

		// detect shot
		if (this.shootTimer === 0 && (this.shoot.up || this.shoot.down || this.shoot.left || this.shoot.right) && game.nextWave === 10) {
			if (game.balls === 0) {
				game.playing = true
			}
			this.shootBall()
			this.shootTimer++
			game.balls++
			if (game.balls === game.ballgorithm()) {
				game.nextWave -= 1 / FPS
			}
		} else if (this.shootTimer > 0) {
			this.shootTimer++
			if (this.shootTimer === 30) {
				this.shootTimer = 0
			}
		}

		if (game.nextWave < 10) {
			game.nextWave -= 1 / FPS
		}

		if (game.nextWave <= 0) {
			game.balls = 0
			game.wave++
			game.nextWave = 10
			game.points += 100 * game.wave
			for (let i = 0; i < game.objects.length; i++) {
				if (game.objects[i].type === "ball") {
					game.objects.splice(i)
				}
			}
			game.playing = false
		}

		game.collision(this)

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}

	draw() {
		context.drawImage(game.getTexture("player.png"), this.position.x, this.position.y, this.width, this.height)
	}
}

class Obstacle {
	constructor(x, y, width, height) {
		this.position = {
			x: x,
			y: y
		}
		this.width = width
		this.height = height
		this.type = "obstacle"
	}

	draw() {
		context.drawImage(game.getTexture("obstacle.png"), this.position.x, this.position.y, this.width, this.height)
	}
}

class Ball {
	constructor(x, y, velocityX, velocityY) {
		this.width = BLOCKLENGTH / 4
		this.height = BLOCKLENGTH / 4
		this.position = {
			x: x - this.width / 2,
			y: y - this.height / 2
		}
		this.velocity = {
			x: velocityX,
			y: velocityY
		}
		this.collision = {
			top: false,
			bottom: false,
			left: false,
			right: false
		}
		this.ballVelocity = 10
		this.type = "ball"
	}

	update() {
		game.collision(this)

		if (this.collision.top) { // todo: write better code
			if (Math.random() > 0.5) {
				this.velocity.y = -this.ballVelocity
			} else {
				this.velocity.y = -this.ballVelocity * 0.5
			}
			if (Math.random() > 0.5) {
				this.velocity.x = this.ballVelocity
			} else {
				this.velocity.x = -this.ballVelocity
			}
			this.collision.top = false
		} else if (this.collision.bottom) {
			if (Math.random() > 0.5) {
				this.velocity.y = this.ballVelocity
			} else {
				this.velocity.y = this.ballVelocity * 0.5
			}
			if (Math.random() > 0.5) {
				this.velocity.x = this.ballVelocity
			} else {
				this.velocity.x = -this.ballVelocity
			}
			this.collision.bottom = false
		} else if (this.collision.left) {
			if (Math.random() > 0.5) {
				this.velocity.x = -this.ballVelocity
			} else {
				this.velocity.x = -this.ballVelocity * 0.5
			}
			if (Math.random() > 0.5) {
				this.velocity.y = this.ballVelocity
			} else {
				this.velocity.y = -this.ballVelocity
			}
			this.collision.left = false
		} else if (this.collision.right) {
			if (Math.random() > 0.5) {
				this.velocity.x = this.ballVelocity
			} else {
				this.velocity.x = this.ballVelocity * 0.5
			}
			if (Math.random() > 0.5) {
				this.velocity.y = this.ballVelocity
			} else {
				this.velocity.y = -this.ballVelocity
			}
			this.collision.right = false
		}

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}

	draw() {
		context.drawImage(game.getTexture("ball.png"), this.position.x, this.position.y, this.width, this.height)
	}
}

/* ==================================================
	keypresses
================================================== */

const keys = {
	move: {
		up: "w",
		down: "s",
		left: "a",
		right: "d"
	},
	shoot: {
		up: "i",
		down: "k",
		left: "j",
		right: "l"
	},
}

document.onkeydown = (event) => {
	// move
	if (keys.move.up.includes(event.key)) {
		player.move.up = true
		getElement("#move .up").classList.add("active")
	}
	if (keys.move.down.includes(event.key)) {
		player.move.down = true
		getElement("#move .down").classList.add("active")
	}
	if (keys.move.left.includes(event.key)) {
		player.move.left = true
		getElement("#move .left").classList.add("active")
	}
	if (keys.move.right.includes(event.key)) {
		player.move.right = true
		getElement("#move .right").classList.add("active")
	}

	// shoot
	if (keys.shoot.up.includes(event.key)) {
		player.shoot.up = true
		getElement("#shoot .up").classList.add("active")
	}
	if (keys.shoot.down.includes(event.key)) {
		player.shoot.down = true
		getElement("#shoot .down").classList.add("active")
	}
	if (keys.shoot.left.includes(event.key)) {
		player.shoot.left = true
		getElement("#shoot .left").classList.add("active")
	}
	if (keys.shoot.right.includes(event.key)) {
		player.shoot.right = true
		getElement("#shoot .right").classList.add("active")
	}
}

document.onkeyup = (event) => {
	// move
	if (keys.move.up.includes(event.key)) {
		player.move.up = false
		getElement("#move .up").classList.remove("active")
	}
	if (keys.move.down.includes(event.key)) {
		player.move.down = false
		getElement("#move .down").classList.remove("active")
	}
	if (keys.move.left.includes(event.key)) {
		player.move.left = false
		getElement("#move .left").classList.remove("active")
	}
	if (keys.move.right.includes(event.key)) {
		player.move.right = false
		getElement("#move .right").classList.remove("active")
	}

	// shoot
	if (keys.shoot.up.includes(event.key)) {
		player.shoot.up = false
		getElement("#shoot .up").classList.remove("active")
	}
	if (keys.shoot.down.includes(event.key)) {
		player.shoot.down = false
		getElement("#shoot .down").classList.remove("active")
	}
	if (keys.shoot.left.includes(event.key)) {
		player.shoot.left = false
		getElement("#shoot .left").classList.remove("active")
	}
	if (keys.shoot.right.includes(event.key)) {
		player.shoot.right = false
		getElement("#shoot .right").classList.remove("active")
	}
}

/* ==================================================
	dev info
================================================== */

function updateDevInfo() {
	getElement("#player div:nth-child(1) span").innerText = player.position.x
	getElement("#player div:nth-child(2) span").innerText = player.position.y
	getElement("#player div:nth-child(3) span").innerText = player.velocity.x
	getElement("#player div:nth-child(4) span").innerText = player.velocity.y
}

/* ==================================================
	frames
================================================== */

const FPS = 60

setInterval(() => {
	if (!player.alive) { // probably going to change this?
		return
	}

	game.points += game.balls * (1 + game.wave)

	if (game.playing) {
		game.time += 1 / FPS
	}
	game.render()
	game.updateGameInfo()
	updateDevInfo()
}, 1000 / FPS)



// start game
game.start()
