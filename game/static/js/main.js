const playButton = document.querySelector("#play");
const statusDiv = document.querySelector(".battlefield-status");
const actionBarStart = document.querySelector("#action-bar-start");
const actionBarGame = document.querySelector("#action-bar-game");
const againButton = document.querySelector("#again");
const gaveupButton = document.querySelector("#gaveup");
const chat = document.querySelector(".chat");
const chatInput = document.querySelector(".chat-input")
const chatMessages = document.querySelector(".chat-messages")

const player = new Battlefield();
const opponent = new Battlefield();

document.querySelector(".player").append(player.root);
document.querySelector(".opponent").append(opponent.root);

let gameStatus = "";
let ownTurn = true;
let partyId = "";

//создать подключение
let socket = new WebSocket("ws://localhost:8000/ws/game/");

//соединение установлено
socket.onopen = function () {
	console.log("Соединение установлено");
}

//соединение закрыто
socket.onclose = function (event) {
	if (event.wasClean) {
		console.log("Соединение закрыто чисто");
	} else {
		console.log("Обрыв соединения");
	}
}

//обработчик ошибок
socket.onerror = function (error) {
	console.log("Ошибка: " + error.message)
}

//обработчик сообщений
socket.onmessage = function (event) {
	let data = JSON.parse(event.data);
	if (data["event"] === "connectOpponent") {
		connectOpponent(data);
	} else if (data["event"] === "play") {
		play(data);
	} else if (data["event"] === "player_shot") {
		playerShot(data);
	} else if (data["event"] === "opponent_shot") {
		opponentShot(data);
	} else if (data["event"] === "game_over") {
		gameOver(data);
	} else if (data["event"] === "chat_message") {
		chatMessage(data["messages"]);
	}
}

playButton.onclick = function () {
	//отправить сообщение
	socket.send(JSON.stringify({
		"event": "finding",
		"party_id": localStorage.getItem("party_id"),
		"name": localStorage.getItem("name")
	}));
	gameStatus = "finding";
	statusUpdate();
	actionBarStart.classList.add("hidden");
	actionBarGame.classList.remove("hidden");
	againButton.classList.add("hidden");
	gaveupButton.classList.add("hidden");
}

againButton.onclick = function () {
	chat.classList.add("hidden");
	//отправить сообщение
	socket.send(JSON.stringify({
		"event": "finding",
		"party_id": null,
		"name": ""
	}));
	gameStatus = "finding";
	statusUpdate();
	againButton.classList.add("hidden");
	gaveupButton.classList.add("hidden");
	player.clear();
	opponent.clear();
}

gaveupButton.onclick = function () {
	//отправить сообщение
	socket.send(JSON.stringify({
		"event": "gaveup",
	}));
	againButton.classList.remove("hidden");
	gaveupButton.classList.add("hidden");
}

chatInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter" && chatInput.value) {
		let message = chatInput.value;
		chatInput.value = "";
		socket.send(JSON.stringify({
			"event": "chat_message",
			"message": message
		}));
	}
})

function statusUpdate() {
	if (!gameStatus) {
		statusDiv.textContent = "";
	} else if (gameStatus === "finding") {
		statusDiv.textContent = "Поиск случайного соперника";
	} else if (gameStatus === "play") {
		statusDiv.textContent = ownTurn ? "Ваш ход" : "Ход соперника";
	} else if (gameStatus === "winner") {
		statusDiv.textContent = "Вы победили";
	} else if (gameStatus === "loser") {
		statusDiv.textContent = "Вы проиграли";
	}
}

opponent.root.onclick = function (e) {
	if (gameStatus == "play" && ownTurn) {
		let item = e.target;
		if (item.hasAttribute('data-x') || item.hasAttribute('data-y')) {
			let x = item.getAttribute('data-x');
			let y = item.getAttribute('data-y');
			socket.send(JSON.stringify({
				"event": "shot",
				"x": x,
				"y": y
			}));
		}
	}
}

function connectOpponent(data) {
	localStorage.setItem("party_id", data["party_id"]);
	localStorage.setItem("name", data["name"]);
	socket.send(JSON.stringify({
		"event": "play"
	}));
}

function play(data) {
	player.setShips(data["ships"]);
	for (let shot of data["player_shots"]) {
		opponent.addShot(shot["x"], shot["y"], shot["variant"]);
	}
	for (let shot of data["opponent_shots"]) {
		player.addShot(shot["x"], shot["y"], shot["variant"]);
	}
	ownTurn = data["turn"]
	chatMessage(data["messages"])
	gameStatus = "play";
	statusUpdate();
	gaveupButton.classList.remove("hidden");
	chat.classList.remove("hidden");
}

function playerShot(data) {
	for (let shot of data["shots"]) {
		opponent.addShot(shot["x"], shot["y"], shot["variant"]);
	}
	ownTurn = data["turn"]
	statusUpdate();
}

function opponentShot(data) {
	for (let shot of data["shots"]) {
		player.addShot(shot["x"], shot["y"], shot["variant"]);
	}
	ownTurn = data["turn"]
	statusUpdate();
}

function gameOver(data) {
	gameStatus = data["status"];
	statusUpdate();
	gaveupButton.classList.add("hidden");
	againButton.classList.remove("hidden");
}

function chatMessage(messages) {
	chatMessages.textContent = "";
	for (let message of messages) {
		const div = document.createElement("div");
		div.classList.add("chat-message");
		div.textContent = message;
		chatMessages.insertBefore(div, chatMessages.firstElementChild);
	}
}
