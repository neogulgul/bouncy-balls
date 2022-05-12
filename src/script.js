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

function notice(text, choice1, choice2) {
	editor.notice = true
	getElement("#notice").style.display = "flex"
	getElement("#notice p").innerText = text
	getElement(".choice:first-child").innerText = choice1
	getElement(".choice:last-child").innerText = choice2 || ""
	if (getElement(".choice:last-child").innerText !== "") {
		getElement(".choice:last-child").style.display = "flex"
	}
}

function unnotice() {
	editor.notice = false
	getElement("#notice").style.display = "none"
	getElement(".choice:last-child").style.display = "none"
}

const textures = {
	player: {
		gray: getTexture("player_gray.svg"),
		green: getTexture("player_green.svg"),
		red: getTexture("player_red.svg")
	},
	ball: {
		green: getTexture("ball_green.svg"),
		red: getTexture("ball_red.svg")
	},
	obstacle: {
		green: getTexture("obstacle_green.svg"),
		red: getTexture("obstacle_red.svg"),
		white: getTexture("obstacle_white.svg"),
		yellow: getTexture("obstacle_yellow.svg")
	}
}

const editor = {
	selection: {
		type: "obstacle",
		color: "green"
	},
	players: 0,
	notice: false,
	erase: false,
	load: false,
	save: false,
	map: [
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "]
	]
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
		shoot: "enter"
	}
}

const playerList = [player1, player2]

/*
map creation:
	p => player
	g => green obstacle
	r => red obstacle
	w => white obstacle
	y => yellow obstacle
*/

const maps = {
	onePlayer: {
		"Playground": [
			["g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g"],
			["g"," "," "," ","g","g","g"," "," "," "," "," "," "," "," ","g"],
			["g"," ","p"," ","g","g","g"," "," "," "," "," "," "," "," ","g"],
			["g"," "," "," ","g","g","g"," "," "," "," "," "," "," "," ","g"],
			["g"," "," "," "," "," "," "," "," ","g","g"," ","g"," "," ","g"],
			["g"," "," "," "," "," "," "," ","g","g"," "," ","g","g"," ","g"],
			[" "," "," "," "," "," "," "," ","g","g"," ","g","g","g"," ","g"],
			[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
			[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
			[" "," "," ","g","g","g","g"," "," ","g","g","g","g"," "," ","g"],
			[" "," "," ","g","g","g","g"," "," "," "," "," "," "," "," ","g"],
			[" "," "," "," ","g","g","g"," "," "," "," "," "," "," "," ","g"],
			["g","g"," "," "," ","g","g"," "," ","g","g","g","g"," "," ","g"],
			["g","g","g"," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g","g","g","g"," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g"]
		],
		"Blood_Harbor": [
			["r","r","r","r","r","r","r","r","r","r","r","r","r","r","r","r"],
			["r"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","r"],
			["r"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","r"],
			["r"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","r"],
			["r"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","r"],
			["r"," "," "," "," "," "," ","w"," "," "," "," "," "," "," ","r"],
			["r"," "," "," "," "," "," "," ","w"," "," "," "," "," "," ","r"],
			["r"," "," "," "," "," "," "," ","w"," "," "," "," "," "," ","r"],
			["r"," "," "," "," "," "," "," ","w"," "," "," "," "," "," ","r"],
			["r"," "," "," "," "," "," ","w"," ","p"," "," "," "," "," ","r"],
			["r"," "," "," "," "," "," ","r"," "," "," "," ","r","r"," ","r"],
			["r"," ","r","r"," "," "," ","r"," "," ","r","r","r"," "," ","r"],
			["r"," "," ","r","r","r","r","r","r","r","r","r"," "," "," ","r"],
			["r"," "," "," ","r","r","r","r","r","r","r"," "," "," "," ","r"],
			["r"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","r"],
			["r","r","r","r","r","r","r","r","r","r","r","r","r","r","r","r"]
		],
		"Bouncy_Castle": [
			["y","y","y","y","y","y","y","y","y","y","y","y","y","y","y","y"],
			["y"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","y"],
			["y"," "," "," "," "," "," ","y","y"," "," "," "," "," "," ","y"],
			["y"," "," "," ","y","y","y"," "," ","y","y","y"," "," "," ","y"],
			["y"," "," ","y","y"," "," "," "," "," "," ","y","y"," "," ","y"],
			["y"," "," ","y"," "," "," "," "," "," "," "," ","y"," "," ","y"],
			["y"," "," ","y"," "," "," "," "," "," "," "," ","y"," "," ","y"],
			["y"," "," ","y"," "," "," "," "," "," "," "," ","y"," "," ","y"],
			["y"," "," ","y"," "," "," "," "," "," "," "," ","y"," "," ","y"],
			["y"," "," ","y"," "," "," "," "," "," "," "," ","y"," "," ","y"],
			["y"," "," ","y"," "," "," "," "," "," "," "," ","y"," "," ","y"],
			["y"," "," "," "," ","p"," "," "," "," "," "," "," "," "," ","y"],
			["y"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","y"],
			["y"," ","y","y","y","y","y","y","y","y","y","y","y","y"," ","y"],
			["y","y","y","y","y","y","y","y","y","y","y","y","y","y","y","y"],
			["y","y","y","y","y","y","y","y","y","y","y","y","y","y","y","y"]
		],
		"custom1": undefined
	},
	twoPlayer: {
		"Spaceship": [
			["g","g","g","g","g","g","g","g","r","r","r","r","r","r","r","r"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","r"],
			["g"," ","g","g","g"," "," "," "," "," "," ","r","r","r"," ","r"],
			["g","g","g"," "," ","g"," "," "," "," ","r"," "," ","r","r","r"],
			["g","g"," "," "," "," "," "," "," "," "," "," "," "," ","r","r"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","r"],
			["g"," ","g"," "," "," "," ","g","r"," "," "," "," ","r"," ","r"],
			["g"," ","g","p"," "," "," ","g","r"," "," "," ","p","r"," ","r"],
			["g"," ","g"," "," "," "," ","g","r"," "," "," "," ","r"," ","r"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","r"],
			["g","g"," "," "," "," "," "," "," "," "," "," "," "," ","r","r"],
			["g","g","g"," "," ","g"," "," "," "," ","r"," "," ","r","r","r"],
			["g"," ","g","g","g"," "," "," "," "," "," ","r","r","r"," ","r"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","r"],
			["g","g","g"," "," "," "," "," "," "," "," "," "," ","r","r","r"],
			["g","g","g","g","g","g","g","g","r","r","r","r","r","r","r","r"]
		],
		"Flowers": [
			["g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g"," ","p"," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["g"," "," ","r","r","r"," "," "," "," "," "," "," "," "," ","g"],
			["g"," "," ","r","w","r"," "," "," "," "," "," "," "," "," ","g"],
			["g"," "," ","r","r","r"," "," "," "," "," "," "," ","p"," ","g"],
			["g"," "," "," ","g"," "," "," "," "," "," "," "," "," "," ","g"],
			["g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g"]
		],
		"Playground_2": [
			["g","g","g","g","g"," "," "," "," "," "," "," "," ","r","r","r"],
			["g"," "," "," ","g"," "," "," ","r","r","r"," "," ","r","r","r"],
			["g"," "," "," "," "," "," "," "," "," "," "," "," ","r","p"," "],
			["g"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
			[" "," "," "," ","g"," "," "," "," "," "," "," "," ","r","r","r"],
			[" "," "," "," ","g"," "," "," "," "," "," "," "," ","r"," "," "],
			[" ","g","g","g","g"," "," ","y","y"," "," "," "," ","r"," "," "],
			[" "," "," "," "," "," "," ","y","y"," "," "," "," "," "," "," "],
			[" "," "," "," "," "," "," ","y","y"," "," "," "," "," "," "," "],
			[" "," ","r"," "," "," "," ","y","y"," "," ","g","g","g","g"," "],
			[" "," ","r"," "," "," "," "," "," "," "," ","g"," "," "," "," "],
			["r","r","r"," "," "," "," "," "," "," "," ","g"," "," "," "," "],
			[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			[" ","p","r"," "," "," "," "," "," "," "," "," "," "," "," ","g"],
			["r","r","r"," "," ","r","r","r"," "," "," ","g"," "," "," ","g"],
			["r","r","r"," "," "," "," "," "," "," "," ","g","g","g","g","g"]
		],
		"custom2": undefined
	}
}

let canvas, context, row, square, ui, player, ball, obstacle

const game = {
	started: false,
	playing: false,
	player1Points: 0,
	player2Points: 0,
	algorithms: {
		balls: () => {
			return 4 + 2 * (game.wave - 1)
		},
		score: () => {
			return 2 * game.wave
		}
	},
	start: () => {
		game.started = true
		game.objects = []
		game.players = 0
		game.time = 0
		game.balls = 0
		game.wave = 1
		game.score = 0
		game.nextWaveTimer = 10

		if (Object.keys(maps.onePlayer).includes(game.mapName)) {
			game.players = 1
			game.map = maps.onePlayer[game.mapName]
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
		else if (Object.keys(maps.twoPlayer).includes(game.mapName)) {
			game.players = 2
			game.map = maps.twoPlayer[game.mapName]
			ui = `
			<div class="game-ui">
				<div id="ui-player1">Player 1<span>0</span></div>
				<div id="ui-player2">Player 2<span>0</span></div>
				<div id="ui-time">Time<span>0</span></div>
			</div>`
		}
		document.body.innerHTML = `
		<svg class="home" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M20 20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9z"/></svg>
		<canvas id="game"></canvas>
		${ui}
		<div class="end menu">
			<h1></h1>
			<button class="home">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19z"/></svg>
			</button>
			<button id="restart">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M18.537 19.567A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 2.136-.67 4.116-1.81 5.74L17 12h3a8 8 0 1 0-2.46 5.772l.997 1.795z"/></svg>
			</button>
		</div>`
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
			getElement(".end.menu h1").innerText = `Score: ${game.score}`
		} else {
			for (let i = 0; i < game.objects.length; i++) {
				if (game.objects[i].type === "player" && game.objects[i].alive) {
					if (game.objects[i].keys === player1.keys) {
						game.player1Points++
						getElement(".end.menu h1").innerText = "Player1 Won"
					} else {
						game.player2Points++
						getElement(".end.menu h1").innerText = "Player2 Won"
					}
				}
			}
		}

		getElement(".end.menu").style.display = "flex"
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
			row = map[y]
			for (let x = 0; x < row.length; x++) {
				square = row[x]
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
				} else if (square === "w") {
					obstacle = new Obstacle(textures.obstacle.white, position.x, position.y, 1)
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
			row = game.map[y]
			for (let x = 0; x < row.length; x++) {
				square = row[x]
				let position = {
					x: x * BLOCKLENGTH,
					y: y * BLOCKLENGTH
				}
				if (["p", " "].includes(square)) {
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
	collision: (collider) => { // note: directions relative to collider; top is top of collider, bottom is bottom of collider, etc.
		// canvas collision
		// top
		if (collider.position.y + collider.velocity.y < 0) {
			if (collider.type === "player") {
				collider.position.y = 0
				collider.velocity.y = 0
			} else if (collider.type === "ball") {
				collider.bounce("vertical")
			}
		}
		// bottom
		else if (collider.position.y + collider.velocity.y > canvas.height - collider.height) {
			if (collider.type === "player") {
				collider.position.y = canvas.height - collider.height
				collider.velocity.y = 0
			} else if (collider.type === "ball") {
				collider.bounce("vertical")
			}
		}
		// left
		if (collider.position.x + collider.velocity.x < 0) {
			if (collider.type === "player") {
				collider.position.x = 0
				collider.velocity.x = 0
			} else if (collider.type === "ball") {
				collider.bounce("horizontal")
			}
		}
		// right
		else if (collider.position.x + collider.velocity.x > canvas.width - collider.width) {
			if (collider.type === "player") {
				collider.position.x = canvas.width - collider.width
				collider.velocity.x = 0
			} else if (collider.type === "ball") {
				collider.bounce("horizontal")
			}
		}

		// object collision
		game.objects.forEach((object) => {
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
					collider.bounce("vertical")
				}
				else if (collider.type === "player" && object.type === "ball") {
					if (collider.texture === textures.player.green && object.texture === textures.ball.red ||
						collider.texture === textures.player.red && object.texture === textures.ball.green) {
						collider.texture = textures.player.gray
						collider.alive = false
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
					collider.bounce("vertical")
				}
				else if (collider.type === "player" && object.type === "ball") {
					if (collider.texture === textures.player.green && object.texture === textures.ball.red ||
						collider.texture === textures.player.red && object.texture === textures.ball.green) {
						collider.texture = textures.player.gray
						collider.alive = false
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
					collider.bounce("horizontal")
				}
				else if (collider.type === "player" && object.type === "ball") {
					if (collider.texture === textures.player.green && object.texture === textures.ball.red ||
						collider.texture === textures.player.red && object.texture === textures.ball.green) {
						collider.texture = textures.player.gray
						collider.alive = false
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
					collider.bounce("horizontal")
				}
				else if (collider.type === "player" && object.type === "ball") {
					if (collider.texture === textures.player.green && object.texture === textures.ball.red ||
						collider.texture === textures.player.red && object.texture === textures.ball.green) {
						collider.texture = textures.player.gray
						collider.alive = false
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
		this.alive = true
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

		let ball = new Ball(ballTexture, this.position.x + this.width / 2, this.position.y + this.height / 2, direction, game.balls)
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
		if (this.shooting && this.shootTimer === 0 && !(game.players === 1 && game.balls >= game.algorithms.balls()) && (this.move.up || this.move.down || this.move.left || this.move.right)) {
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
	constructor(texture, x, y, direction, index) {
		this.texture = texture
		this.width = BLOCKLENGTH / 5
		this.height = BLOCKLENGTH / 5
		this.position = {
			x: x - this.width / 2,
			y: y - this.height / 2
		}
		this.speed = 10 + 1 * (game.wave - 1)
		this.velocity = {
			x: this.speed * direction.x,
			y: this.speed * direction.y
		}
		this.collision = false
		this.bounces = 0
		this.type = "ball"
		this.index = index
	}

	bounce(direction) {
		if (direction === "vertical") {
			this.velocity.y = -this.velocity.y
			this.collision = true
			if (Math.random() > 0.5) {
				if (Math.random() > 0.5) {
					this.velocity.x = this.speed
				} else {
					this.velocity.x = this.speed * 0.5
				}
			} else {
				if (Math.random() > 0.5) {
					this.velocity.x = -this.speed
				} else {
					this.velocity.x = -this.speed * 0.5
				}
			}
		}
		else if (direction === "horizontal") {
			this.velocity.x = -this.velocity.x
			this.collision = true
			if (Math.random() > 0.5) {
				if (Math.random() > 0.5) {
					this.velocity.y = this.speed
				} else {
					this.velocity.y = this.speed * 0.5
				}
			} else {
				if (Math.random() > 0.5) {
					this.velocity.y = -this.speed
				} else {
					this.velocity.y = -this.speed * 0.5
				}
			}
		}
	}

	draw() {
		game.collision(this)

		if (this.collision) {
			this.collision = false
			this.bounces++

			if (game.players === 1) {
				if (this.bounces === 2) { // changes color of ball
					if (this.texture === textures.ball.green) {
						this.texture = textures.ball.red
					} else if (this.texture === textures.ball.red) {
						this.texture = textures.ball.green
					}
				}
			} else {
				if (this.bounces === 10) { // removes ball
					for (let i = 0; i < game.objects.length; i++) {
						if (game.objects[i].index === this.index) {
							game.objects.splice(i, 1)
						}
					}
				}
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
	if (!game.playing) {
		return
	}
	let key = event.key.toLowerCase()
	game.objects.forEach((object) => {
		if (object.type === "player") {
			// move
			if (key === object.keys.move.up) {
				object.move.up = true
			}
			if (key === object.keys.move.down) {
				object.move.down = true
			}
			if (key === object.keys.move.left) {
				object.move.left = true
			}
			if (key === object.keys.move.right) {
				object.move.right = true
			}
			// shoot
			if (key === object.keys.shoot) {
				object.shooting = true
			}
		}
	})
}

document.onkeyup = (event) => {
	if (!game.playing) {
		return
	}
	let key = event.key.toLowerCase()
	game.objects.forEach((object) => {
		if (object.type === "player") {
			// move
			if (key === object.keys.move.up) {
				object.move.up = false
			}
			if (key === object.keys.move.down) {
				object.move.down = false
			}
			if (key === object.keys.move.left) {
				object.move.left = false
			}
			if (key === object.keys.move.right) {
				object.move.right = false
			}
			// shoot
			if (key === object.keys.shoot) {
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
			if (game.players === 1) {
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
			} else {
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

document.body.onload = () => {
	// check for custom maps
	if (localStorage.getItem("custom1") !== null) {
		maps.onePlayer.custom1 = JSON.parse(localStorage.getItem("custom1"))
	}
	
	if (localStorage.getItem("custom2") !== null) {
		maps.twoPlayer.custom2 = JSON.parse(localStorage.getItem("custom2"))
	}

	// map previews
	Object.keys(maps).forEach((mode) => { // note: these loops are divided because whenever an element is added to the DOM all canvases are cleared, so we make sure the canvas elements are all loaded before drawing to them
		// this loop creates the divs containing the previews
		Object.keys(maps[mode]).forEach((map) => {
			let mapArray = maps[mode][map]
			if (mapArray === undefined) {
				return
			}
			let amount
			if (mode === "onePlayer") {
				amount = "one"
			} else {
				amount = "two"
			}
			getElement(`.map-selection.${amount}-player`).innerHTML += `
			<div id='${map}' class="map">
				<h3>${map.replace("_", " ")}</h3>
				<canvas></canvas>
			</div>`
		})
		// this loop renders the previews
		Object.keys(maps[mode]).forEach((map) => {
			let mapArray = maps[mode][map]
			if (mapArray === undefined) {
				return
			}

			// rendering preview
			let players = 0
			let previewDimension = 1000
			let previewBlocklength = previewDimension / 16

			canvas = getElement(`#${map} canvas`)
			canvas.width = previewDimension
			canvas.height = previewDimension
			context = canvas.getContext("2d")

			for (let y = 0; y < mapArray.length; y++) {
				row = mapArray[y]
				for (let x = 0; x < row.length; x++) {
					square = row[x]
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
					else if (square === "w") {
						context.drawImage(textures.obstacle.white, position.x, position.y, previewBlocklength, previewBlocklength)
					}
					else if (square === "y") {
						context.drawImage(textures.obstacle.yellow, position.x, position.y, previewBlocklength, previewBlocklength)
					}
				}
			}
		})
	})

	// creating tiles for tile selection
	Object.keys(textures.obstacle).forEach((obstacle) => {
		let selected = ""
		if (obstacle === editor.selection.color) {
			selected = " selected"
		}
		getElement("#tile-selection").innerHTML += `<img id="obstacle_${obstacle}" class="tile ${selected}" src="./textures/obstacle_${obstacle}.svg">`
	})
	getElement("#tile-selection").innerHTML += `<img id="player_white" class="tile" src="./textures/player_white.svg">`

	// creating grid for map making
	let size = 16
	for (let y = 0; y < size; y++) {
		getElement("#tile-grid").innerHTML += `<div class="row"></div>`
		for (let x = 0; x < size; x++) {
			getElement(`#tile-grid .row:nth-child(${y + 1})`).innerHTML += `<div id="x${x}y${y}" class="tile"></div>`
		}
	}
}

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

	if (game.started) {
		// home
		if (event.target.classList === "home" || event.target.closest(".home")) {
			location.reload()
		}
		// restart
		else if (getElement("#restart").contains(event.target)) {
			game.start()
		}
	} else if (!editor.notice) {
		// map selection
		if (event.target.classList.contains("map") || event.target.closest(".map")) {
			game.mapName = event.target.id || event.target.closest(".map").id
			game.start()
			return
		}

		// change tile selection
		if (getElement("#tile-selection").contains(event.target) && event.target.classList.contains("tile")) {
			if (editor.erase) {
				getElement("#erase").classList.remove("active")
				editor.erase = false
			}
			let type = event.target.id.split("_")[0]
			let color = event.target.id.split("_")[1]
			if (color !== editor.selection) {
				getElement(".tile.selected").classList.remove("selected")
				getElement(`#${type}_${color}`).classList.add("selected")
				editor.selection.type = type
				editor.selection.color = color
			}
		}

		// place tiles on grid
		if (getElement("#tile-grid").contains(event.target) && event.target.classList.contains("tile")) {
			let coordinate = event.target.id
			let x = coordinate.split("y")[0].split("x")[1]
			let y = coordinate.split("y")[1]
			if (event.target.classList.contains("player")) {
				editor.players--
			}
			if (editor.erase) {
				editor.map[y][x] = " "
				event.target.outerHTML = `<div id="${coordinate}" class="tile"></div>`
			} else {
				if (editor.selection.type === "player") {
					event.target.outerHTML = `<img id="${coordinate}" class="tile player" src="./textures/player_${editor.selection.color}.svg">`
					editor.map[y][x] = "p"
					editor.players++
				} else {
					event.target.outerHTML = `<img id="${coordinate}" class="tile" src="./textures/obstacle_${editor.selection.color}.svg">`
					editor.map[y][x] = editor.selection.color[0]
				}
			}
		}

		// erase
		if (getElement("#erase").contains(event.target)) {
			getElement("#erase").classList.toggle("active")
			if (!editor.erase) {
				editor.erase = true
			} else {
				editor.erase = false
			}
		}

		// copy
		if (getElement("#copy").contains(event.target)) {
			notice("Copied to clipboard.", "Cool.")
			navigator.clipboard.writeText(JSON.stringify(editor.map))
		}

		// load
		if (getElement("#load").contains(event.target)) {
			notice("Which map to load?", "custom1", "custom2")
		}

		// save
		if (getElement("#save").contains(event.target)) {
			if (editor.players === 0 || editor.players > 2) {
				let message
				if (editor.players === 0) {
					message = "Your map needs to contain at least one player."
				} else {
					message = "Your map can not have more than two players."
				}
				notice(message, "I got it!")
			} else {
				if (editor.players === 1) {
					localStorage.setItem("custom1", JSON.stringify(editor.map))
				} else {
					localStorage.setItem("custom2", JSON.stringify(editor.map))
				}
				editor.save = true
				notice("Your map was succesfully saved!", "Nice!")
			}
		}

		// delete
		if (getElement("#delete").contains(event.target)) {
			editor.players = 0
			for (let y = 0; y < editor.map.length; y++) {
				row = editor.map[y]
				for (let x = 0; x < row.length; x++) {
					square = row[x]
					square = " "
				}
			}

			document.querySelectorAll("#tile-grid .row .tile").forEach((tile) => {
				let coordinate = tile.id
				tile.outerHTML = `<div id="${coordinate}" class="tile"></div>`
			})
		}
	} else {
		if (getElement(".choice:first-child").contains(event.target) || getElement(".choice:last-child").contains(event.target)) {
			if (editor.save) {
				location.reload()
			} else if (getComputedStyle(getElement(".choice:last-child")).display === "flex") {
				unnotice()
				if (getElement(".choice:first-child").contains(event.target) && localStorage.getItem("custom1") !== null) {
					editor.map = maps.onePlayer.custom1
					editor.players = 1
					editor.load = true
				} else if (getElement(".choice:last-child").contains(event.target) && localStorage.getItem("custom2") !== null) {
					editor.map = maps.twoPlayer.custom2
					editor.players = 2
					editor.load = true
				}
				if (editor.load) {
					editor.load = false
					for (let y = 0; y < editor.map.length; y++) {
						row = editor.map[y]
						for (let x = 0; x < row.length; x++) {
							square = row[x]
							let tile = getElement(`#x${x}y${y}`)
							let coordinate = tile.id
							if (square === "p") {
								tile.outerHTML = `<img id="${coordinate}" class="tile player" src="./textures/player_white.svg">`
							} else if (square === "g") {
								tile.outerHTML = `<img id="${coordinate}" class="tile" src="./textures/obstacle_green.svg">`
							} else if (square === "r") {
								tile.outerHTML = `<img id="${coordinate}" class="tile" src="./textures/obstacle_red.svg">`
							} else if (square === "w") {
								tile.outerHTML = `<img id="${coordinate}" class="tile" src="./textures/obstacle_white.svg">`
							} else if (square === "y") {
								tile.outerHTML = `<img id="${coordinate}" class="tile" src="./textures/obstacle_yellow.svg">`
							}
						}
					}
				} else {
					notice("Could not find map.", ":(")
				}
			} else {
				unnotice()
			}
		}
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
const controlsMenu = getElement(".controls.menu")

controlsBtn.onclick = () => {
	controlsBtn.classList.toggle("active")
	controlsMenu.classList.toggle("active")
}

controlsMenu.onclick = () => {
	controlsBtn.classList.remove("active")
	controlsMenu.classList.remove("active")
}

// info
const infoBtn = getElement(".info.btn")
const infoMenu = getElement(".info.menu")

infoBtn.onclick = () => {
	infoBtn.classList.toggle("active")
	infoMenu.classList.toggle("active")
}

infoMenu.onclick = () => {
	infoBtn.classList.remove("active")
	infoMenu.classList.remove("active")
}

// edit
const editBtn = getElement(".edit.btn")
const editMenu = getElement(".edit.menu")

editBtn.onclick = () => {
	editBtn.classList.toggle("active")
	editMenu.classList.toggle("active")
}

editMenu.onclick = (event) => {
	if (getElement("#tile-selection").contains(event.target) || getElement("#tile-grid").contains(event.target) || getElement("#tile-buttons").contains(event.target) || getElement("#notice").contains(event.target)) {
		return
	}
	editBtn.classList.remove("active")
	editMenu.classList.remove("active")
}
