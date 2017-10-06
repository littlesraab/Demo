//玩家的模板
var player = function (name, symbol) {
	this.point = 0;
	this.name = name;
	this.symbol = symbol;
	this.cells = {};
};
//玩家选择方格时的动作
player.prototype.chooseCell = function (index) {	
	//在格子中加上标志和改写其是否能加上标志
	document.getElementsByClassName("cell")[index - 1].innerHTML = this.symbol; 
	this.cells[index - 1] = true;
};
//计分板对象
var scoreBoard = {
	elements: document.getElementsByClassName("score"),
	//更新计分板
	update: function(score) {
		this.elements[0].innerHTML = score.player1;
		this.elements[1].innerHTML = score.player2;
	}
};
//中介者
var mediator = {
	//玩家列表
	players: {},
	//玩家顺序
	firstPlayer: 1,
	//剩余格子数
	stepNumber: 0,
	//格子是否能被选中
	cellArr:[false, false, false, false, false, false, false, false, false],
	//正行动的玩家
	nowPlayer: "none",
	//初始化游戏
	setupGame: function() {
		if(this.firstPlayer === 1) {
			this.players.player1 = new player("player1", "X");
			this.players.player2 = new player("player2", "O");
		}else {
			this.players.player1 = new player("player1", "O");
			this.players.player2 = new player("player2", "X");				
		};

		document.getElementsByClassName("name")[0].innerHTML = this.players.player1.name;
		document.getElementsByClassName("name")[1].innerHTML = this.players.player2.name;
		this.nowPlayer = "player1";
		this.cellArr = [true, true, true, true, true, true, true, true, true];
		this.stepNumber = 0;
		//显示分数
		mediator.updateScore();
	},
	//计分板更新分数
	updateScore: function() {
		score = {
			player1: this.players.player1.point,
			player2: this.players.player2.point
		};
		scoreBoard.update(score);
	},
	//玩家行动后更换玩家且检测结果
	playGame: function(index, targetPlayer) {
		var startBtn = document.getElementsByClassName("startBtn")[0],
			resetBtn = document.getElementsByClassName("resetBtn")[0];

		mediator.cellArr[index - 1] = false;
		mediator.stepNumber += 1;
		mediator.players[targetPlayer].chooseCell(index);

		if(mediator.checkWinner(mediator.players[targetPlayer]) === true) {
			mediator.cellArr = [false, false, false, false, false, false, false, false, false];
			mediator.players[targetPlayer].point += 1;
			mediator.updateScore();

			startBtn.disabled = false;
			resetBtn.disabled = false;
		}else if(mediator.checkWinner(mediator.players[targetPlayer]) === 9) {
			mediator.updateScore();

			startBtn.disabled = false;
			resetBtn.disabled = false;
		};
		mediator.nowPlayer === "player2" ? mediator.nowPlayer = "player1" : mediator.nowPlayer = "player2";
	},
	//检测结果
	checkWinner: function (player) {		
		switch(true) {
			case ((player.cells[0] && player.cells[1] && player.cells[2]) || (player.cells[3] && player.cells[4] && player.cells[5])):
				return true;
			case ((player.cells[6] && player.cells[7] && player.cells[8]) || (player.cells[0] && player.cells[3] && player.cells[6])):
				return true;
			case ((player.cells[1] && player.cells[4] && player.cells[7]) || (player.cells[2] && player.cells[5] && player.cells[8])):
				return true;
			case ((player.cells[0] && player.cells[4] && player.cells[8]) || (player.cells[2] && player.cells[4] && player.cells[6])):
				return true;
			case (mediator.stepNumber === 9):
			 	return 9;
			default:
				return false;
		};
	},
	//绑定按钮事件
	btnEvent: function() {
		var cells = document.getElementsByClassName("cell"),
			startBtn = document.getElementsByClassName("startBtn")[0],
			sureBtn = document.getElementsByClassName("sureBtn")[0],
			resetBtn = document.getElementsByClassName("resetBtn")[0],
			darkenPage = document.getElementsByClassName("darken")[0],
			firstPlayerBtns = document.getElementsByClassName("firstPlayer")[0].getElementsByTagName("button"),
			controller = document.getElementsByClassName("ctrl")[0];
			darken = document.getElementsByClassName("darken")[0],
			ctrl = document.getElementsByClassName("ctrl")[0];

		//每个格子绑定点击事件
		for(var i = 0; i < cells.length;i += 1) {
			cells[i].onclick = function() {
				var index = this.getAttribute("index");

				mediator.cellArr[index - 1] === true ? mediator.playGame(index, mediator.players[mediator.nowPlayer].name) : true;
			};
		};

		startBtn.onclick = function() {
			darken.style.display = "block";
			ctrl.style.display = "block";
		};

		resetBtn.onclick = function() {
			mediator.players = {};
			mediator.firstPlayer = 1;
			mediator.nowPlayer = "none";
			startBtn.innerHTML = "开始";

			startBtn.onclick = function() {
				darken.style.display = "block";
				ctrl.style.display = "block";
			};
		};
		//选定玩家顺序
		firstPlayerBtns[0].onclick = function() {
			mediator.firstPlayer = 1;
			startBtn.innerHTML = "下一盘";

			startBtn.onclick = function() {
				for(var i = 0;i < cells.length; i += 1) {
					cells[i].innerHTML = "";
				};
				mediator.players.player1.cells = {};
				mediator.players.player2.cells = {};

				mediator.cellArr = [true, true, true, true, true, true, true, true, true];
				this.disabled = true;
				resetBtn.disabled = true;
			};

			for(var i = 0;i < cells.length; i += 1) {
				cells[i].innerHTML = "";
			};
			//初始化游戏
			mediator.setupGame();
			darkenPage.style.display = "none";
			controller.style.display = "none";

			startBtn.disabled = true;
			resetBtn.disabled = true;	
		};

		firstPlayerBtns[1].onclick = function() {
			mediator.firstPlayer = 2;
			startBtn.innerHTML = "下一盘";

			startBtn.onclick = function() {
				for(var i = 0;i < cells.length; i += 1) {
					cells[i].innerHTML = "";
				};
				mediator.players.player1.cells = {};
				mediator.players.player2.cells = {};

				mediator.cellArr = [true, true, true, true, true, true, true, true, true];
				this.disabled = true;
				resetBtn.disabled = true;
			};

			for(var i = 0;i < cells.length; i += 1) {
				cells[i].innerHTML = "";
			};
			//初始化游戏
			mediator.setupGame();
			darkenPage.style.display = "none";
			controller.style.display = "none";

			startBtn.disabled = true;
			resetBtn.disabled = true;
		};
	}
};

mediator.btnEvent();
