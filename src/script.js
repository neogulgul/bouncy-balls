const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

canvas.height = 512
canvas.width = 512

class Player {
	constructor(width, height) {
		this.width = width
		this.height = height
		this.x = 0
		this.y = 0
		this.step = 5

		// directions
		this.up = false
		this.down = false
		this.left = false
		this.right = false
	}

	draw() {
		context.fillRect(this.x, this.y, this.width, this.height)
	}
}

const keys = {
	up: ["w", "ArrowUp"],
	down: ["s", "ArrowDown"],
	left: ["a", "ArrowLeft"],
	right: ["d", "ArrowRight"],
}

player = new Player(50, 50)
player.draw()

const upKey = document.querySelector("#up")
const downKey = document.querySelector("#down")
const leftKey = document.querySelector("#left")
const rightKey = document.querySelector("#right")

document.onkeydown = (event) => {
	if (keys.up.includes(event.key)) {
		player.up = true
		upKey.style.backgroundColor = "#999"
	}

	if (keys.down.includes(event.key)) {
		player.down = true
		downKey.style.backgroundColor = "#999"
	}

	if (keys.left.includes(event.key)) {
		player.left = true
		leftKey.style.backgroundColor = "#999"
	}

	if (keys.right.includes(event.key)) {
		player.right = true
		rightKey.style.backgroundColor = "#999"
	}
}

document.onkeyup = (event) => {
	if (keys.up.includes(event.key)) {
		player.up = false
		upKey.style.backgroundColor = "#fff"
	}

	if (keys.down.includes(event.key)) {
		player.down = false
		downKey.style.backgroundColor = "#fff"
	}

	if (keys.left.includes(event.key)) {
		player.left = false
		leftKey.style.backgroundColor = "#fff"
	}

	if (keys.right.includes(event.key)) {
		player.right = false
		rightKey.style.backgroundColor = "#fff"
	}
}

setInterval(() => { // todo: acceleration
	if (player.up) {
		player.y -= 5
	}

	if (player.down) {
		player.y += 5
	}

	if (player.left) {
		player.x -= 5
	}

	if (player.right) {
		player.x += 5
	}

	if (player.x < 0) {
		player.x = 0
	}

	if (player.x > canvas.width - player.width) {
		player.x = canvas.width - player.width
	}

	if (player.y < 0) {
		player.y = 0
	}

	if (player.y > canvas.height - player.height) {
		player.y = canvas.height - player.height
	}

	canvas.width = canvas.width // "reloads" canvas
	player.draw()
}, 1000 / 60) // "60fps"; refreshes 60 times per second
