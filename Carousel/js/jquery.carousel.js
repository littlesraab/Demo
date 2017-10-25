;(function($) {
	$.fn.carousel = function(options) {
		//合并默认和指定配置
		var opts = $.extend({}, $.fn.carousel.defaults, options);

		return this.each(function() {
			//声明变量
			var $this = $(this),
				$head = $("head")[0],
				$items = $this.find(".carousel-item"),
				$prevBtn = $this.find(".prev-btn"), $nextBtn = $this.find(".next-btn"),
				$index,	$nextSide, $prevSide, 
				level, classArr = [], levelArr = [],
				zDis,
				autoTimer, activeIndex = 0,
				isRotate = true;

				//设定配置
				setOpts();
				//设定元素的样式
				setStyle();

			function setOpts() {
				//规定图片间的缩放比例
				opts.scale < 0.5 ? opts.scale = 0.5 : opts.scale;
				opts.scale > 1 ? opts.scale = 1: opts.scale;

				//设定显示的图片数和总图片数的关系
				$items.length < opts.showNum ? opts.showNum = $items.length : opts.showNum;

				if(opts.showNum > 1 && opts.showNum % 2 === 0) {
					opts.showNum--;
				};

				//设定图片的竖直方向的对齐标准
				switch (opts.verticalAlign) {
					case "middle":
						opts.verticalAlign = 50;
						break;
					case "top":
						opts.verticalAlign = 0;
						break;
					case "bottom":
						opts.verticalAlign = 100;
						break;
					default:
						opts.verticalAlign = 50;
						break;
				};
				//设定图片的层数和两边的长度
				level = (opts.showNum - 1) / 2;
				$nextSide = $items.slice(1, level + 1);
				$prevSide = $items.slice($items.length - ((opts.showNum - 1) / 2));
			};

			function setStyle() {
				var	nWidth = opts.currentWidth,
					nRight =  opts.currentWidth / 2,
					nTop, nRightArr = [], nTopArr = [],
					style, styleArr = [];

				//设定主体背景
				$this.css({
					backgroundColor: opts.backgroundColor,
					color: opts.textColor
				});

				//设定中间图片的起始样式
				styleArr.push({
					width: opts.currentWidth + "%",
					left: (100 - opts.currentWidth) / 2 + "%",
					top: 0,
					zIndex: level + 1
				});
				levelArr.push(level + 1);

				//设定右边图片的起始样式
				$nextSide.each(function(i) {
					nWidth = nWidth * opts.scale;
					nTop = (1 - Math.pow(opts.scale, i + 1)) * opts.verticalAlign;
					nRight = nRight + (100 - opts.currentWidth) / Math.pow(2, i + 2);

					nRightArr.push(50 + nRight);
					nTopArr.push(nTop);

					styleArr.push({
						width: nWidth + "%",
						left: 50 + nRight - nWidth + "%",
						top: nTop.toFixed(2) + "%",
						zIndex: level - i
					});
					levelArr.push(levelArr - i);
				});

				//设定起始不在显示范围内的图片的起始样式
				if(opts.showNum !== $items.length) {
					var $hideItems = $items.slice(level, $items.length - ((opts.showNum - 1) / 2) -1);

					$hideItems.each(function(i) {
						styleArr.push({
							width: opts.currentWidth / 2 + "%",
							left: Math.round(100 - opts.currentWidth / 2) / 2 + "%",
							top: ((1 - Math.pow(opts.scale, i + 1)) * 4 * opts.verticalAlign).toFixed(2) + "%",
							zIndex: (-i - 1)
						});
						levelArr.push(-i - 1);
					});
				};

				nRightArr.reverse();
				nTopArr.reverse();
				pWidth = opts.currentWidth * (Math.pow(opts.scale, $nextSide.length));
				
				//设定左边图片的起始样式
				$prevSide.each(function(i) {
					pLeft = 100 - nRightArr[i];

					styleArr.push({
						width: pWidth + "%",
						left:  pLeft + "%",
						top: nTopArr[i].toFixed(2) + "%",
						zIndex: i + 1						
					});
					levelArr.push(i + 1);
					pWidth = pWidth / opts.scale;
				});

				//生成各个轮播图位置的类
				for(var i = 0; i < styleArr.length; i += 1) {
					style = $("<style> .item" + i +  "{width:" + styleArr[i].width + ";left:" + styleArr[i].left + ";top:" + styleArr[i].top + ";z-Index:" + styleArr[i].zIndex + ";}</style>");
					style.appendTo($head);
					classArr.push("item" + i);
				};
				//设定轮播图样式变化时为动画且设定其动画时间
				style = $("<style> .carousel-item { -webkit-transition: all " + (opts.animateSpeed / 1000) + "s;-ms-transition: all " + (opts.animateSpeed / 1000) + "s;-o-transition: all " + (opts.animateSpeed / 1000) + "s;-moz-transition: all " + (opts.animateSpeed / 1000) + "s;transition: all " + (opts.animateSpeed / 1000) + "s; } </style>");
				style.appendTo($head);

				$items.each(function(i) {
					$(this).addClass(classArr[i]);
				});

				//生成和图片数量相同的导航条
				for(var i = 0;i < $items.length; i += 1) {
					$this.find(".carousel-ctrl").append("<span></span>");
				};
				$index = $(".carousel-ctrl span");
				//设定第一幅图片的导航条为高亮
				$index.eq(0).addClass("active");				
			};
			
			//自动播放的函数
			function autoPlay() {
				clearInterval(autoTimer);
				autoTimer = setInterval(function() {
					if(isRotate === true) {
						isRotate = false;
						itemRotate("left");
					};
				},opts.animateSpeed + 3500);
			}

			//判断是否自动播放
			if(opts.autoPlay === true) {
				autoPlay();
				//设定其停止和启动的条件
				$(".carousel-container").hover(function() {
					clearInterval(autoTimer);
				},function() {
					autoPlay();
				});
			};

			//图片轮转的方法
			function itemRotate(dir) {
				var temp, prev, next;

				$index.eq(activeIndex).removeClass("active");
				//去除轮播图上关于轮播图位置的类
				$items.each(function(i) {
					$(this).removeClass(classArr[i]);
				});	
				//分别设定向左和向右的动作
				if(dir === "left") {
					//设定导航条的动作且改变导航条的高亮索引
					activeIndex += 1;
					activeIndex === $index.length ? activeIndex = 0 : activeIndex;
					$index.eq(activeIndex).addClass("active");

					temp = levelArr.pop();
					levelArr.unshift(temp);
					//给轮播图加上新的轮播图位置的类
					$items.each(function (i) {
						i === 0 ? i = $items.length - 1 : i = i - 1;
						$(this).addClass(classArr[i]);
						isRotate = true;
					});

					temp = classArr.pop();
					classArr.unshift(temp);
				}else if(dir === "right") {
					activeIndex -= 1;
					activeIndex === -1 ? activeIndex = $index.length - 1 : activeIndex;
					$index.eq(activeIndex).addClass("active");			

					temp = levelArr.shift();
					levelArr.push(temp);

					$items.each(function (i) {
						i === $items.length - 1 ? i = 0 : i = i + 1;
						$(this).addClass(classArr[i]);
						isRotate = true;
					});

					temp = classArr.shift();
					classArr.push(temp);
				};
			};		

			//设定右箭头的点击事件
			$nextBtn.on("click", function() {
				if(isRotate === true) {
					isRotate = false;
					itemRotate("left");
				};
			});

			//设定左箭头的点击事件
			$prevBtn.on("click", function() {
				if(isRotate === true) {
					isRotate = false;
					itemRotate("right");
				};
			});

			//设定每个图片的点击事件
			$items.each(function(i) {
				$(this).on("click", function() {
					//判断是否进行图片移动
					if(levelArr[i] < level + 1) {
						var prev = $(this).prev().get(0) ? $(this).prev() : $items.last();
						var prevZ = prev.css("zIndex");
						zDis = level + 1 - levelArr[i];

						//判断移动的方向
						var timer = setInterval(function() {							
							if(zDis <= 1) {
								window.clearInterval(timer);
							};
							//设定循环，次数为图片的z-index差距
							zDis -= 1;
							if(isRotate === true) {
								isRotate = false;
								//判断移动的方向
								prevZ > levelArr[i] ? itemRotate("left") : itemRotate("right");
							};
						}, opts.animateSpeed + 50);
					};
				});
			});

			//设定导航的点击事件
			$index.each(function(i) {
				$(this).on("click", function() {
					//判断是否进行动作
					if(levelArr[i] < level + 1) {
						var prevZ;
						
						i === 0 ? prevZ = levelArr[levelArr.length - 1] : prevZ = levelArr[i - 1];
						//判断对应的图片z-index的正负
						levelArr[i] > 0 ? zDis = level + 1 - levelArr[i] : zDis = level - levelArr[i];
												
						var timer = setInterval(function() {
							if(zDis <= 1) {
								window.clearInterval(timer);
							};
							zDis -= 1;
							if(isRotate === true) {
								isRotate = false;
								//判断图片的移动方向
								prevZ > levelArr[i] ? itemRotate("left") : itemRotate("right");
							}
						}, opts.animateSpeed + 70);						
					};
				});
			});
		});
	};

	//设定默认设置
	$.fn.carousel.defaults = {
		showNum: 5,
		autoPlay: false,
		verticalAlign: "middle",
		animateSpeed: 400,
		currentWidth: 40,
		scale: 0.95,
		backgroundColor: "#0F0F0F",
		textColor: "#fff"
	};
})(jQuery);
