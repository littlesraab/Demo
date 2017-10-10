var waterfall;
//保证单例
(function () {
	var instance;
	
	waterfall = function(container, pictureData) {
		if(instance) {
			return instance;
		};

		instance = this;
		this.container = container;
		this.pictureData = pictureData;
	};
}());
//判断是否要加载图片
waterfall.prototype.checkScrollSide = function() {
	var pins = document.getElementsByClassName("pin"),
		lastPinHeight = pins[pins.length - 1].offsetTop + Math.floor(pins[pins.length - 1].offsetHeight / 2.5),
		//document的垂直偏移和可见区域高度
		documentScrollTop = document.documentElement.scrollTop || document.body.scrollTop,
		documentHeight = document.documentElement.clientHeight;

	return lastPinHeight < documentScrollTop + documentHeight;
};
//判断最小高度的那一列
waterfall.prototype.getMinIndex = function(arr, min) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] === min) {
			return i;
		};
	};
};
//加入图片的方法
waterfall.prototype.addPicture = function(instance, isSet) {
	var pins = document.getElementsByClassName("pin"),
		pinWidth = pins[0].offsetWidth,
		documentWidth = document.documentElement.clientWidth,
		//图片列数
		pinNum = Math.floor(documentWidth / pinWidth),		
		pinsHeight = [], pinHeight, minHeight, minHeightIndex;
	//设置容器居中	
	if(isSet) {
		instance.container.style.width = pinNum * pinWidth + "px";
		instance.container.style.marginLeft = Math.floor((documentWidth - parseInt(instance.container.style.width)) / 2) + "px";
	};
	//判断位于最下方的图片的高度
	for(var i = 0; i < pins.length; i++) {
		pinHeight = pins[i].offsetHeight;
		if(i < pinNum) {
			pinsHeight[i] = pinHeight;
		}else {
			minHeight = Math.min.apply(null, pinsHeight);
			minHeightIndex = instance.getMinIndex(pinsHeight, minHeight);
			pins[i].style.position = "absolute";
			pins[i].style.top = minHeight + "px";
			pins[i].style.left = minHeightIndex * pinWidth + "px";
			pinsHeight[minHeightIndex] += pins[i].offsetHeight;
		};
	};
};
//滚动过程不断加入图片的方法
waterfall.prototype.activeAddPicture = function(instance) {
	var newPin, newBox, newImg;
	window.onscroll = function() {
		if(instance.checkScrollSide()) {	
			for(var i = 0; i < instance.pictureData.length; i++) {
				newPin = document.createElement("div");
				newPin.className = "pin";

				newBox = document.createElement("div");
				newBox.className = "box";

				newImg = document.createElement("img");
				newImg.src = instance.pictureData[i]['src'];

				newBox.appendChild(newImg);
				newPin.appendChild(newBox);
				instance.container.appendChild(newPin);
			};
			instance.addPicture(instance, false);
		};				
	};
};
//显示大图片的方法
waterfall.prototype.showPicture = function(instance) {
	instance.container.onclick = function(e) {
		var target = e.target || event.srcElement;

		e = window.event || e;
		
		if(target.tagName.toLowerCase() === "img") {
			var scrollTop = document.documentElement.scrollTop,
				darken = document.createElement("div"),
				bigImg = document.createElement("img"),
				newFrame = document.createElement("div");

			darken.setAttribute("class", "darken");
			//设置放大图片的布局和连接
			bigImg.src = target.src;
			bigImg.style.marginTop = scrollTop + "px";
			bigImg.style.left = Math.floor((document.documentElement.clientWidth + 17 - bigImg.width) / 2) + 37 + "px";

			darken.appendChild(newFrame);
			darken.appendChild(bigImg);

			document.body.appendChild(darken);
			document.body.style.overflow = "hidden";
			
			if(document.getElementsByClassName("darken")) {
				var darkenFrame = document.getElementsByClassName("darken")[0],
					darkenDiv = darkenFrame.getElementsByTagName("div")[0],
					darkenImg = darkenFrame.getElementsByTagName("img")[0];
				darkenDiv.onclick = function() {
					darkenFrame.parentNode.removeChild(darkenFrame);
					document.body.style.overflow = "auto";
				};
			};
		};
	};
};
//初始化及生成DOM
waterfall.prototype.init = function() {
	var template = "", instance = this,
		i = 0;

	do {
		template = "<div class='pin'><div class = 'box'><img src='" + instance.pictureData[i]['src'] + "'></div></div>";
		instance.container.innerHTML = instance.container.innerHTML + template;

		if(i === instance.pictureData.length - 1) {
			i = 0;
		};
		i++;
	}
	while(instance.checkScrollSide());

	instance.addPicture(instance, true);
	instance.activeAddPicture(instance);
	instance.showPicture(instance);
};
//产生并初始化对象
var data = [{'src': 'img/img1.png'}, {'src': 'img/img2.png'}, {'src': 'img/img3.png'}, {'src': 'img/img4.png'},
			{'src': 'img/img5.png'}, {'src': 'img/img6.png'}, {'src': 'img/img7.png'}, {'src': 'img/img8.png'},
			{'src': 'img/img9.png'}],
	container = document.getElementById("main"),
	myWF = new waterfall(container, data);

myWF.init();