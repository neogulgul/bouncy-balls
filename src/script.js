function getElement(element) {
	return document.querySelector(element)
}

function getTexture(src) {
	image = new Image
	image.src = `./textures/${src}`
	return image
}

/* ==================================================
	GAME
================================================== */

const DIMENSION = 728
const BLOCKLENGTH = DIMENSION / 16

const player1 = {
	color: "green",
	keys: {
		move: {
			up: "w",
			down: "s",
			left: "a",
			right: "d"
		},
		shoot: " " // space
	}
}

const player2 = {
	color: "red",
	keys: {
		move: {
			up: "i",
			down: "k",
			left: "j",
			right: "l"
		},
		shoot: "Enter"
	}
}

const allPlayers = [player1, player2]

/* map creation:
p => player
g => green obstacle
r => red obstacle
y => yellow obstacle
*/

const map1 = [
	["g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g"],
	["g", "p", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", "y", " ", "y", " ", "y", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", "y", "y", "p", "y", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", "y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", "y", "y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g"]
]

const map2 = [
	["r", "r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
]

const map3 = [
	["r", "r", "r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
]

const map4 = [
	["r", "r", "r", "r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
]

const map5 = [
	["r", "r", "r", "r", "r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
]

const map6 = [
	["r", "r", "r", "r", "r", "r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
]

const allMaps = [map1, map2, map3, map4, map5, map6]

let canvas, context, player, ball, obstacle

const game = {
	playing: false,
	players: 0,
	objects: [],
	canvas: undefined,
	context: undefined,
	start: (map) => {
		game.playing = true
		document.body.innerHTML = `<canvas id="game"></canvas>`
		canvas = getElement("canvas")
		context = canvas.getContext("2d")
		canvas.width = DIMENSION
		canvas.height = DIMENSION
		game.loadmap(map)
	},
	loadmap: (map) => {
		for (let y = 0; y < map.length; y++) {
			let row = map[y]
			for (let x = 0; x < row.length; x++) {
				let square = row[x]
				let position = {
					x: x * BLOCKLENGTH,
					y: y * BLOCKLENGTH
				}
				if (square === "p") {
					player = new Player(position.x, position.y, allPlayers[game.players].color, allPlayers[game.players].keys)
					game.objects.push(player)
					game.players++
				} else if (square === "g") {
					obstacle = new Obstacle(position.x, position.y, "green", 0)
					game.objects.push(obstacle)
				} else if (square === "r") {
					obstacle = new Obstacle(position.x, position.y, "red", 0)
					game.objects.push(obstacle)
				} else if (square === "y") {
					obstacle = new Obstacle(position.x, position.y, "yellow", 4)
					game.objects.push(obstacle)
				}
			}
		}
	},
	render: () => {
		game.objects.forEach((object) => {
			if (object.type === "player" || object.type === "ball") {
				context.clearRect(object.x, object.y, object.width, object.height)
				object.draw()
			}
		})
	},
	collision: (object) => {
		game.objects.forEach((obstacle) => {
			if (obstacle.type === "obstacle") {
				// note: directions relative to player; top is top of player, bottom is bottom of player, etc.
				// top
				if (object.position.x > obstacle.position.x - object.width &&
					object.position.x < obstacle.position.x + obstacle.width &&
					object.position.y + object.velocity.y > obstacle.position.y + obstacle.height - object.height &&
					object.position.y + object.velocity.y < obstacle.position.y + obstacle.height) {
					object.position.y = obstacle.position.y + obstacle.height
					object.velocity.y = -object.velocity.y * obstacle.bounce
				}
				// bottom
				else if (object.position.x > obstacle.position.x - object.width &&
					object.position.x < obstacle.position.x + obstacle.width &&
					object.position.y + object.velocity.y < obstacle.position.y &&
					object.position.y + object.velocity.y > obstacle.position.y - object.height) {
					object.position.y = obstacle.position.y - object.height
					object.velocity.y = -object.velocity.y * obstacle.bounce
				}
				// left
				if (object.position.y > obstacle.position.y - object.height &&
					object.position.y < obstacle.position.y + obstacle.height &&
					object.position.x + object.velocity.x > obstacle.position.x + obstacle.width - object.width &&
					object.position.x + object.velocity.x < obstacle.position.x + obstacle.width) {
					object.position.x = obstacle.position.x + obstacle.width
					object.velocity.x = -object.velocity.x * obstacle.bounce
				}
				// right
				else if (object.position.y > obstacle.position.y - object.height &&
					object.position.y < obstacle.position.y + obstacle.height &&
					object.position.x + object.velocity.x < obstacle.position.x &&
					object.position.x + object.velocity.x > obstacle.position.x - object.width) {
					object.position.x = obstacle.position.x - object.width
					object.velocity.x = -object.velocity.x * obstacle.bounce
				}
			}
		})
	}
}

/* ==================================================
	CLASSES
================================================== */

class Player {
	constructor(x, y, color, keys) {
		this.width = BLOCKLENGTH / 2
		this.height = BLOCKLENGTH / 2
		this.position = {
			x: x + this.width / 2,
			y: y + this.height / 2
		}
		this.velocity = {
			x: 0,
			y: 0
		}
		this.acceleration = 0.75
		this.deceleration = 0.25
		this.maxVelocity = 6
		this.move = {
			up: false,
			down: false,
			left: false,
			right: false
		}
		this.collision = {
			up: false,
			down: false,
			left: false,
			right: false
		}
		this.shooting = false
		this.keys = keys
		this.color = color
		this.type = "player"
	}

	shoot() {
		let ball = new Ball(this.position.x + this.width / 2, this.position.y + this.height / 2, this.color)
		game.objects.push(ball)
	}

	draw() {
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

		// shoot
		if (this.shooting) {
			this.shoot()
		}

		game.collision(this)

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		context.drawImage(getTexture(`player_${this.color}.svg`), this.position.x, this.position.y, this.width, this.height)
	}
}

class Ball {
	constructor(x, y, color) {
		this.width = BLOCKLENGTH / 5
		this.height = BLOCKLENGTH / 5
		this.position = {
			x: x - this.width / 2,
			y: y - this.height / 2
		}
		this.velocity = {
			x: 0,
			y: 0
		}
		this.color = color
		this.type = "ball"
	}

	draw() {
		game.collision(this)

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		context.drawImage(getTexture(`ball_${this.color}.svg`), this.position.x, this.position.y, this.width, this.height)
	}
}

class Obstacle {
	constructor(x, y, color, bounce) {
		this.width = BLOCKLENGTH
		this.height = BLOCKLENGTH
		this.position = {
			x: x,
			y: y
		}
		this.color = color
		this.bounce = bounce
		this.type = "obstacle"
	}

	draw() {
		context.drawImage(getTexture(`obstacle_${this.color}.svg`), this.position.x, this.position.y, this.width, this.height)
	}
}

/* ==================================================
	KEYPRESSES
================================================== */

document.onkeydown = (event) => {
	game.objects.forEach((object) => {
		if (object.type === "player") {
			// move
			if (event.key === object.keys.move.up) {
				object.move.up = true
			}
			if (event.key === object.keys.move.down) {
				object.move.down = true
			}
			if (event.key === object.keys.move.left) {
				object.move.left = true
			}
			if (event.key === object.keys.move.right) {
				object.move.right = true
			}

			// shoot
			if (event.key === object.keys.shoot) {
				object.shooting = true
			}
		}
	})
}

document.onkeyup = (event) => {
	game.objects.forEach((object) => {
		if (object.type === "player") {
			// move
			if (event.key === object.keys.move.up) {
				object.move.up = false
			}
			if (event.key === object.keys.move.down) {
				object.move.down = false
			}
			if (event.key === object.keys.move.left) {
				object.move.left = false
			}
			if (event.key === object.keys.move.right) {
				object.move.right = false
			}

			// shoot
			if (event.key === object.keys.shoot) {
				object.shooting = false
			}
		}
	})
}

/* ==================================================
	FRAMES
================================================== */

const FPS = 60

setInterval(() => {
	if (game.playing) {
		game.render()
	}
}, 1000 / FPS)

/* ==================================================
	MAIN MENU
================================================== */

// todo: create map render for map selection
const canvasMap1 = document.querySelector(".map-selection .map1 canvas")
const canvasMap2 = document.querySelector(".map-selection .map2 canvas")
const canvasMap3 = document.querySelector(".map-selection .map3 canvas")
const canvasMap4 = document.querySelector(".map-selection .map4 canvas")
const canvasMap5 = document.querySelector(".map-selection .map5 canvas")
const canvasMap6 = document.querySelector(".map-selection .map6 canvas")

// map selection
const maps = document.querySelectorAll(".map")
maps.forEach((map) => {
	map.onclick = () => {
		let choosenMap = parseInt(map.classList[1].split("map")[1]) - 1
		game.start(allMaps[choosenMap])
	}
})

// main menu events
const buttonOnePlayer = getElement("button.one-player")
const buttonTwoPlayer = getElement("button.two-player")
const mapsOnePlayer = getElement(".map-selection.one-player")
const mapsTwoPlayer = getElement(".map-selection.two-player")
const playerOne = getElement(".player-image:first-of-type")
const playerTwo = getElement(".player-image:last-of-type")

document.body.onclick = (event) => {
	// swap player textures
	if ([playerOne, playerTwo].includes(event.target)) {
		let playerOneImage = playerOne.getAttribute("src")
		let playerTwoImage = playerTwo.getAttribute("src")

		playerOne.src = playerTwoImage
		playerTwo.src = playerOneImage

		if (player1.color === "green") {
			player1.color = "red"
			player2.color = "green"
		} else if (player1.color === "red") {
			player1.color = "green"
			player2.color = "red"
		}
	}

	// removes active class from one player map selection
	if (![buttonOnePlayer, playerOne, playerTwo].includes(event.target) && !mapsOnePlayer.contains(event.target)) {
		mapsOnePlayer.classList.remove("active")
	}

	// removes active class from two player map selection
	if (![buttonTwoPlayer, playerOne, playerTwo].includes(event.target) && !mapsTwoPlayer.contains(event.target)) {
		mapsTwoPlayer.classList.remove("active")
	}
}

buttonOnePlayer.onclick = () => {
	mapsOnePlayer.classList.toggle("active")
}
buttonOnePlayer.onmouseover = () => {
	playerOne.classList.add("active")
}
buttonOnePlayer.onmouseout = () => {
	playerOne.classList.remove("active")
}

buttonTwoPlayer.onclick = () => {
	mapsTwoPlayer.classList.toggle("active")
}
buttonTwoPlayer.onmouseover = () => {
	playerOne.classList.add("active")
	playerTwo.classList.add("active")
}
buttonTwoPlayer.onmouseout = () => {
	playerOne.classList.remove("active")
	playerTwo.classList.remove("active")
}

// info
const infoBtn = getElement("#info-btn")
const infoText = getElement("#info-text")

infoBtn.onclick = () => {
	infoBtn.classList.toggle("active")
	infoText.classList.toggle("active")
}

infoText.onclick = () => {
	infoBtn.classList.remove("active")
	infoText.classList.remove("active")
}
