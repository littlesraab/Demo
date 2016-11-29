(function() {
	var inner = document.getElementById('inner'),
		prev = document.getElementById('prev'),
		next = document.getElementById('next'),
		container = document.getElementById("container"),
		buttons = document.getElementById("buttons").getElementsByTagName("span"),
		timer,index = 0;

		inner.style.left = -101 + "%";
		container.style.width = Math.floor(0.80 * document.documentElement.clientWidth) + "px";
		container.style.height = Math.floor(0.80 * (document.documentElement.clientWidth / 1.78)) + "px";

	var move = function(old) {
		var newLeft = parseInt(inner.style.left) + old;

		if(newLeft > -100) {			 
			inner.style.left = -500 + "%";			 
		}else if(newLeft < -500) {			 
			inner.style.left = -100 +"%";			
		}else{			 
			inner.style.left = newLeft + '%';			
		}
	};

	var on = function() {
		timer = setInterval(function() {
			next.onclick()
		},2700);
	}

	var off = function() {
		clearInterval(timer);
	}

	var change = function() {
		for(var i = 0;i < buttons.length;i++) {
			if(buttons[i].className === "on") {
				buttons[i].className = "";
			}
		}

		buttons[index].className = "on";
	}

	for(var j = 0;j < buttons.length;j++) {
		(function(k) {
			buttons[k].onclick = function() {
				for (var a = 0;a < buttons.length;a++) {
					if(buttons[a].className === "on") {
						buttons[a].className = "";
					}
				}
			var distant = 100 * (k - a);
			move(distant);
			index = k;
			buttons[k].className = "on";
			}		
		}(j))
	}
	

	prev.onclick = function() {             
		move(100);

		index -= 1;
		if(index < 0) {
			index = 4;
		};

		change();
	}

	next.onclick = function() {  
		move(-100);

		index += 1;
		if(index > 4) {
			index = 0;
		};

		change();
	}

	container.onmouseenter = function() {
		off();
	}

	prev.onmouseenter = function() {
		off();
	}

	next.onmouseenter = function() {
		off();
	}

	container.onmouseleave = function() {
		on();
	}

	window.onresize = function() {
		container.style.width = Math.floor(0.80 * document.documentElement.clientWidth) + "px";
		container.style.height = Math.floor(0.80 * (document.documentElement.clientWidth / 1.78)) + "px";
	}

	on();
})();