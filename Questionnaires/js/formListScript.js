//取得父页面的问卷列表和iframe
var forms = parent.forms,
	container = parent.container,
	body = document.getElementsByTagName("body")[0],
	list = document.getElementById("listBody"),
	//用checked储存被选中问卷的数量
	checked = 0;

var btnEvent = {
	editBtnEvent : function(target) {
		target.onclick = function() {
			parent.selected = parseInt(this.id.charAt(this.id.length-1));
			parent.changePage(container,"editForm.html");
		};
	},
	dataBtnEvent : function(target) {
		target.onclick = function() {
			parent.selected = parseInt(this.id.charAt(this.id.length-1));
			parent.changePage(container,"formData.html");
		};
	},
	checkBtnEvent : function(target) {
		target.onclick = function() {
			parent.selected = parseInt(this.id.charAt(this.id.length-1));
			parent.changePage(container,"checkForm.html");
		};
	},
	deleteBtnEvent : function(target) {
		target.onclick = function() {
			var index = parseInt(this.id.charAt(this.id.length-1)),
				darken = document.getElementById("darken"),
				darkContent = document.getElementById("darkContent"),
				certain = document.getElementById("certain"),
				cancel = document.getElementById("cancel");

			darken.style.display = "block";
			darkContent.style.display = "block";
			//确定按钮的事件
			certain.onclick = function() {
				darken.style.display = "none";
				darkContent.style.display = "none";
				deleteRow(index);

				if(forms.length === 0) {
					parent.selected = undefined;
					parent.changePage(container,"editForm.html");
				}else {
					var parentForm = document.getElementById("form" + index);
					parentForm.parentNode.removeChild(parentForm);
				};
			};
			//取消按钮事件
			cancel.onclick = function() {
				darken.style.display = "none";
				darkContent.style.display = "none";
			};
		};
	},
	selAllBtnEvent : function(target) {
		target.onclick = function() {
			var selBtns = document.getElementsByClassName("selBtn");
			if(checked === selBtns.length) {
				for(var j = 0; j < selBtns.length; j += 1) {
					selBtns[j].disabled = false;
					selBtns[j].checked = false;				
				};
				checked = 0;
			}else {
				for(var j = 0;j < selBtns.length;j += 1) {
					selBtns[j].disabled = true;
					selBtns[j].checked = true;	
				};			
			};
			checked = selBtns.length;
		};
	},
	deleteAllBtnEvent : function(target) {
		target.onclick = function() {
			if(checked === forms.length) {
			var	certain = document.getElementById("certain"),
				cancel = document.getElementById("cancel"),
				darken = document.getElementById("darken"),
				darkContent = document.getElementById("darkContent"),
				templateArr = [];

			//改变罩层的显示和隐藏
			darken.style.display = "block";
			darkContent.style.display = "block";

			//分别绑定确定和取消两个按钮的事件
			certain.onclick = function() {
				darken.style.display = "none";
				darkContent.style.display = "none";

				//确定是否有剩余的问卷，若无，就转跳到生成问卷的页面
				for(var j = 0; j < forms.length; j += 1) {
					if(forms[j].status === 1) {
						templateArr.push(forms[j]);
					};
				};

				list.innerHTML = "";

				if(templateArr.length > 0) {
					parent.form = templateArr;
					for(j = 0;j < parent.form.length;j += 1) {
						bulidList.inIssue(j);
					};
				}else {
					parent.forms = [];
					parent.selected = undefined;
					parent.changePage(container,"editForm.html");
				};
			};

			cancel.onclick = function() {
				darken.style.display = "none";
				darkContent.style.display = "none";
			};
		};
		};
	},
	createBtnEvent : function() {
		var createBtn = document.getElementById("createBtn");
		createBtn.onclick = function() {
			parent.changePage(container,"editForm.html");
		};
	}
};

var bulidList = {
	unissued : function (index) {
		var template = "",
			formTime = checkTime(forms[index].deadline);

		template += "<div class='forms' id='form" + index + "'><input type='checkbox' class='selBtn' id='selBtn" + index + "' />";
		template += "<div class='questTitle'>" + forms[index].title + "</div>";
		template += "<div class='questTime'>" + formTime + "</div>";
		template += "<div class='questStatus'>未发布</div>";
		template += "<div class='questCtrl'>";
		template += "<button class='Btn editBtn'id='editBtn" + index + "'>编辑</button>";
		template += "<button class='Btn deleteBtn' id='deleteBtn" + index + "'>删除</button>";
		template += "<button class='Btn checkBtn' id='checkBtn" + index + "'>查看问卷</button></div>";

		list.innerHTML = list.innerHTML + template;
	},
	inIssue : function(index) {
		var template = "",
			formTime = checkTime(forms[index].deadline);

		template += "<div class='forms' id='form" + index + "'><input type='checkbox' class='selBtn' id='selBtn" + index + "' />";
		template += "<div class='questTitle'>" + forms[index].title + "</div>";
		template += "<div class='questTime'>" + formTime + "</div>";
		template += "<div class='questStatus'>已发布</div>";
		template += "<div class='questCtrl'>";
		template += "<button class='Btn deleteBtn' id='deleteBtn" + index + "' disabled = true>删除</button>";
		template += "<button class='Btn dataBtn' id='dataBtn" + index + "'>查看数据</button>";
		template += "<button class='Btn checkBtn' id='checkBtn" + index + "'>查看问卷</button></div>";

		list.innerHTML = list.innerHTML + template;
	},
	hasOver : function(index) {
		var template = "",
			formTime = checkTime(forms[index].deadline);

		template += "<div class='forms' id='form" + index + "'><input type='checkbox' class='selBtn' id='selBtn" + index + "' />";
		template += "<div class='questTitle'>" + forms[index].title + "</div>";
		template += "<div class='questTime'>" + formTime + "</div>";
		template += "<div class='questStatus'>已结束</div>";
		template += "<div class='questCtrl'>";
		template += "<button class='Btn deleteBtn' id='deleteBtn" + index + "'>删除</button>";
		template += "<button class='Btn dataBtn' id='dataBtn" + index + "'>查看数据</button>";
		template += "<button class='Btn checkBtn' id='checkBtn" + index + "'>查看问卷</button></div></div>";

		list.innerHTML = list.innerHTML + template;		
	}
};
//确定问卷的状态，确定问卷是否已经过期
function checkTime(target) {
	var formTime = target.split("-"),
		formYear = formTime[0],
		formMonth = formTime[1] < 10 ? "0" + formTime[1] : formTime[1],
		formDay = formTime[2] < 10 ? "0" + formTime[2] : formTime[2],
		formDate = new Date(formTime[0], formTime[1], formTime[2]),
		nowDate = new Date(),
		result;

	result = formYear + "-" + formMonth + "-" + formDay;

	//比较现在的时间和问卷的截止时间
	if(status === 1 && (formDate - nowDate < 0)) {
		taregt.status = 2;
	};

	return result;
};
//删除一个问卷的方法
function deleteRow(target) {
	forms.splice(target,1);
	parent.forms = forms;
};

function editQuestList() {
	for(var i = 0;i < forms.length;i += 1) {
		switch(forms[i].status) {
			case 0:
				bulidList.unissued(i);
				break;
			case 1:
				bulidList.inIssue(i);
				break;
			case 2:
				bulidList.hasOver(i);
				break;
		};
	};

	list.innerHTML = list.innerHTML + "<div class='allCtrl'><input type='checkbox' id='selAll'><span>全选</span><button id='DeleteAllBtn'>删除</button></div>";
	container.style.height = body.offsetHeight * 2 + "px";
};
//注册事件
function editBtnEvent() {
	var editBtns, dataBtns, checkBtns, deleteBtns, deleteAllBtn, selAllBtn;

	editBtns = document.getElementsByClassName("editBtn");
	deleteBtns = document.getElementsByClassName("deleteBtn");
	checkBtns = document.getElementsByClassName("checkBtn");
	dataBtns = document.getElementsByClassName("dataBtn");
	selAllBtn = document.getElementById("selAll");
	DeleteAllBtn = document.getElementById("DeleteAllBtn");
	createBtn = document.getElementById("createBtn");

	for(i = 0;i < editBtns.length;i += 1) {
		btnEvent.editBtnEvent(editBtns[i]);
	};

	for(i = 0;i < deleteBtns.length;i += 1) {
		btnEvent.deleteBtnEvent(deleteBtns[i]);
	};

	for(i = 0;i < checkBtns.length;i += 1) {
		btnEvent.checkBtnEvent(checkBtns[i]);
	};

	for(i = 0;i < dataBtns.length;i += 1) {
		btnEvent.dataBtnEvent(dataBtns[i]);
	};

	btnEvent.selAllBtnEvent(selAllBtn);
	btnEvent.deleteAllBtnEvent(DeleteAllBtn);
	btnEvent.createBtnEvent(createBtn);
};

editQuestList();
editBtnEvent();