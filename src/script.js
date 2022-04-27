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

const BLOCKLENGTH = 128

const keymap = {
	player1: {
		move: {
			up: "w",
			down: "s",
			left: "a",
			right: "d"
		},
		shoot: " " // space
	},
	player2: {
		move: {
			up: "i",
			down: "k",
			left: "j",
			right: "l"
		},
		shoot: "Enter"
	}
}

const map1 = [
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

let canvas, context

const game = {
	playing: false,
	multiplayer: false,
	objects: [],
	canvas: undefined,
	context: undefined,
	start: () => {
		game.playing = true
		document.body.innerHTML = "<canvas></canvas>"
		canvas = getElement("canvas")
		canvas.width = 16 * 16
		canvas.height = 16 * 16
		context = canvas.getContext("2d")
		game.loadmap(map1)

		let player1 = new Player(0, 0, keymap.player1, "green")
		game.objects.push(player1)
		let player2 = new Player(0, 0, keymap.player2, "red")
		game.objects.push(player2)
	},
	loadmap: (map) => {
		for (let y = 0; y < map.length; y++) {
		}
	},
	render: () => {
		context.clearRect(0, 0, canvas.width, canvas.height) // clear canvas

		game.objects.forEach((object) => {
			object.draw()
		})
	}
}

/* ==================================================
	CLASSES
================================================== */

class Player {
	constructor(x, y, keys, color) {
		this.position = {
			x: x,
			y: y
		}
		this.width = BLOCKLENGTH / 2
		this.height = BLOCKLENGTH / 2
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
		let ball = new Ball(getTexture(`ball_${this.color}.svg`), this.position.x, this.position.y)
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

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		context.drawImage(getTexture(`player_${this.color}.svg`), this.position.x, this.position.y, this.width, this.height)
	}
}

class Ball {
	constructor(texture, x, y) {
		this.texture = texture
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
	}

	draw() {
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
		this.bounce = bounce // true || false
	}

	draw() {}
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

const infoBtn = getElement("#info-btn")
const infoText = getElement("#info-text")

infoBtn.onclick = () => {
	infoBtn.classList.toggle("active")
	infoText.classList.toggle("active")
}

const buttonOnePlayer = getElement("button.one-player")
const buttonTwoPlayer = getElement("button.two-player")
const mapsOnePlayer = getElement(".map-selection.one-player")
const mapsTwoPlayer = getElement(".map-selection.two-player")
const playerOne = getElement(".player-image:first-of-type")
const playerTwo = getElement(".player-image:last-of-type")

// swaps player textures
document.body.onclick = (event) => {
	if ([playerOne, playerTwo].includes(event.target)) {
		let playerOneImage = playerOne.getAttribute("src")
		let playerTwoImage = playerTwo.getAttribute("src")

		playerOne.src = playerTwoImage
		playerTwo.src = playerOneImage
	}
}

buttonOnePlayer.onclick = () => {
	mapsOnePlayer.classList.toggle("active")
}
buttonOnePlayer.onmouseover = () => {
	playerOne.style.opacity = 1
	playerOne.style.marginBottom = "10px"
}
buttonOnePlayer.onmouseout = () => {
	playerOne.style.opacity = 0.5
	playerOne.style.marginBottom = "0"
}

buttonTwoPlayer.onclick = () => {
	game.multiplayer = true
	game.start()
}
buttonTwoPlayer.onmouseover = () => {
	playerOne.style.opacity = 1
	playerOne.style.marginBottom = "10px"
	playerTwo.style.opacity = 1
	playerTwo.style.marginBottom = "10px"
}
buttonTwoPlayer.onmouseout = () => {
	playerOne.style.opacity = 0.5
	playerOne.style.marginBottom = "0"
	playerTwo.style.opacity = 0.5
	playerTwo.style.marginBottom = "0"
}
