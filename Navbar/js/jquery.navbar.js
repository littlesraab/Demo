;(function($) {
	$.fn.nav = function(options) {

		//设定相关参数
		var opts = $.extend({}, $.fn.nav.defaults, options);

		return this.each(function() {
			//声明变量
			var $this = $(this),
				navW = parseFloat($this.css("width")),
				$list = $this.find(".list"),
				$listText = $this.find("a"),
				$ctrl = $this.find(".neNavCtrl"),
				$show = $this.find(".showNav"),
				navBShow,show = false;

			//计算导航栏主体的宽度
			navW = -((navW * .91).toFixed(1));

			//根据参数设置导航栏初始状态
			if(opts.isShow === false) {
				$ctrl.html("&gt;");
				$this.css("margin-left", navW);
				navBShow = false;
			}else {
				$ctrl.html("&lt;");
				navBShow = true;
			};

			//根据参数设置导航栏的css
			$list.children("li").css("border-bottom-color", opts.listBorderColor);

			$(".showNav").css("color", opts.showTagColor);
			$(".showNav").css("border-color", opts.showTagColor);


			$this.css("background-color",opts.backgroundColor);
			$this.find(".neNavHead").css("background-color", opts.headerBgColor);
			$this.find(".neNavHead").css("color",opts.headerColor);
			$this.find(".neNavFooter").css("background-color", opts.footerBgColor);
			$this.find(".neNavFooter").css("color",opts.footererColor);	

			if($this.find(".subList").length > 0) {
				$subList = $this.find(".subList");
				$subList.each(function() {
					$(this).css("background-color",opts.subListBgColor);
					$(this).css("color",opts.subListColor);
					$(this).prev().append("<span class='subTag'>&raquo;</span>");
				});
			};

			$listText.css("color",opts.textColor);
			$(".subTag").css("color", opts.textColor);

			$list.each(function() {
				$(this).css("background-color",opts.listBgColor);
			});

			$(".list>li").hover(function() {
				$(this).children("a").css("text-shadow", "none");
				$(this).children("a").css("color", opts.listBgColor);
				$(this).css("background-color", opts.textColor);
				$(this).children(".subTag").css("color", opts.listBgColor);
			},function() {
				$(this).children("a").css("text-shadow", "2px 2px 1px #3B3B3B");
				$(this).children("a").css("color", opts.textColor);
				$(this).css("background-color", opts.listBgColor);
				$(this).children(".subTag").css("color", opts.textColor);
			});

			$(".subList>li").hover(function() {
				$(this).children("a").css("text-shadow", "none");
				$(this).children("a").css("color", opts.subListBgColor);
				$(this).css("background-color", opts.textColor);
				$(this).children(".subTag").css("color", opts.subListBgColor);
			},function() {
				$(this).children("a").css("text-shadow", "2px 2px 1px #3B3B3B");
				$(this).children("a").css("color", opts.textColor);
				$(this).css("background-color", opts.subListBgColor);
				$(this).children(".subTag").css("color", opts.textColor);				
			});

			//绑定导航栏的显示和隐藏事件
			$ctrl.on("click", function() {
				if(navBShow === false) {
					$ctrl.html("&lt;");
					$this.animate({marginLeft:"0"},500);
					navBShow = true;
				}else {
					$ctrl.html("&gt;");
					$this.animate({marginLeft:navW},500);
					navBShow = false;
				};
			});

			//绑定导航栏的显示和隐藏事件(缩小状态下)
			$show.on("click",function() {
				if(show === false) {
					$(".neNavMain").slideDown(opts.animateSpeed);
					show = true;
				}else {
					$(".neNavMain").slideUp(opts.animateSpeed);
					show = false;
				};
			});

			//绑定导航栏每个标题的显示和隐藏事件
			$("li").each(function() {
				if($(this).next().hasClass("subList")) {
					$(this).on("click", function(e) {
						e.stopPropagation();
						e.preventDefault();
						if($(this).next().css("display") === "none") {							
							if(opts.singleOpen === true) {
								$(this).next().siblings(".subList").slideUp(opts.animateSpeed);
								$(this).siblings().children(".subTag").removeClass("subOpen");
							};
							$(this).next().slideDown(opts.animateSpeed);
							$(this).children(".subTag").addClass("subOpen");
							return false;
						}else {
							$(this).next().slideUp(opts.animateSpeed);
							$(this).children(".subTag").removeClass("subOpen");
						}
					});
				};
				window.location.href = $(this).children("a").attr("href");
			});
		});
	};
	//默认设定
	$.fn.nav.defaults = {
		headerBgColor: "#00B0B3",
		headerColor: "#fff",
		backgroundColor: "#00B0B3",
		footerBgColor: "#00B0B3",
		footererColor: "#fff",
		listBgColor: "#00B0B3",
		listBorderColor: "#009295",
		textColor: "#fff",
		showTagColor: "#fff",
		subListBgColor: "#1E1E1E",
		subListColor: "#fff",
		animateSpeed: 300,
		singleOpen: true,
		isShow: true
	};
})(jQuery);