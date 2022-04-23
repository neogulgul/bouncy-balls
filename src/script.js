const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

canvas.width = 1920
canvas.height = 1080

const BLOCKLENGTH = 1920 / 16

// todo: todos

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
	score: 0,
	balls: 0,
	time: 0,
	objects: [],
	getTexture: (src) => {
		image = new Image
		image.src = `./textures/${src}`
		return image
	},

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

		else if (object.type === "ball") {
			// top || bottom
			if (object.position.y + object.velocity.y < 0 || object.position.y + object.velocity.y > canvas.height) {
				object.velocity.y = -object.velocity.y
			}
			// left || right
			if (object.position.x + object.velocity.x < 0 || object.position.x + object.velocity.x > canvas.width) {
				object.velocity.x = -object.velocity.x
			}
		}

		// obstacle collision
		game.objects.forEach((obstacle) => {
			if (obstacle.type === "obstacle") {
				if (object.type === "player") {
					// top
					if (object.position.x > obstacle.position.x - object.width &&
						object.position.x < obstacle.position.x + obstacle.width &&
						object.position.y + object.velocity.y < obstacle.position.y &&
						object.position.y + object.velocity.y > obstacle.position.y - object.height) {
						object.position.y = obstacle.position.y - object.height
						object.velocity.y = 0
					}
					// bottom
					else if (object.position.x > obstacle.position.x - object.width &&
						object.position.x < obstacle.position.x + obstacle.width &&
						object.position.y + object.velocity.y > obstacle.position.y + obstacle.height - object.height &&
						object.position.y + object.velocity.y < obstacle.position.y + obstacle.height) {
						object.position.y = obstacle.position.y + obstacle.height
						object.velocity.y = 0
					}
					// left
					if (object.position.y > obstacle.position.y - object.height &&
						object.position.y < obstacle.position.y + obstacle.height &&
						object.position.x + object.velocity.x < obstacle.position.x &&
						object.position.x + object.velocity.x > obstacle.position.x - object.width) {
						object.position.x = obstacle.position.x - object.width
						object.velocity.x = 0
					}
					// right
					else if (object.position.y > obstacle.position.y - object.height &&
						object.position.y < obstacle.position.y + obstacle.height &&
						object.position.x + object.velocity.x > obstacle.position.x + obstacle.width - object.width &&
						object.position.x + object.velocity.x < obstacle.position.x + obstacle.width) {
						object.position.x = obstacle.position.x + obstacle.width
						object.velocity.x = 0
					}
				}

				else if (object.type === "ball") { // todo: ball-obstacle collision is janky, fix it
					// top || bottom
					if (object.position.x + object.velocity.x > obstacle.position.x &&
						object.position.x + object.velocity.x < obstacle.position.x + obstacle.width &&
						object.position.y + object.velocity.y < obstacle.position.y + obstacle.height &&
						object.position.y + object.velocity.y > obstacle.position.y) {
						object.velocity.y = -object.velocity.y
					}
					// left || right
					if (object.position.y + object.velocity.y > obstacle.position.y &&
						object.position.y + object.velocity.y < obstacle.position.y + obstacle.height &&
						object.position.x + object.velocity.x < obstacle.position.x + obstacle.width &&
						object.position.x + object.velocity.x > obstacle.position.x) {
						object.velocity.x = -object.velocity.x
						if (object.velocity.y !== 0) {
							object.velocity.y = -object.velocity.y
						}
					}
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
		document.querySelector("#game div:nth-child(1) span").innerText = game.score
		document.querySelector("#game div:nth-child(2) span").innerText = game.balls + "/" + (10 + 10 * game.score)
		document.querySelector("#game div:nth-child(3) span").innerText = Math.floor(game.time)
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
		this.color = "blue"
		this.type = "player"

		this.up 	= false
		this.down 	= false
		this.left 	= false
		this.right 	= false
		this.ball 	= false
		this.balled = false
	}

	balling() {
		let radius = 10
		let x = this.position.x + this.width / 2
		let y = this.position.y + this.height / 2
		let velocityX = 0
		let velocityY = 0

		if (this.left) {
			x -= radius * 2 + this.width / 2
			velocityX = -this.ballVelocity
		}
		if (this.right) {
			x += radius * 2 + this.width / 2
			velocityX = this.ballVelocity
		}
		if (this.up) {
			y -= radius * 2 + this.height / 2
			velocityY = -this.ballVelocity
		}
		if (this.down) {
			y += radius * 2 + this.height / 2
			velocityY = this.ballVelocity
		}

		ball = new Ball(radius, x, y, velocityX, velocityY, this.color)
		game.objects.push(ball)
	}

	update() {
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
	constructor(radius, x, y, velocityX, velocityY, color) {
		this.radius = radius
		this.position = {
			x: x,
			y: y
		}
		this.velocity = {
			x: velocityX,
			y: velocityY
		}
		this.color = color
		this.type = "ball"
	}

	update() {
		game.collision(this)

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}

	draw() {
		context.beginPath()
		context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
		context.fillStyle = this.color
		context.fill()
	}
}

/* ==================================================
	keypresses
================================================== */

const upKey = document.querySelector("#up")
const downKey = document.querySelector("#down")
const leftKey = document.querySelector("#left")
const rightKey = document.querySelector("#right")
const ballKey = document.querySelector("#ball")

const keys = {
	up: 	["w", "W", "i", "I", "ArrowUp"],
	down: 	["s", "S", "k", "K", "ArrowDown"],
	left: 	["a", "A", "j", "J", "ArrowLeft"],
	right: 	["d", "D", "l", "L", "ArrowRight"],
	ball: 	[" ", "Enter"],
}

document.onkeydown = (event) => {
	//console.log(`"${event.key}"`) // remove later
	if (keys.up.includes(event.key)) {
		player.up = true
		upKey.classList.add("active")
	}

	if (keys.down.includes(event.key)) {
		player.down = true
		downKey.classList.add("active")
	}

	if (keys.left.includes(event.key)) {
		player.left = true
		leftKey.classList.add("active")
	}

	if (keys.right.includes(event.key)) {
		player.right = true
		rightKey.classList.add("active")
	}

	if (keys.ball.includes(event.key)) {
		player.ball = true
		ballKey.classList.add("active")
	}
}

document.onkeyup = (event) => {
	if (keys.up.includes(event.key)) {
		player.up = false
		upKey.classList.remove("active")
	}

	if (keys.down.includes(event.key)) {
		player.down = false
		downKey.classList.remove("active")
	}

	if (keys.left.includes(event.key)) {
		player.left = false
		leftKey.classList.remove("active")
	}

	if (keys.right.includes(event.key)) {
		player.right = false
		rightKey.classList.remove("active")
	}

	if (keys.ball.includes(event.key)) {
		player.ball = false
		if (player.balled) {
			player.balled = false
		}
		ballKey.classList.remove("active")
	}
}

/* ==================================================
	dev info
================================================== */

const DOMx = document.querySelector("#player div:nth-child(1) span")
const DOMy = document.querySelector("#player div:nth-child(2) span")
const DOMvelocityX = document.querySelector("#player div:nth-child(3) span")
const DOMvelocityY = document.querySelector("#player div:nth-child(4) span")

function updateDevInfo() {
	DOMx.innerText = player.position.x
	DOMy.innerText = player.position.y
	DOMvelocityX.innerText = player.velocity.x
	DOMvelocityY.innerText = player.velocity.y
}

/* ==================================================
	frames
================================================== */

const FPS = 60

setInterval(() => {
	// acceleration / deceleration
	// up
	if (player.up) {
		player.velocity.y -= player.acceleration
	} else if (player.velocity.y < 0) {
		player.velocity.y += player.deceleration
	}
	// down
	if (player.down) {
		player.velocity.y += player.acceleration
	} else if (player.velocity.y > 0) {
		player.velocity.y -= player.deceleration
	}
	// left
	if (player.left) {
		player.velocity.x -= player.acceleration
	} else if (player.velocity.x < 0) {
		player.velocity.x += player.deceleration
	}
	// right
	if (player.right) {
		player.velocity.x += player.acceleration
	} else if (player.velocity.x > 0) {
		player.velocity.x -= player.deceleration
	}
	// up && down
	if (player.up && player.down) {
		if (player.velocity.y < 0) {
			player.velocity.y += player.deceleration
		} else if (player.velocity.y > 0) {
			player.velocity.y -= player.deceleration
		}
	}
	// left && right
	if (player.left && player.right) {
		if (player.velocity.x < 0) {
			player.velocity.x += player.deceleration
		} else if (player.velocity.x > 0) {
			player.velocity.x -= player.deceleration
		}
	}

	// limiting maxVelocity
	// up
	if (player.velocity.y < -player.maxVelocity) {
		player.velocity.y = -player.maxVelocity
	}
	// down
	if (player.velocity.y > player.maxVelocity) {
		player.velocity.y = player.maxVelocity
	}
	// left
	if (player.velocity.x < -player.maxVelocity) {
		player.velocity.x = -player.maxVelocity
	}
	// right
	if (player.velocity.x > player.maxVelocity) {
		player.velocity.x = player.maxVelocity
	}

	// balls
	if (player.ball && !player.balled && (player.up || player.down || player.left || player.right)) {
		player.balling()
		player.balled = true
		game.balls++
		if (game.balls === 10 + 10 * game.score) {
			game.balls = 0
			game.score++
			for (let i = 0; i < game.objects.length; i++) {
				if (game.objects[i].type === "ball") {
					game.objects.splice(i)
				}
			}
		}
	}

	game.time += 1 / 60
	game.render()
	game.updateGameInfo()
	updateDevInfo()
}, 1000 / FPS)



// start game
game.start()
