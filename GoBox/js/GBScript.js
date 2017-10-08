var goBox;

//用闭包来组成单例，保证只有一个实例
(function() {
	//私有变量
	var instance;

	goBox = function() {
		if(instance) {
			return instance;
		};
		//设定实例的属性
		instance = this;
		this.container = document.getElementById("main");
		this.box = document.createElement("span");
		this.direction = 0;
		this.bLeft = 0;
		this.bTop = 0;
		this.messageList = ["GO", "TAR LEF", "TAR RIG", "TAR TOP", "TAR BOT", "MOV LEF", "MOV RIG", "MOV TOP", "MOV BOT", "TUN LEF", "TUN RIG", "TUN BAC"];
	};	
}());

//初始化的方法
goBox.prototype.init = function() {
	var controller = document.getElementById("controller"),
		texts,
		//固定好this
		instance = this;
	//生成box及其容器
	instance.buildBox();
	instance.targets = instance.container.getElementsByTagName("li");
	
	document.getElementById("startBtn").onclick = function() {
		//处理好信息和生成时钟来循环执行命令
		var number = 0;
		texts = controller.value.split("\n");
		var int = setInterval(function() {
			if(texts.length <= 0) {
				int = clearInterval(int);
			}else{
				var text = texts.shift();
				number += 1;
				if(instance.checkInfo(text.split(" "), number)) {
					var message = text.split(" ");
					//判断命令
					if(message[0] === "GO") {
						message.length === 1 ? message[1] = 1 : message;
						instance.goMove(message[1], instance.direction, instance, number);
					}else if(message[0] === "TUN") {
						instance.tunMove(message, "TUN", instance, number);
					}else if(message[0] === "TAR") {
						message.length === 2 ? message[2] = 1 : message;
						instance.goMove(message[2], message[1], instance, number);
					}else if(message[0] === "MOV") {
						message.length === 2 ? message[2] = 1 : message;
						instance.tunMove(message, "MOV", instance, number);
						instance.goMove(message[2], message[1], instance, number);
					};
				};
			};							
		},1000);
	};

	//绑定其他事件
	document.getElementById("clearBtn").onclick = function() {
		controller.value = "";
	};

	document.getElementById("addBlockBtn").onclick = function() {
		instance.addBlock();
	};
};

//生成box的容器和其位置
goBox.prototype.buildBox = function() {
	var oli,
		row = document.getElementsByClassName("row")[0],
		col = document.getElementsByClassName("col")[0];

	for(var i = 1;i <=10; i+=1) {
		row.innerHTML = row.innerHTML + ("<li>" + i + "</li>");
		col.innerHTML = col.innerHTML + ("<li>" + i + "</li");
	};

	for(i = 0;i < 100;i += 1) {
		oli = document.createElement("li");
		this.container.appendChild(oli);
	};

	this.container.appendChild(this.box);
	this.box.className = "box";
	//设定BOX的CSS
	this.box.style.left = 50 * (parseInt(Math.random() * 9 + 1)) + "px";
	this.box.style.top = 50 * (parseInt(Math.random() * 9 + 1)) + "px";

	this.bLeft = parseInt(this.box.style.left);
	this.bTop = parseInt(this.box.style.top);
};

//生成障碍
goBox.prototype.addBlock = function() {
	var index = parseInt(Math.random() * 99 + 1),
		target = this.targets[index];
	
	if(target.className === "blocked" || ((this.bLeft / 50) * 10 + (this.bTop / 50)) === index) {
		incetance.addBlock();
	}else {
		target.className = "blocked";
	};
};

//检测输入的命令是否和要求
goBox.prototype.checkInfo = function(message, number) {
	//判断命令长度是否合要求
	if(message[0] === "GO" || message[0] === "TUN") {
		message.length >= 2 ? message.length = 2 : message;
	}else {
		message.length >= 3 ? message.length = 3 : message;
	};

	message = message.join(" ");
	//判断命令是否合要求
	for(var i = 0;i < this.messageList.length; i += 1) {
		if(message === this.messageList[i]) {
			return true;
		}else {
			alert("There is something wrong with the" + number + "message");
			clearInterval(int);
			return false;
		};
	};

	return false;
};

//检测box的前进方向是否有障碍
goBox.prototype.isBlocked = function(direction, instance) {
	var index;
	//判断方向
	switch (direction) {
		case "TOP":
			index = 10 * (instance.bTop / 50 - 1) + (instance.bLeft / 50);
			break;
		case "RIG":
			index = 10 * (instance.bTop / 50) + (instance.bLeft / 50 + 1);
			break;
		case "LEF":
			index = 10 * (instance.bTop / 50) + (instance.bLeft / 50 - 1);
			break;
		case "BOT":
			index = 10 * (instance.bTop / 50 + 1) + (instance.bLeft / 50);
			break;
	};

	if(instance.targets[index].className === "blocked"){
		return false;
	}else {
		return true;
	};
};

//box的移动动作
goBox.prototype.goMove = function(messageLength, targetDirection, instance) {
	//转化方向
	targetDirection === 0 ? targetDirection = "TOP" : targetDirection;
	targetDirection === 1 ? targetDirection = "LEF" : targetDirection;
	targetDirection === 2 ? targetDirection = "BOT" : targetDirection;
	targetDirection === 3 ? targetDirection = "RIG" : targetDirection;
	//改变box的CSS
	for(var i = 0;i < messageLength; i += 1) {
		if(instance.isBlocked(targetDirection, instance)) {
			switch (targetDirection) {
				case "TOP":
					instance.bTop -= 50;
					break;
				case "LEF":
					instance.bLeft -= 50;
					break;
				case "BOT":
					instance.bTop += 50;
					break;
				case "RIG":
					instance.bLeft += 50;
					break;
			};
			instance.bTop < 0 ? instance.bTop = 0 : instance.bTop;
			instance.bLeft < 0 ? instance.bLeft = 0 : instance.bLeft;
			instance.Top > 450 ? instance.bTop = 450 : instance.bTop;
			instance.bLeft > 450 ? instance.bLeft = 450 : instance.bLeft;
			//设定CSS
			instance.box.style.left = instance.bLeft + "px";
			instance.box.style.top = instance.bTop + "px";	
		};			
	};
};
//box的转向动作
goBox.prototype.tunMove = function(message, type, instance, number) {
	//分不同的转动类型
	if(type === "TUN") {
		switch (message[1]) {
			case "LEF":
				instance.direction -= 1;
				break;
			case "RIG":
				instance.direction += 1;
				break;
			case "BAC":
				instance.direction += 2;
				break;
		};
	}else {
		switch(message[1]) {
			case "TOP":
				instance.direction = 0;
				break;
			case "LEF":
				instance.direction = -1;
				break;
			case "BOT":
				instance.direction = 2;
				break;
			case "RIG":
				instance.direction = 1;
				break;
		};
	};
	//设定box的CSS
	instance.box.style.WebkitTransform = "rotate(" + (instance.direction * 90) + "deg)";
	instance.direction === 4 ? instance.direction = 0 : instance.direction;
	instance.direction === 5 ? instance.direction = 1 : instance.direction;
	instance.direction === -1 ? instance.direction = 3 : instance.direction;
};

//生成box实例并运行init方法
var myBox = new goBox();
myBox.init();