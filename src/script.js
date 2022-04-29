function getElement(element) {
	return document.querySelector(element)
}

function getTexture(src) {
	let image = new Image()
	image.src = `./textures/${src}`
	return image
}

function getHighscore() {
	return localStorage.getItem("highscore")
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

const playerList = [player1, player2]

/* map creation:
p => player
g => green obstacle
r => red obstacle
y => yellow obstacle
*/

const map1 = [ // one player
	["g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g"],
	["g", " ", " ", " ", "g", "g", "g", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", "p", " ", "g", "g", "g", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", "g", "g", "g", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", "g", "g", " ", "g", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", "g", "g", " ", " ", "g", "g", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", "g", "g", " ", "g", "g", "g", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", "g", "g", "g", "g", " ", " ", "g", "g", "g", "g", " ", " ", "g"],
	["g", " ", " ", "g", "g", "g", "g", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", " ", " ", "g", "g", "g", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", "g", " ", " ", " ", "g", "g", " ", " ", "g", "g", "g", "g", " ", " ", "g"],
	["g", "g", "g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", "g", "g", "g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g"]
]

const map2 = [ // one player
	["r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", "p", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r"]
]

const map3 = [ // one player
	["y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", "p", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y"],
	["y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y"],
	["y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y"],
	["y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y", "y", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y"]
]

const map4 = [ // two player
	["g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", " ", "p", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
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
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "p", " ", "g"],
	["g", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "g"],
	["g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g", "g"]
]

const map5 = [ // two player
	["r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", "p", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "p", " ", "r"],
	["r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "r"],
	["r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r"]
]

const map6 = [ // two player
	["y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", "p", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "p", " ", "y"],
	["y", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "y"],
	["y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y", "y"]
]

const mapList = [map1, map2, map3, map4, map5, map6]

let canvas, context, player, ball, obstacle

const game = {
	playing: false,
	objects: [],
	players: 0,
	algorithms: {
		balls: () => {
			return 5 * game.wave
		},
		score: () => {
			return game.wave
		}
	},
	start: () => {
		game.time = 0

		let ui

		if ([map1, map2, map3].includes(game.map)) {
			game.players = 1
			game.score = 0
			game.wave = 1
			game.balls = 0
			game.nextWaveTimer = 10
			game.paused = true
			ui = `
			<div class="game-ui">
				<div id="ui-score">Score<span></span></div>
				<div id="ui-wave">Wave<span></span></div>
				<div id="ui-balls">Balls<span></span></div>
				<div id="ui-time">Time<span></span></div>
				<div id="ui-next-wave">Next wave in<span></span></div>
			</div>`
		}
		if ([map4, map5, map6].includes(game.map)) {
			game.players = 2
			game.player1Points = 0
			game.player2Points = 0
			ui = `
			<div class="game-ui">
				<div id="ui-player1">Player 1<span>0</span></div>
				<div id="ui-player2">Player 2<span>0</span></div>
				<div id="ui-time">Time<span>0</span></div>
			</div>`
		}
		document.body.innerHTML = `<canvas id="game"></canvas>${ui}`
		canvas = getElement("#game")
		context = canvas.getContext("2d")
		canvas.width = DIMENSION
		canvas.height = DIMENSION
		game.loadmap(game.map)
		game.objects.forEach((object) => {
			object.draw()
		})

		game.playing = true
		frame()
	},
	end: () => {
		game.playing = false
		if (game.players === 1) {
			if (game.score > parseInt(getHighscore()) || getHighscore() === null) {
				localStorage.setItem("highscore", game.score)
			}
		}
	},
	updateUi: () => {
		if (game.players === 1) {
			let paused = ""
			if (game.paused) {
				paused = " (paused)"
			}
			getElement("#ui-score span").innerText = game.score
			getElement("#ui-wave span").innerText = game.wave
			getElement("#ui-balls span").innerText = game.balls + "/" + game.algorithms.balls()
			getElement("#ui-next-wave span").innerText = Math.floor(game.nextWaveTimer)
			getElement("#ui-time span").innerText = Math.floor(game.time) + paused
		} else {
			getElement("#ui-player1 span").innerText = game.player1Points
			getElement("#ui-player2 span").innerText = game.player2Points
			getElement("#ui-time span").innerText = Math.floor(game.time)
		}
	},
	loadmap: (map) => {
		let players = 0
		for (let y = 0; y < map.length; y++) {
			let row = map[y]
			for (let x = 0; x < row.length; x++) {
				let square = row[x]
				let position = {
					x: x * BLOCKLENGTH,
					y: y * BLOCKLENGTH
				}
				if (square === "p") {
					player = new Player(playerList[players].texture, position.x, position.y, playerList[players].keys)
					game.objects.push(player)
					players++
				} else if (square === "g") {
					obstacle = new Obstacle(textures.obstacle.green, position.x, position.y, 0)
					game.objects.push(obstacle)
				} else if (square === "r") {
					obstacle = new Obstacle(textures.obstacle.red, position.x, position.y, 0)
					game.objects.push(obstacle)
				} else if (square === "y") {
					obstacle = new Obstacle(textures.obstacle.yellow, position.x, position.y, 5)
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
	collision: (collider) => {
		game.objects.forEach((object) => {
			// note: directions relative to collider; top is top of collider, bottom is bottom of collider, etc.
			// top
			if (collider.position.x > object.position.x - collider.width &&
				collider.position.x < object.position.x + object.width &&
				collider.position.y + collider.velocity.y > object.position.y + object.height - collider.height &&
				collider.position.y + collider.velocity.y < object.position.y + object.height) {
				if (collider.type === "player" && object.type === "obstacle") {
					collider.position.y = object.position.y + object.height
					collider.velocity.y = -collider.velocity.y * object.bounce
				}
				else if (collider.type === "ball" && object.type === "obstacle") {
					collider.velocity.y = -collider.velocity.y
					collider.collision = true
					if (Math.random() > 0.5) {
						if (Math.random() > 0.5) {
							collider.velocity.x = collider.speed
						} else {
							collider.velocity.x = collider.speed * 0.5
						}
					} else {
						if (Math.random() > 0.5) {
							collider.velocity.x = -collider.speed
						} else {
							collider.velocity.x = -collider.speed * 0.5
						}
					}
				}
				else if (collider.type === "player" && object.type === "ball") {
					if (collider.texture === textures.player.green && object.texture === textures.ball.red ||
						collider.texture === textures.player.red && object.texture === textures.ball.green) {
						collider.texture = textures.player.gray
						game.end()
					}
				}
			}
			// bottom
			else if (collider.position.x > object.position.x - collider.width &&
				collider.position.x < object.position.x + object.width &&
				collider.position.y + collider.velocity.y < object.position.y &&
				collider.position.y + collider.velocity.y > object.position.y - collider.height) {
				if (collider.type === "player" && object.type === "obstacle") {
					collider.position.y = object.position.y - collider.height
					collider.velocity.y = -collider.velocity.y * object.bounce
				}
				else if (collider.type === "ball" && object.type === "obstacle") {
					collider.velocity.y = -collider.velocity.y
					collider.collision = true
					if (Math.random() > 0.5) {
						if (Math.random() > 0.5) {
							collider.velocity.x = collider.speed
						} else {
							collider.velocity.x = collider.speed * 0.5
						}
					} else {
						if (Math.random() > 0.5) {
							collider.velocity.x = -collider.speed
						} else {
							collider.velocity.x = -collider.speed * 0.5
						}
					}
				}
				else if (collider.type === "player" && object.type === "ball") {
					if (collider.texture === textures.player.green && object.texture === textures.ball.red ||
						collider.texture === textures.player.red && object.texture === textures.ball.green) {
						collider.texture = textures.player.gray
						game.end()
					}
				}
			}
			// left
			if (collider.position.y > object.position.y - collider.height &&
				collider.position.y < object.position.y + object.height &&
				collider.position.x + collider.velocity.x > object.position.x + object.width - collider.width &&
				collider.position.x + collider.velocity.x < object.position.x + object.width) {
				if (collider.type === "player" && object.type === "obstacle") {
					collider.position.x = object.position.x + object.width
					collider.velocity.x = -collider.velocity.x * object.bounce
				}
				else if (collider.type === "ball" && object.type === "obstacle") {
					collider.velocity.x = -collider.velocity.x
					collider.collision = true
					if (Math.random() > 0.5) {
						if (Math.random() > 0.5) {
							collider.velocity.y = collider.speed
						} else {
							collider.velocity.y = collider.speed * 0.5
						}
					} else {
						if (Math.random() > 0.5) {
							collider.velocity.y = -collider.speed
						} else {
							collider.velocity.y = -collider.speed * 0.5
						}
					}
				}
				else if (collider.type === "player" && object.type === "ball") {
					if (collider.texture === textures.player.green && object.texture === textures.ball.red ||
						collider.texture === textures.player.red && object.texture === textures.ball.green) {
						collider.texture = textures.player.gray
						game.end()
					}
				}
			}
			// right
			else if (collider.position.y > object.position.y - collider.height &&
				collider.position.y < object.position.y + object.height &&
				collider.position.x + collider.velocity.x < object.position.x &&
				collider.position.x + collider.velocity.x > object.position.x - collider.width) {
				if (collider.type === "player" && object.type === "obstacle") {
					collider.position.x = object.position.x - collider.width
					collider.velocity.x = -collider.velocity.x * object.bounce
				}
				else if (collider.type === "ball" && object.type === "obstacle") {
					collider.velocity.x = -collider.velocity.x
					collider.collision = true
					if (Math.random() > 0.5) {
						if (Math.random() > 0.5) {
							collider.velocity.y = collider.speed
						} else {
							collider.velocity.y = collider.speed * 0.5
						}
					} else {
						if (Math.random() > 0.5) {
							collider.velocity.y = -collider.speed
						} else {
							collider.velocity.y = -collider.speed * 0.5
						}
					}
				}
				else if (collider.type === "player" && object.type === "ball") {
					if (collider.texture === textures.player.green && object.texture === textures.ball.red ||
						collider.texture === textures.player.red && object.texture === textures.ball.green) {
						collider.texture = textures.player.gray
						game.end()
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
		this.shootTimer = 0
		this.shooting = false
		this.keys = keys
		this.type = "player"
		this.bounce = 0
		this.ammo = undefined // define this maybe?
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
		if (this.shooting && this.shootTimer === 0 && game.balls < game.algorithms.balls() && (this.move.up || this.move.down || this.move.left || this.move.right)) {
			this.shoot()
			game.paused = false
			this.shootTimer++
			game.balls++
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
			x: x - this.width / 2,
			y: y - this.height / 2
		}
		this.speed = 10
		this.velocity = {
			x: this.speed * direction.x,
			y: this.speed * direction.y
		}
		this.collision = false
		this.bounces = 0
		this.type = "ball"
	}

	draw() {
		game.collision(this)

		if (this.collision) {
			this.collision = false
			this.bounces++

			if (game.players === 1) {
				if (this.bounces === 2) {
					if (this.texture === textures.ball.green) {
						this.texture = textures.ball.red
					} else if (this.texture === textures.ball.red) {
						this.texture = textures.ball.green
					}
				}
			} else {
				if (this.bounces === 10) {} // should destroy the ball
			}
		}

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

let fps = 60
let fpsInterval = 1000 / fps
let then, now, elapsed

function frame() {
	requestAnimationFrame(frame)
	
	if (then === undefined) {
		then = Date.now()
	}

	now = Date.now()
	elapsed = now - then

	if (elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval)

		if (game.playing) {
			if (game.balls === game.algorithms.balls()) {
				getElement("#ui-next-wave").style.display = "flex"
				game.nextWaveTimer -= 1 / fps
	
				if (game.nextWaveTimer < 0) {
					getElement("#ui-next-wave").style.display = "none"
					game.balls = 0
					game.wave++
	
					for (let i = 0; i < game.objects.length; i++) {
						if (game.objects[i].type === "ball") {
							game.objects.splice(i)
						}
					}
	
					game.nextWaveTimer = 10
					game.paused = true
				}
			}
	
			if (!game.paused) {
				game.score += game.algorithms.score()
				game.time += 1 / fps
			}
	
			game.render()
			game.updateUi()
		}
	}
}

/* ==================================================
	MAIN MENU
================================================== */

if (getHighscore() !== null) {
	getElement("#highscore").innerText = `Highscore: ${getHighscore()}`
}

const mapPreviews = document.querySelectorAll(".map-selection .map canvas")

document.body.onload = () => {
	for (let i = 0; i < mapPreviews.length; i++) {
		let players = 0
		let previewDimension = 1000
		let previewBlocklength = previewDimension / 16
	
		canvas = mapPreviews[i]
		canvas.width = previewDimension
		canvas.height = previewDimension
		context = canvas.getContext("2d")
	
		let map = mapList[i]
		for (let y = 0; y < map.length; y++) {
			let row = map[y]
			for (let x = 0; x < row.length; x++) {
				let square = row[x]
				let position = {
					x: x * previewBlocklength,
					y: y * previewBlocklength
				}
				if (square === "p") {
					context.drawImage(playerList[players].texture, position.x + previewBlocklength / 4, position.y + previewBlocklength / 4, previewBlocklength / 2, previewBlocklength / 2)
					players++
				}
				else if (square === "g") {
					context.drawImage(textures.obstacle.green, position.x, position.y, previewBlocklength, previewBlocklength)
				}
				else if (square === "r") {
					context.drawImage(textures.obstacle.red, position.x, position.y, previewBlocklength, previewBlocklength)
				}
				else if (square === "y") {
					context.drawImage(textures.obstacle.yellow, position.x, position.y, previewBlocklength, previewBlocklength)
				}
			}
		}
	}
}

// map selection
const maps = document.querySelectorAll(".map")
maps.forEach((map) => {
	map.onclick = () => {
		let choosenMap = parseInt(map.classList[1].split("map")[1]) - 1
		game.map = mapList[choosenMap]
		game.start()
	}
})

// main menu events
const buttonOnePlayer = getElement("button.one-player")
const buttonTwoPlayer = getElement("button.two-player")
const mapsOnePlayer = getElement(".map-selection.one-player")
const mapsTwoPlayer = getElement(".map-selection.two-player")
const imagePlayer1 = getElement(".player-image:first-of-type")
const imagePlayer2 = getElement(".player-image:last-of-type")

document.body.onclick = (event) => {
	// swap player textures
	if ([imagePlayer1, imagePlayer2].includes(event.target)) {
		let imagePlayer1Image = imagePlayer1.getAttribute("src")
		let imagePlayer2Image = imagePlayer2.getAttribute("src")

		imagePlayer1.src = imagePlayer2Image
		imagePlayer2.src = imagePlayer1Image

		let imagePlayer1Texture = player1.texture
		let imagePlayer2Texture = player2.texture

		player1.texture = imagePlayer2Texture
		player2.texture = imagePlayer1Texture
	}

	// removes active class from one player map selection
	if (![buttonOnePlayer, imagePlayer1, imagePlayer2].includes(event.target) && !mapsOnePlayer.contains(event.target)) {
		mapsOnePlayer.classList.remove("active")
	}

	// removes active class from two player map selection
	if (![buttonTwoPlayer, imagePlayer1, imagePlayer2].includes(event.target) && !mapsTwoPlayer.contains(event.target)) {
		mapsTwoPlayer.classList.remove("active")
	}
}

buttonOnePlayer.onclick = () => {
	mapsOnePlayer.classList.toggle("active")
}
buttonOnePlayer.onmouseover = () => {
	imagePlayer1.classList.add("active")
}
buttonOnePlayer.onmouseout = () => {
	imagePlayer1.classList.remove("active")
}

buttonTwoPlayer.onclick = () => {
	mapsTwoPlayer.classList.toggle("active")
}
buttonTwoPlayer.onmouseover = () => {
	imagePlayer1.classList.add("active")
	imagePlayer2.classList.add("active")
}
buttonTwoPlayer.onmouseout = () => {
	imagePlayer1.classList.remove("active")
	imagePlayer2.classList.remove("active")
}

// controls
const controlsBtn = getElement(".controls.btn")
const controlsContainer = getElement(".controls.container")

controlsBtn.onclick = () => {
	controlsBtn.classList.toggle("active")
	controlsContainer.classList.toggle("active")
}

controlsContainer.onclick = () => {
	controlsBtn.classList.remove("active")
	controlsContainer.classList.remove("active")
}

// info
const infoBtn = getElement(".info.btn")
const infoContainer = getElement(".info.container")

infoBtn.onclick = () => {
	infoBtn.classList.toggle("active")
	infoContainer.classList.toggle("active")
}

infoContainer.onclick = () => {
	infoBtn.classList.remove("active")
	infoContainer.classList.remove("active")
}
