function Calendar(ctrl) {

	//若没进行配置，则配置对象为空
	if(ctrl === undefined) {
		ctrl = {};
	};

	//定义要用到的变量和生成要用到的元素
	var pre = document.createElement("div"),
		aft = document.createElement("div"),
		title = document.createElement("p"),
		main = document.createElement("div"),
		ctable = document.createElement("table"),
		chead = document.createElement("thead"),
		cbody = document.createElement("tbody"),
		cText = document.createElement("input"),
		confirm = document.createElement("div"),
		cancle = document.createElement("div"),
		weekDay = ["Sun","Mon","Tue","Wed","Thr","Fri","Sat"],
		weekDate = ["日","一","二","三","四","五","六"],
		now = new Date(),
		nowYear = ctrl.year||now.getFullYear(),
		nowMonth = ctrl.month||now.getMonth(),
		nowDay = ctrl.day||now.getDate(),
		container = ctrl.container,
		mode = ctrl.section||false,
		nowDate,year,month,theDay,theDate,pick = [],
		count = 0,
		isShow = false;

	//组件日历
	function buildCal(year,month) {

		//添加ID或者Class
		pre.setAttribute("class","pre");
		aft.setAttribute("class","aft");
		title.setAttribute("class","title");
		main.setAttribute("id","calBody");
		cText.setAttribute("id","cText");
		confirm.setAttribute("class","buttons");
		cancle.setAttribute("class","buttons");

		//给日历头部添加文字
		pre.innerHTML = "<";
		aft.innerHTML = ">";
		confirm.innerHTML = "确定";
		cancle.innerHTML = "取消";
		nowMonth < 10 ? "0"+ nowMonth:nowMonth;
		title.innerHTML = nowYear + "年" + (nowMonth + 1) + "月";

		main.appendChild(pre);
		main.appendChild(title);
		main.appendChild(aft);

		//生成日历
		for(var i = 0;i < 7;i += 1) {
			var cheadTh = document.createElement("th");
				cheadTh.innerHTML = weekDay[i];
			chead.appendChild(cheadTh);
		};

		for(var j = 0;j < 6;j += 1) {
			var cbodyTr = document.createElement("tr");
			for(var k = 0;k < 7; k += 1) {
				var cbodyTd = document.createElement("td");
				cbodyTr.appendChild(cbodyTd);
			};
			cbody.appendChild(cbodyTr);
		};



		//把日历添加到容器中
		ctable.appendChild(chead);
		ctable.appendChild(cbody);
		main.appendChild(ctable);
		container.appendChild(cText);
		container.appendChild(main);
		main.appendChild(confirm);
		main.appendChild(cancle);
		drawCal();
	};

	//返回表头时间的月天数和当月第一天为周几
	function getDay() {
		var	selDay = {};

		//获取日历头部信息
		nowDate = title.innerHTML;
		year = parseInt(nowDate.substr(0,4));
		month = parseInt(nowDate.substr(5,2));

		//获取当月第一天为周几
		now.setFullYear(year,month-1,1);
		selDay[0] = now.getDay();

		//获取月天数
		if(month === 1 || month === 3 || month === 5 || month == 7 || month === 8 || month ===10 || month === 12) {
			selDay[1] = 31;
		}else if(month === 4 || month === 6 || month === 9 || month === 11) {
			selDay[1] = 30;
		}else if((year % 100 !== 0 && year % 4 === 0) || year % 400 === 0) {
			selDay[1] = 29;
		}else {
			selDay[1] = 28;
		};

		return	selDay;
	};

	//给日历添加日期
	function drawCal() {
		var days = getDay()[1],
			firstDay = getDay()[0],
			date = 1,
			nowDate = title.innerHTML,
			year = parseInt(nowDate.substr(0,4)),
			month = parseInt(nowDate.substr(5,2)),
			tbodyTd = document.getElementsByTagName("td");

		for(var i = 0;i < tbodyTd.length;i += 1) {
			if(tbodyTd[i].firstChild) {
				tbodyTd[i].removeChild(tbodyTd[i].firstChild);
			};
		};
 
		for (var i = firstDay;i<days+firstDay;i+=1) {
			tbodyTd[i].setAttribute("id","");	
		};

		for(var j = firstDay;j < days+firstDay; j += 1) {
			tbodyTd[j].innerHTML = date;
			if((nowDay-1 === j - firstDay) && year === nowYear && month === nowMonth+1) {

				//给当天添加特殊样式
				tbodyTd[j].setAttribute("id","today");
			};
			date += 1;
		};

		//添加处理日历显示和隐藏的时间
		cText.onclick = function() {
			if(isShow === false) {
				main.style.display = "block";
				isShow = true;
			}else {
				main.style.display = "none";
				isShow = false;
			};
		};
	};

	//改变月份或者年份的方法
	function change() {
		var tbodyTd = document.getElementsByTagName("td");

		nowDate = title.innerHTML;
		year = parseInt(nowDate.substr(0,4));
		month = parseInt(nowDate.substr(5,2));

		//减少月数时的方法
		pre.onclick = function() {

			//去除之前选的的日期的样式
			for(var i = 0;i < tbodyTd.length;i += 1) {
				tbodyTd[i].setAttribute("class","");
			};
			
			//规定最大和最小时间，规定一年的月数
			month -= 1;
			if(month === 0) {
				year -= 1;
				month = 12;
				if(year === 1949 && month === 12) {
					year = 1950;
					month = 1;
				};
				month < 10 ? "0" + month:month;
			};

			//改变日历表头
			title.innerHTML = year + "年" + month + "月";

			//改变月份的相应数据
			drawCal();
		};

		//增加月数时的方法
		aft.onclick = function() {
			for(var i = 0;i < tbodyTd.length;i += 1) {
					tbodyTd[i].setAttribute("class","");
			};

			month += 1;
			if(month === 13) {
				year += 1;
				month = 1;
				if(year === 2051 && month === 1) {
					year = 2050;
					month = 12;
				};
				month < 10 ? "0"+month:month;
			};
			title.innerHTML = year + "年" + month + "月";
			drawCal();
		};
	};

	//把制定的日期显示在输入框内
	function showDate() {

		//单日选择模式
		if(mode === false) {
			cbody.onclick = function(event) {
				var tbodyTd = document.getElementsByTagName("td");
					nowDate = title.innerHTML;				
					year = parseInt(nowDate.substr(0,4));
					month = parseInt(nowDate.substr(5,2));

				if(event.target.firstChild) {
					var selDay = new Date();
						theDay = event.target.firstChild.nodeValue;
			
					selDay.setFullYear(year,month-1,theDay);

					theDate = selDay.getDay();

					//确保为单日选择
					for(var i = 0;i < tbodyTd.length;i += 1) {
						tbodyTd[i].setAttribute("class","");
					};

					//为被选日添加样式
					event.target.setAttribute("class","select");
					
				};
			};

			//确定所选日
			confirm.onclick = function() {
				cText.value = year + "-" + month + "-" + theDay;
				main.style.display = "none";
			};

			//取消操作
			cancle.onclick = function() {
				main.style.display = "none";
			};
		}else {
			//时间段选择模式
			cbody.onclick = function(event) {
				var tbodyTd = document.getElementsByTagName("td");
					nowDate = title.innerHTML;				
					year = parseInt(nowDate.substr(0,4));
					month = parseInt(nowDate.substr(5,2));

				if(event.target.firstChild) {
					var selDay = new Date();
						theDay = event.target.firstChild.nodeValue;
					
					//保存两个时间点
					pick.push([year,month,theDay]);
					selDay.setFullYear(year,month-1,theDay);

					var theDate = selDay.getDay();

					//确保只能选择两个时间点
					count += 1;
					event.target.setAttribute("class","select");
					if(count > 2) {
						var firstDay = getDay()[0],
							cancleDay = pick.shift()[2];
							tbodyTd[parseInt(firstDay) + parseInt(cancleDay-1)].setAttribute("class","");
						count -= 1;
					};
				};
			};

			confirm.onclick = function() {

				//确保较前的时间在前
				if(pick[0][0] > pick[1][0]) {
					pick.reverse();
				}else if(pick[0][0] === pick[1][0]) {
					if(pick[0][1] > pick[1][1]) {
						pick.reverse();
					}else if(pick[0][1] === pick[1][1]) {
						if(pick[0][2] > pick[1][2]) {
							pick.reverse();
						};
					};
				};

				//显示时间
				cText.value = pick[0][0] + "年" + pick[0][1] + "月" + pick[0][2] + "日-" + pick[1][0] + "年" + pick[1][1] + "月" + pick[1][2] + "日";
				main.style.display = "none";
			};

			cancle.onclick = function() {
				main.style.display = "none";
			};
		};
	};

	//生成日历
	buildCal(nowYear,nowMonth);
	change();
	showDate();
};