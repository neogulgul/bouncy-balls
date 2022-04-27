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

const BLOCKLENGTH = 1920 / 16

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

/* map creation:
p => player
g => green obstacle
r => red obstacle
y => yellow obstacle
*/

const map1 = [
	["g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g"],
	["g", "p", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "p", "g"],
	["g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g"]
]

const map2 = [
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
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
]

const map3 = [
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
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
]

let canvas, context, player, ball, obstacle

const game = {
	playing: false,
	players: 0,
	objects: [],
	canvas: undefined,
	context: undefined,
	start: () => {
		game.playing = true
		document.body.innerHTML = `<canvas id="game"></canvas>`
		canvas = getElement("canvas")
		canvas.width = 1920
		canvas.height = 1920
		context = canvas.getContext("2d")
		game.loadmap(map1)
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
					game.players++
					player = new Player(position.x, position.y, player1.color, player1.keys)
					if (game.players > 1) {
						player = new Player(position.x, position.y, player2.color, player2.keys)
					}
					game.objects.push(player)
				} else if (square === "g") {
					obstacle = new Obstacle(position.x, position.y, "green", false)
					game.objects.push(obstacle)
				} else if (square === "r") {
					obstacle = new Obstacle(position.x, position.y, "red", false)
					game.objects.push(obstacle)
				} else if (square === "y") {
					obstacle = new Obstacle(position.x, position.y, "yellow", true)
					game.objects.push(obstacle)
				}
			}
		}
	},
	render: () => {
		context.clearRect(0, 0, canvas.width, canvas.height) // clear canvas

		game.objects.forEach((object) => {
			object.draw()
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
					object.velocity.y = 0
				}
				// bottom
				else if (object.position.x > obstacle.position.x - object.width &&
					object.position.x < obstacle.position.x + obstacle.width &&
					object.position.y + object.velocity.y < obstacle.position.y &&
					object.position.y + object.velocity.y > obstacle.position.y - object.height) {
					object.position.y = obstacle.position.y - object.height
					object.velocity.y = 0
				}
				// left
				if (object.position.y > obstacle.position.y - object.height &&
					object.position.y < obstacle.position.y + obstacle.height &&
					object.position.x + object.velocity.x > obstacle.position.x + obstacle.width - object.width &&
					object.position.x + object.velocity.x < obstacle.position.x + obstacle.width) {
					object.position.x = obstacle.position.x + obstacle.width
					object.velocity.x = 0
				}
				// right
				else if (object.position.y > obstacle.position.y - object.height &&
					object.position.y < obstacle.position.y + obstacle.height &&
					object.position.x + object.velocity.x < obstacle.position.x &&
					object.position.x + object.velocity.x > obstacle.position.x - object.width) {
					object.position.x = obstacle.position.x - object.width
					object.velocity.x = 0
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
		let ball = new Ball(this.position.x, this.position.y, this.color)
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
		this.position = {
			x: x,
			y: y
		}
		this.width = BLOCKLENGTH / 5
		this.height = BLOCKLENGTH / 5
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
		this.position = {
			x: x,
			y: y
		}
		this.width = BLOCKLENGTH
		this.height = BLOCKLENGTH
		this.color = color
		this.bounce = bounce // true || false
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

/* 	temporary 	*/
const maps = document.querySelectorAll(".map")
maps.forEach((map) => {
	map.onclick = () => {
		game.start()
	}
})
/*				*/

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
