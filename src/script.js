const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

canvas.height = 800
canvas.width = 800

const gameObjects = []

class Player {
	constructor(width, height) {
		this.width = width
		this.height = height
		this.x = 0
		this.y = 0
		this.speedX = 0
		this.speedY = 0
		this.acceleration = 0.5
		this.retardation = 0.25
		this.topSpeed = 10

		// directions
		this.up = false
		this.down = false
		this.left = false
		this.right = false
		this.space = false
	}

	draw() {
		context.fillRect(this.x, this.y, this.width, this.height)
	}
}

class ball { // todo: make ball that the player can shot
	constructor() {
	}

	draw() {
	}
}

const keys = {
	up: ["w", "ArrowUp"],
	down: ["s", "ArrowDown"],
	left: ["a", "ArrowLeft"],
	right: ["d", "ArrowRight"],
}

function render() {
	canvas.width = canvas.width // "reloads" canvas
	gameObjects.forEach((object) => {
		object.draw()
	})
}

player = new Player(50, 50)
gameObjects.push(player)
render()

const upArrow = document.querySelector("#up")
const downArrow = document.querySelector("#down")
const leftArrow = document.querySelector("#left")
const rightArrow = document.querySelector("#right")
const spaceBar = document.querySelector("#space")

document.onkeydown = (event) => {
	if (keys.up.includes(event.key)) {
		player.up = true
		upArrow.style.backgroundColor = "#999"
	}

	if (keys.down.includes(event.key)) {
		player.down = true
		downArrow.style.backgroundColor = "#999"
	}

	if (keys.left.includes(event.key)) {
		player.left = true
		leftArrow.style.backgroundColor = "#999"
	}

	if (keys.right.includes(event.key)) {
		player.right = true
		rightArrow.style.backgroundColor = "#999"
	}

	if (event.key === " ") {
		player.space = true
		spaceBar.style.backgroundColor = "#999"
	}
}

document.onkeyup = (event) => {
	if (keys.up.includes(event.key)) {
		player.up = false
		upArrow.style.backgroundColor = "#fff"
	}

	if (keys.down.includes(event.key)) {
		player.down = false
		downArrow.style.backgroundColor = "#fff"
	}

	if (keys.left.includes(event.key)) {
		player.left = false
		leftArrow.style.backgroundColor = "#fff"
	}

	if (keys.right.includes(event.key)) {
		player.right = false
		rightArrow.style.backgroundColor = "#fff"
	}

	if (event.key === " ") {
		player.space = false
		spaceBar.style.backgroundColor = "#fff"
	}
}

const speedometerX = document.querySelector("#speedometer div:first-child span")
const speedometerY = document.querySelector("#speedometer div:last-child span")

setInterval(() => {
	// movement
	if (player.up) {
		player.speedY -= player.acceleration
		if (player.speedY < -player.topSpeed) {
			player.speedY = -player.topSpeed
		}
	} else if (player.speedY < 0) {
		player.speedY += player.retardation
	}

	if (player.down) {
		player.speedY += player.acceleration
		if (player.speedY > player.topSpeed) {
			player.speedY = player.topSpeed
		}
	} else if (player.speedY > 0) {
		player.speedY -= player.retardation
	}

	if (player.left) {
		player.speedX -= player.acceleration
		if (player.speedX < -player.topSpeed) {
			player.speedX = -player.topSpeed
		}
	} else if (player.speedX < 0) {
		player.speedX += player.retardation
	}

	if (player.right) {
		player.speedX += player.acceleration
		if (player.speedX > player.topSpeed) {
			player.speedX = player.topSpeed
		}
	} else if (player.speedX > 0) {
		player.speedX -= player.retardation
	}

	if (player.up && player.down) {
		if (player.speedY < 0) {
			player.speedY += player.retardation
		} else if (player.speedY > 0) {
			player.speedY -= player.retardation
		}
	}

	if (player.left && player.right) {
		if (player.speedX < 0) {
			player.speedX += player.retardation
		} else if (player.speedX > 0) {
			player.speedX -= player.retardation
		}
	}

	speedometerX.innerText = player.speedX
	speedometerY.innerText = player.speedY

	player.x += player.speedX
	player.y += player.speedY

	if (player.x < 0) {
		player.x = 0
		player.speedX = 0
	}

	if (player.x > canvas.width - player.width) {
		player.x = canvas.width - player.width
		player.speedX = 0
	}

	if (player.y < 0) {
		player.y = 0
		player.speedY = 0
	}

	if (player.y > canvas.height - player.height) {
		player.y = canvas.height - player.height
		player.speedY = 0
	}

	// attack?
	if (player.space) { // todo: attack?
	}

	render()
}, 1000 / 60) // "60fps"; refreshes 60 times per second
