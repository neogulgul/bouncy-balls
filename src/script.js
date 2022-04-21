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
		this.topSpeed = 6
		this.shot = true
		this.bullets = 0
		this.score = 0
		this.type = "player"

		// directions
		this.direction = "down"
		this.up = false
		this.down = false
		this.left = false
		this.right = false
		this.space = false
	}

	draw() {
		context.beginPath()
		context.rect(this.x, this.y, this.width, this.height)
		context.stroke()
	}
}

class Ball { // todo: make ball that the player can shot
	constructor(x, y, speedX, speedY) {
		this.radius = 10
		this.x = x
		this.y = y
		this.speedX = speedX
		this.speedY = speedY
		this.speed = 8
		this.type = "ball"
	}

	draw() {
		context.beginPath()
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
		context.stroke()
	}
}

const keys = {
	up: ["w", "ArrowUp", "i"],
	down: ["s", "ArrowDown", "k"],
	left: ["a", "ArrowLeft", "j"],
	right: ["d", "ArrowRight", "l"],
	space: [" ", "Enter"]
}

function render() {
	canvas.width = canvas.width // "reloads" canvas
	gameObjects.forEach((object) => {
		if (object.type === "player") {
			player.x += player.speedX
			player.y += player.speedY

			if (player.x < 0) {
				player.x = 0
				player.speedX = -player.speedX * 2
			}

			if (player.x > canvas.width - player.width) {
				player.x = canvas.width - player.width
				player.speedX = -player.speedX * 2
			}

			if (player.y < 0) {
				player.y = 0
				player.speedY = -player.speedY * 2
			}

			if (player.y > canvas.height - player.height) {
				player.y = canvas.height - player.height
				player.speedY = -player.speedY * 2
			}
		}

		if (object.type === "ball") {
			if(object.y < 0) {
				object.speedY = -object.speedY
			}
			if(object.y > canvas.height) {
				object.speedY = -object.speedY
			}
			if(object.x < 0) {
				object.speedX = -object.speedX
			}
			if(object.x > canvas.width) {
				object.speedX = -object.speedX
			}
			object.x += object.speedX
			object.y += object.speedY
		}
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
		player.direction = "up"
		upArrow.style.backgroundColor = "#999"
	}

	if (keys.down.includes(event.key)) {
		player.down = true
		player.direction = "down"
		downArrow.style.backgroundColor = "#999"
	}

	if (keys.left.includes(event.key)) {
		player.left = true
		player.direction = "left"
		leftArrow.style.backgroundColor = "#999"
	}

	if (keys.right.includes(event.key)) {
		player.right = true
		player.direction = "right"
		rightArrow.style.backgroundColor = "#999"
	}

	if (keys.space.includes(event.key)) {
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

	if (keys.space.includes(event.key)) {
		player.space = false
		spaceBar.style.backgroundColor = "#fff"
		player.shot = true
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

	/*
	player.x += player.speedX
	player.y += player.speedY

	if (player.x < 0) {
		player.x = 0
		player.speedX = -player.speedX * 2
	}

	if (player.x > canvas.width - player.width) {
		player.x = canvas.width - player.width
		player.speedX = -player.speedX * 2
	}

	if (player.y < 0) {
		player.y = 0
		player.speedY = -player.speedY * 2
	}

	if (player.y > canvas.height - player.height) {
		player.y = canvas.height - player.height
		player.speedY = -player.speedY * 2
	}
	*/

	// attack?
	if (player.space && player.shot) {
		if (player.speedX !==  0 || player.speedY !== 0) {
			ball = new Ball(player.x + player.width / 2, player.y + player.height / 2, player.speedX, player.speedY)
			gameObjects.push(ball)
			player.shot = false
			player.bullets ++
			document.querySelector("#bullets").innerText = `Bullets: ${player.bullets}/${10+10*player.score}`
			if (player.bullets >= 10 + 10 * player.score){
				for(i = 0; i < gameObjects.length; i++){
					if(gameObjects[i].type === "ball"){
						gameObjects.splice(i)
					}

				}
				player.score ++
				document.querySelector("#score").innerText = `Score: ${player.score}`
				player.bullets = 0
			}
			console.log(player.bullets, player.score)
		}
	}

	// display gameObjects
	/*document.querySelector("#game-objects").innerText = ""
	gameObjects.forEach((object) => {
		document.querySelector("#game-objects").innerText += object.type
	})*/

	render()
}, 1000 / 60) // "60fps"; refreshes 60 times per second
