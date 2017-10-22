var calendar;
//利用单例模式来生成构造函数
(function () {
	var instance;

	calendar = function(container) {
		if(instance) {
			return instance;
		};

		instance = this;

		this.container = container;
		this.isShow = false;
	};
})();
//初始化方法
calendar.prototype.init = function() {
	var instance = this;
	//设定日历的选中日期和当天日期
	instance.today = 0; 
	instance.selectedDay = new Date();
	//生成日历和绑定事件
	instance.buildCalendar(instance, instance.container);
	instance.drawCalendar(instance);
	instance.btnEvent(instance);
};

calendar.prototype.buildCalendar = function(instance, container) {
	//定义要用到的变量和生成要用到的元素
	var prevBtn = document.createElement("div"),
		nextBtn = document.createElement("div"),
		calTitle = document.createElement("p"),
		calBody = document.createElement("div"),
		calTable = document.createElement("table"),
		calHead = document.createElement("thead"),
		calTableBody = document.createElement("tbody"),
		cText = document.getElementById("cText"),
		confirmBtn = document.createElement("div"),
		cancleBtn = document.createElement("div"),
		weekDay = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"],
		weekDate = ["日", "一", "二", "三", "四", "五", "六"],
		nowYear = instance.selectedDay.getFullYear(),
		nowMonth = instance.selectedDay.getMonth();

	//添加ID或者Class
	prevBtn.setAttribute("class", "prevBtn");
	nextBtn.setAttribute("class", "nextBtn");
	calTitle.setAttribute("class", "calTitle");
	calBody.setAttribute("id", "calBody");
	confirmBtn.setAttribute("class", "buttons confirmBtn");
	cancleBtn.setAttribute("class", "buttons cancleBtn");

	//给日历头部添加文字
	prevBtn.innerHTML = "<";
	nextBtn.innerHTML = ">";
	confirmBtn.innerHTML = "确定";
	cancleBtn.innerHTML = "取消";
	nowMonth < 10 ? "0" + nowMonth : nowMonth;
	calTitle.innerHTML = nowYear + "年" + (nowMonth + 1) + "月";

	calBody.appendChild(prevBtn);
	calBody.appendChild(calTitle);
	calBody.appendChild(nextBtn);

	//生成日历
	for(var i = 0;i < 7;i += 1) {
		var calHeadTh = document.createElement("th");
			calHeadTh.innerHTML = weekDay[i];
		calHead.appendChild(calHeadTh);
	};

	for(i = 0;i < 6;i += 1) {
		var calBodyTr = document.createElement("tr");
		for(var k = 0;k < 7; k += 1) {
			var calBodyTd = document.createElement("td");
			calBodyTr.appendChild(calBodyTd);
		};
		calTableBody.appendChild(calBodyTr);
	};

	//把日历添加到容器中
	calTable.appendChild(calHead);
	calTable.appendChild(calTableBody);
	calBody.appendChild(calTable);
	container.appendChild(calBody);
	calBody.appendChild(confirmBtn);
	calBody.appendChild(cancleBtn);
};
//给日历添加样式
calendar.prototype.drawCalendar = function(instance) {
	//获取当天的日期和选中的日期
	var nowDay = new Date(),
		nowYear = nowDay.getFullYear(),
		nowMonth = nowDay.getMonth(),
		nowDate = nowDay.getDate(),
		selectedYear = instance.selectedDay.getFullYear(),
		selectedMonth = instance.selectedDay.getMonth(),
		selectedDate = instance.selectedDay.getDate(),
		calTitle = document.getElementsByClassName("calTitle")[0],
		tbodyTd = document.getElementsByTagName("td"),
		calTimeYear = parseInt(calTitle.innerHTML.substr(0, 4)),
		calTimeMonth =  parseInt(calTitle.innerHTML.substr(5, 2)),
		tbodyTd = document.getElementsByTagName("td"),
		firstDay = instance.getFirstDay(calTimeYear, calTimeMonth);
		days = instance.getDays(calTimeYear, calTimeMonth);

	for(var i = 0;i < tbodyTd.length;i += 1) {
		if(tbodyTd[i].firstChild) {
			tbodyTd[i].removeChild(tbodyTd[i].firstChild);
		};
	};
	//添加样式
	for (var i = firstDay;i < days + firstDay;i += 1) {
		tbodyTd[i].setAttribute("id","");
		tbodyTd[i].setAttribute("class", "");
		tbodyTd[i].innerHTML = i - firstDay + 1;
		if((nowDate - 1 === i - firstDay) && calTimeYear === nowYear && calTimeMonth === nowMonth + 1) {
			//给当天添加特殊样式
			tbodyTd[i].setAttribute("id","today");
			instance.today = i - firstDay + 1;
		};
	};
};
//返回指定月份的第一天为星期几
calendar.prototype.getFirstDay = function(year, month) {
	var date = new Date();
	date.setFullYear(year, month - 1, 1);
	return date.getDay();
};
//返回指定月份的天数
calendar.prototype.getDays = function(year, month) {
	//获取月天数
	if(month === 1 || month === 3 || month === 5 || month == 7 || month === 8 || month === 10 || month === 12) {
		return 31;
	}else if(month === 4 || month === 6 || month === 9 || month === 11) {
		return 30;
	}else if((year % 100 !== 0 && year % 4 === 0) || year % 400 === 0) {
		return 29;
	}else {
		return 28;
	};
};
//绑定事件
calendar.prototype.btnEvent = function(instance) {
	var cText = document.getElementById("cText"),
		calTitle = document.getElementsByClassName("calTitle")[0],
		calTableBody = document.getElementsByTagName("tbody")[0],
		prevBtn = document.getElementsByClassName("prevBtn")[0],
		nextBtn = document.getElementsByClassName("nextBtn")[0],
		confirmBtn = document.getElementsByClassName("confirmBtn")[0],
		cancleBtn = document.getElementsByClassName("cancleBtn")[0];

	prevBtn.onclick = function() {

		var calTimeYear = parseInt(calTitle.innerHTML.substr(0, 4)),
			calTimeMonth =  parseInt(calTitle.innerHTML.substr(5, 2)),
			todayTd = document.getElementsByTagName("td")[instance.today];
			todayTd.setAttribute("id","");


		calTimeMonth -= 1;
		if(calTimeMonth === 0) {
			calTimeMonth = 12;
			calTimeYear -= 1;
		};

		if(calTimeMonth === 12 && calTimeYear === 1949) {
			calTimeYear = 1950;
			calTimeMonth = 1;
		};

		calTimeMonth < 10 ? "0" + calTimeMonth : calTimeMonth;

		//改变日历表头
		calTitle.innerHTML = calTimeYear + "年" + calTimeMonth + "月";
		instance.drawCalendar(instance);
	};

	nextBtn.onclick = function () {
		var calTimeYear = parseInt(calTitle.innerHTML.substr(0, 4));
			calTimeMonth =  parseInt(calTitle.innerHTML.substr(5, 2));
			todayTd = document.getElementsByTagName("td")[instance.today];
		
		todayTd.setAttribute("id","");
		
		calTimeMonth += 1;
		if(calTimeMonth === 13) {
			calTimeMonth = 1;
			calTimeYear += 1;
		};

		if(calTimeMonth === 1 && calTimeYear === 2051) {
			calTimeYear = 2050;
			calTimeMonth = 12;
		};

		calTimeMonth < 10 ? "0" + calTimeMonth : calTimeMonth;

		//改变日历表头
		calTitle.innerHTML = calTimeYear + "年" + calTimeMonth + "月";

		instance.drawCalendar(instance);
	};
	//控制日历是否显示
	cText.onclick = function() {
		var calBody = document.getElementById("calBody");

		if(instance.isShow === false) {
			instance.isShow = true;
			calBody.style.display = "block";
		}else {
			instance.isShow = false;
			calBody.style.display = "none";
		};
	};

	calTableBody.onclick = function(event) {
		var calTimeYear = parseInt(calTitle.innerHTML.substr(0, 4)),
			calTimeMonth =  parseInt(calTitle.innerHTML.substr(5, 2));

		if(event.target.firstChild) {
			var theDay = event.target.firstChild.nodeValue;
			
			instance.selectedDay.setFullYear(calTimeYear, calTimeMonth, theDay);

			//确保为单日选择
			var tbodyTd = document.getElementsByTagName("td");
			for(var i = 0;i < tbodyTd.length;i += 1) {
				tbodyTd[i].setAttribute("class","");
			};			

			//为被选日添加样式
			event.target.setAttribute("class","select");					
		};
	};

	//取消操作
	cancleBtn.onclick = function() {
		var calBody = document.getElementById("calBody");

		calBody.style.display = "none";
	};

	//确定所选日
	confirmBtn.onclick = function() {
		var cText = document.getElementById("cText"),
			calBody = document.getElementById("calBody"),
			selectedYear = instance.selectedDay.getFullYear(),
			selectedMonth = instance.selectedDay.getMonth(),
			selectedDate = instance.selectedDay.getDate();

		cText.value = selectedYear + "-" + selectedMonth + "-" + selectedDate;
		calBody.style.display = "none";
	};	
};
