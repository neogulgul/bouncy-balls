function getElement(element) {
	return document.querySelector(element)
}

function getTexture(src) {
	let image = new Image()
	image.src = `./textures/${src}`
	return image
}

const textures = {
	player: {
		green: getTexture("player_green.svg"),
		red: getTexture("player_red.svg"),
		gray: getTexture("player_gray.svg")
	},
	ball: {
		green: getTexture("ball_green.svg"),
		red: getTexture("ball_red.svg"),
		gray: getTexture("ball_gray.svg")
	},
	obstacle: {
		green: getTexture("obstacle_green.svg"),
		red: getTexture("obstacle_red.svg"),
		yellow: getTexture("obstacle_yellow.svg")
	}
}

/* ==================================================
	GAME
================================================== */

const DIMENSION = 1920
const BLOCKLENGTH = DIMENSION / 16

const player1 = {
	texture: textures.player.green,
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
	texture: textures.player.red,
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

const map1 = [ // one player
	["g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g"],
	["g", "", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", "p", " ", "g", " ", " ", " ", " ", " ", " ", "g", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g", " ", " ", "g"],
	["g", " ", "g", " ", "g", " ", " ", " ", " ", " ", " ", " ", " ", "g", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", "g", "g", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", "g", "g", "g", "g", " ", " ", " ", " ", "g"],
	["g", " ", " ", "g", " ", " ", "g", "g", "g", "g", "g", "g", " ", " ", " ", "g"],
	["g", " ", " ", "g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", "g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", "g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", "g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g", "g", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g", "g", "g", "g"],
	["g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g"]
]

const map2 = [ // one player
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

const map3 = [ // one player
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

const map4 = [ // two player
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

const map5 = [ // two player
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

const map6 = [ // two player
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
	start: () => {
		game.playing = true
		document.body.innerHTML = `<canvas id="game"></canvas>`
		canvas = getElement("canvas")
		context = canvas.getContext("2d")
		canvas.width = DIMENSION
		canvas.height = DIMENSION
		game.loadmap(game.map)

		game.objects.forEach((object) => {
			object.draw()
		})
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
					player = new Player(allPlayers[game.players].texture, position.x, position.y, allPlayers[game.players].keys)
					game.objects.push(player)
					game.players++
				} else if (square === "g") {
					obstacle = new Obstacle(textures.obstacle.green, position.x, position.y, 0)
					game.objects.push(obstacle)
				} else if (square === "r") {
					obstacle = new Obstacle(textures.obstacle.red, position.x, position.y, 0)
					game.objects.push(obstacle)
				} else if (square === "y") {
					obstacle = new Obstacle(textures.obstacle.yellow, position.x, position.y, 4)
					game.objects.push(obstacle)
				}
			}
		}
	},
	render: () => {
		// this loop goes through the current map and looks for spots without obstacles and clears them
		for (let y = 0; y < game.map.length; y++) {
			let row = game.map[y]
			for (let x = 0; x < row.length; x++) {
				let square = row[x]
				let position = {
					x: x * BLOCKLENGTH,
					y: y * BLOCKLENGTH
				}
				if (!["g", "r", "y"].includes(square)) {
					context.clearRect(position.x, position.y, BLOCKLENGTH, BLOCKLENGTH)
				}
			}
		}
		game.objects.forEach((object) => {
			if (object.type !== "obstacle") {
				object.draw()
			}
		})
	},
	collision: (object) => {
		game.objects.forEach((obstacle) => {
			if (obstacle.type === "obstacle" || obstacle.type === "player" && obstacle.texture !== object.texture) {
				// note: directions relative to player; top is top of player, bottom is bottom of player, etc.
				// top
				if (object.position.x > obstacle.position.x - object.width &&
					object.position.x < obstacle.position.x + obstacle.width &&
					object.position.y + object.velocity.y > obstacle.position.y + obstacle.height - object.height &&
					object.position.y + object.velocity.y < obstacle.position.y + obstacle.height) {
					if (object.type === "player") {
						object.position.y = obstacle.position.y + obstacle.height
						object.velocity.y = -object.velocity.y * obstacle.bounce
					} else if (object.type === "ball") {
						object.velocity.y = -object.velocity.y
					}
				}
				// bottom
				else if (object.position.x > obstacle.position.x - object.width &&
					object.position.x < obstacle.position.x + obstacle.width &&
					object.position.y + object.velocity.y < obstacle.position.y &&
					object.position.y + object.velocity.y > obstacle.position.y - object.height) {
					if (object.type === "player") {
						object.position.y = obstacle.position.y - object.height
						object.velocity.y = -object.velocity.y * obstacle.bounce
					} else if (object.type === "ball") {
						object.velocity.y = -object.velocity.y
					}
				}
				// left
				if (object.position.y > obstacle.position.y - object.height &&
					object.position.y < obstacle.position.y + obstacle.height &&
					object.position.x + object.velocity.x > obstacle.position.x + obstacle.width - object.width &&
					object.position.x + object.velocity.x < obstacle.position.x + obstacle.width) {
					if (object.type === "player") {
						object.position.x = obstacle.position.x + obstacle.width
						object.velocity.x = -object.velocity.x * obstacle.bounce
					} else if (object.type === "ball") {
						object.velocity.x = -object.velocity.x
					}
				}
				// right
				else if (object.position.y > obstacle.position.y - object.height &&
					object.position.y < obstacle.position.y + obstacle.height &&
					object.position.x + object.velocity.x < obstacle.position.x &&
					object.position.x + object.velocity.x > obstacle.position.x - object.width) {
					if (object.type === "player") {
						object.position.x = obstacle.position.x - object.width
						object.velocity.x = -object.velocity.x * obstacle.bounce
					} else if (object.type === "ball") {
						object.velocity.x = -object.velocity.x
					}
				}
			}
		})
	}
}

/* ==================================================
	CLASSES
================================================== */

class Player {
	constructor(texture, x, y, keys) {
		this.texture = texture
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
		this.shootTimer = 0
		this.shooting = false
		this.keys = keys
		this.type = "player"
		this.bounce = 0
	}

	shoot() {
		// texture
		let ballTexture
		let texturePath = this.texture.getAttribute("src")
		if (texturePath.includes("green")) {
			ballTexture = textures.ball.green
		} else if (texturePath.includes("red")) {
			ballTexture = textures.ball.red
		}

		// direction
		let direction = {
			x: 0,
			y: 0
		}
		if (this.move.up && !this.move.down) {
			direction.y = -1
		} else if (this.move.down && !this.move.up) {
			direction.y = 1
		}
		if (this.move.left) {
			direction.x = -1
		} else if (this.move.right) {
			direction.x = 1
		}

		let ball = new Ball(ballTexture, this.position.x + this.width / 2, this.position.y + this.height / 2, direction)
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
		if (this.shooting && this.shootTimer === 0 && (this.move.up || this.move.down || this.move.left || this.move.right)) {
			this.shoot()
			this.shootTimer++
		}

		if (this.shootTimer > 0) {
			this.shootTimer++
			if (this.shootTimer === 30) {
				this.shootTimer = 0
			}
		}

		game.collision(this)

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		context.drawImage(this.texture, this.position.x, this.position.y, this.width, this.height)
	}
}

class Ball {
	constructor(texture, x, y, direction) {
		this.texture = texture
		this.width = BLOCKLENGTH / 5
		this.height = BLOCKLENGTH / 5
		this.position = {
			x: x - this.width / 2 + BLOCKLENGTH / 2 * direction.x,
			y: y - this.height / 2 + BLOCKLENGTH / 2 * direction.y
		}
		this.speed = 10
		this.velocity = {
			x: this.speed * direction.x,
			y: this.speed * direction.y
		}
		this.type = "ball"
	}

	draw() {
		game.collision(this)

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		context.drawImage(this.texture, this.position.x, this.position.y, this.width, this.height)
	}
}

class Obstacle {
	constructor(texture, x, y, bounce) {
		this.texture = texture
		this.position = {
			x: x,
			y: y
		}
		this.width = BLOCKLENGTH
		this.height = BLOCKLENGTH
		this.bounce = bounce
		this.type = "obstacle"
	}

	draw() {
		context.drawImage(this.texture, this.position.x, this.position.y, this.width, this.height)
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
		game.map = allMaps[choosenMap]
		game.start()
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

		let playerOneTexture = player1.texture
		let playerTwoTexture = player2.texture

		player1.texture = playerTwoTexture
		player2.texture = playerOneTexture
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
