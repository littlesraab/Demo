var forms = parent.forms,
	selected = parent.selected,
	container = parent.container,
	body = document.getElementsByTagName("body")[0],
	formBody = document.getElementById("FormBody"),
	nowForm;

//确定是否有选择问卷，若无，就新建一个问卷
if(selected === undefined) {
		nowForm = createForm();
		selected = forms.length;
}else {
	if(selected < forms.length) {
		nowForm = forms[selected];
	};
};

var calContainer = document.getElementById("calendar");

//生产及配置日历
Calendar({
	container:calContainer,
	section:false
});

var calText = document.getElementById("cText");
calText.value = nowForm.deadline;

//生成并返回空白的问卷
function createForm() {
	var newForm = {
		"title": "请填写问卷题目",
		"deadline": "2030-1-1",
		"status": 0,
		"qData": 0,
		"content": []
	};

	return nowForm;
};

//根据传入的参数生成问题
function createQuest(kind) {
	var newQuest;

	switch(kind) {
		case "single":
			newQuest = {
				"qTitle": "标题",
				"qType": "radio",
				"options": []
			};
			break;
		case "checkbox":
			newQuest = {
				"qTitle": "标题",
				"qType": "radio",
				"options": []
			};
			break;
		default:
			newQuest = {
				"qTitle": "标题",
				"qType": "textarea",
				"require": false,
				"qContent": false,
				"oData": 0
			};
			break;			
	};

	return newQuest;
};

//删除问题的方法
function deleteQuestion(index) {
	nowForm.content.splice(index, 1);
};

//删除选项的方法
function deleteAns(parentIndex,index) {
	nowForm.content[parentIndex].options.splice(index, 1);
};

//根据参数确定是否保存或发布问卷
function saveForm(status) {
	var title = document.getElementById("title"),
		qTitle = document.getElementsByClassName("qTitle"),
		requireBtns = document.getElementsByClassName("requireBtn"),
		oTitle,cTime,formTime;

	//确定问卷中是否为空卷
	if(nowForm.content.length > 0) {

		//确定问卷的标题
		title.value === "" ? nowForm.title = "问卷标题" : nowForm.title;

		//逐条问题进行检验和保存
		for(var i = 0;i < nowForm.content.length;i += 1) {

			qTitle[i].value === "" ? nowForm.content.qTitle = "问题标题" : nowForm.content.qTitle = qTitle[i].value;

			//若为文本题，检测其是否为必填
			if(nowForm.content[i].qType === "textarea") {
				var requireBtn = document.getElementById("quest" + i).getElementsByClassName("requireBtn")[0];
				requireBtn.checked === true ? nowForm.content[i].require = true : nowForm.content[i].require = false;
			}else {
				//若为其他类型，则测定每个选项的标题
				for(var j = 0;j < nowForm.content[i].options.length;j += 1) {
					oTitle = document.getElementById("quest" + i).getElementsByClassName("qOption")[j].value;
					oTitle === "" ? nowForm.content[i].options[j].oTitle = "选项标题" : nowForm.content[i].options[j].oTitle = oTitle;
				};
			};
		};

		//确定问卷的截止时间，若时间已经超过现在，则设定为预设的事件
		cTime = document.getElementById("cText").value;
		cTime = cTime.split("-");
		formTime = new Date(cTime[0], cTime[1]-1, cTime[2]);		
		if(formTime.getTime() - (new Date().getTime()) <= 0) {
			alert("请选择正确的日期!");
			nowForm.deadline = "2030-1-1";
		}else {
			nowForm.deadline = document.getElementById("cText").value;
		};
		
		//根据参数确定问题的状态
		status === 1 ? parent.forms[selected].status = 1 : parent.forms[selected].status = 0;
		//跟新父页面中的问卷列表的特定问卷
		parent.forms[selected] = nowForm;
		return true;
	}else {
		console.log("问题数目太少");
		return false;
	};
};

//按钮事件
var btnEvent = {
	moveUpBtnEvent: function(target) {
		target.onclick = function() {
			var index = parseInt(this.parentNode.parentNode.id.charAt(this.parentNode.parentNode.id.length-1)),
				targetQuest = document.getElementById("quest" + index),
				frontQuest = document.getElementById("quest" + (index - 1)),
				frontBtn = frontQuest.getElementsByClassName("moveUp")[0],
				template = nowForm.content[index - 1],
				questTemp = targetQuest.innerHTML;

			//修改问卷
			nowForm.content[index - 1] = nowForm.content[index];
			nowForm.content[index] = template;
			
			//修改DOM
			targetQuest.innerHTML = frontQuest.innerHTML;
			frontQuest.innerHTML = questTemp;

			//重新编写问题编号
			targetQuest.getElementsByTagName("span")[0].innerHTML = (index + 1) + ".";
			frontQuest.getElementsByTagName("span")[0].innerHTML = index + ".";

			//重新绑定事件
			editQuestBtnEvent(index);
			editQuestBtnEvent(index - 1); 
		};
	},
	moveDownBtnEvent: function(target) {
		target.onclick = function() {
			var index = parseInt(this.parentNode.parentNode.id.charAt(this.parentNode.parentNode.id.length-1)),
				targetQuest = document.getElementById("quest" + index),
				behindQuest = document.getElementById("quest" + (index + 1)),
				behindBtn = behindQuest.getElementsByClassName("moveDown")[0],
				template = nowForm.content[index + 1];
				questTemp = targetQuest.innerHTML;

			nowForm.content[index + 1] = nowForm.content[index];
			nowForm.content[index] = template;

			targetQuest.innerHTML = behindQuest.innerHTML;
			behindQuest.innerHTML = questTemp;

			targetQuest.getElementsByTagName("span")[0].innerHTML = (index + 2) + ".";
			behindQuest.getElementsByTagName("span")[0].innerHTML = (index + 1) + ".";

			editQuestBtnEvent(index);
			editQuestBtnEvent(index + 1);
		};
	},
	addAnsBtnEvent: function(target) {
		target.onclick = function() {
			var index = parseInt(this.parentNode.parentNode.id.charAt(this.parentNode.parentNode.id.length-1)),
				targetQuest = document.getElementById("quest" + index),
				questCtrl = targetQuest.getElementsByClassName("questionCtrl")[0],
				newOption = document.createElement("div"), newBtn;
			
			//在问卷中插入新选项
			nowForm.content[index].options.push({
				"oTitle": "newTitle",
				"oData": 0
			});

			//把新选项的DOM插入且设定其类
			newOption.setAttribute("class", "questOption");
			targetQuest.insertBefore(newOption, questCtrl);

			//编辑新选项内的DOM
			if(nowForm.content[index].qType === "radio") {
				var template = "";

				template += "<input type='radio' name='q"+ index +"'/>";
				template += "<input class='qOption' type='text' value=" + nowForm.content[index].options[nowForm.content[index].options.length - 1].oTitle + ">";
				template += "<button name='opt" + (nowForm.content[index].options.length - 1) + "' class='deleteQAns'>删除</button>";
			}else {
				var template = "";

				template += "<input type='checkbox' name=''more'/>";
				template += "<input class='qOption' type='text' value=" + nowForm.content[index].options[nowForm.content[index].options.length - 1].oTitle + ">";
				template += "<button name='opt" + (nowForm.content[index].options.length - 1) + "' class='deleteQAns'>删除</button>";
			};

			//绑定新按钮事件
			newOption.innerHTML = template;
			newBtn = newOption.getElementsByClassName("deleteQAns")[0];
			btnEvent.deleteQAnsBtnEvent(newBtn);
			container.style.height = body.offsetHeight * 1.03 + "px";
		};
	},
	deleteQAnsBtnEvent: function(target) {
		target.onclick = function() {
			var parentIndex = parseInt(this.parentNode.parentNode.id.charAt(this.parentNode.parentNode.id.length-1)),
				index = parseInt(this.name.charAt(this.name.length-1)),
				questOpts;
			
			//删除目标选项的DOM
			questOpts = this.parentNode.parentNode.getElementsByClassName("questOption");
			this.parentNode.parentNode.removeChild(this.parentNode);
			
			//在问卷中删除目标选项且重新编写选项编号
			deleteAns(parentIndex, index);
			for(var i = index;i < nowForm.content[parentIndex].options.length;i += 1) {
				questOpts[index].setAttribute("name", "opt" + i);
			};
			container.style.height = body.offsetHeight * 1.03 + "px";
		};
	},
	copyBtnEvent: function(target) {
		target.onclick = function() {
			if(nowForm.content.length < 10) {
				var index = parseInt(this.parentNode.parentNode.id.charAt(this.parentNode.parentNode.id.length-1)),
					cTemplate = nowForm.content[index],
					targetQuest = document.getElementById("quest" + index),
					questList = formBody.getElementsByClassName("quest"),
					newNode = targetQuest.cloneNode(true);

				//复制问题的选项
				if(nowForm.content[index].qType !== "textarea") {
					for(var k = 0;k < cTemplate.options.length;k += 1) {
						cTemplate.options[k].oData = 0;
					};
				};

				//重新编写问题的编号
				for(k = index + 1;k < nowForm.content.length;k += 1) {
					questList[k].setAttribute("id", "quest" + (k + 1));
					questList[k].getElementsByTagName("span")[0].innerHTML = (k + 2) + ".";
				};

				nowForm.content.splice(index, 0, cTemplate);
				newNode.setAttribute("id", "quest" + (index + 1));
				formBody.insertBefore(newNode ,document.getElementById("quest" + (index + 2)));
				newNode.getElementsByTagName("span")[0].innerHTML = (index + 2) + ".";

				if((index + 1) === nowForm.content.length - 1) {
					targetQuest.getElementsByClassName("moveDown")[0].disabled = false;
				};

				editQuestBtnEvent(index + 1);
				container.style.height = body.offsetHeight * 1.03 + "px";
			}else{
				console.log("wrong");
			};
		};
	},
	deleteQuestBtnEvent: function(target) {
		target.onclick = function() {
			var index = parseInt(this.parentNode.parentNode.id.charAt(this.parentNode.parentNode.id.length-1)),
				targetQuest = document.getElementById("quest" + index),
				questList, targetMoveBtn;
			
			//删除问卷指导问题
			deleteQuestion(index);

			//修改DOM和问题编号
			formBody.removeChild(targetQuest);
			questList = formBody.getElementsByClassName("quest");
			for(var i = index;i < nowForm.content.length;i += 1) {
				questList[i].setAttribute("id", "quest" + i);
				questList[i].getElementsByTagName("span")[0].innerHTML = (i + 1) + ".";
			};

			//判断按钮的可用情况
			if(nowForm.content.length > 0 && index === nowForm.content.length) {
				targetMoveBtn = document.getElementsByClassName("moveDown")[index - 1];
				targetMoveBtn.disabled = true;
			};

			if(nowForm.content.length > 0 && index === 0) {
				targetMoveBtn = document.getElementsByClassName("moveUp")[0];
				targetMoveBtn.disabled = true;
			};

			container.style.height = body.offsetHeight * 1.03 + "px";
		};
	},
	addQuestBtnEvent: function(target) {
		target.onclick = function() {
			var questType = document.getElementById("questType");
			if(questType.style.display === "none") {
				questType.style.display = "block";
			}else{
				questType.style.display ="none";
			};
			container.style.height = body.offsetHeight * 1.03 + "px";
		};
	},
	btnTypeBtnEvent: function(target) {
		target.onclick = function() {
			var questType = this.getAttribute("id"),
				qContainer = document.createElement("div"),
				newQuest,targetQuest;

			//判断新增的问题的类型且编写DOM	
			switch(questType) {
				case "qSingle" :
					questType = "single";
					newQuest = createQuest(questType);
			        nowForm.content.push(newQuest);
					qContainer.innerHTML = buildQuest.radio(nowForm.content.length - 1);
					break;
				case "qMore" :
					questType = "checkbox";
					newQuest = createQuest(questType);
			        nowForm.content.push(newQuest);
					qContainer.innerHTML = buildQuest.checkbox(nowForm.content.length - 1);
					break;
				case "qText" :
					questType = "textarea";
					newQuest = createQuest(questType);
			        nowForm.content.push(newQuest);
					qContainer.innerHTML = buildQuest.textarea(nowForm.content.length - 1);
					break;
			};
			formBody.appendChild(qContainer);
			targetQuest = qContainer.getElementsByClassName("quest")[0];
			formBody.appendChild(targetQuest);
			formBody.removeChild(qContainer);
			editQuestBtnEvent(nowForm.content.length - 1);
			if(nowForm.content.length > 1) {
				var moveDownBtn = document.getElementsByClassName("moveDown")[nowForm.content.length - 2];
				moveDownBtn.disabled = false;
			};
			container.style.height = body.offsetHeight * 1.03 + "px";
		};
	},
	returnBtnEvent: function(target) {
		target.onclick = function() {
			parent.changePage(container,"questList.html");
		};
	},
	saveBtnEvent: function(target) {
		target.onclick = function() {
			if(saveForm(0) === true){
				parent.changePage(container,"questList.html");
			};
		};
	},
	submitBtnEvent: function(target) {
		target.onclick = function() {
			if(saveForm(1) === true){
				parent.changePage(container,"questList.html");
			};
		};
	}
};

//问题类型
var buildQuest = {
	//问题下方按钮的模板
	questBtn: function() {
		var qTemplate = "";

		qTemplate += "<div class='questionCtrl'><button class='addAns'>增加选项</button>";
		qTemplate += "<button class='moveUp'>上移</button><button class='moveDown'>下移</button>";
		qTemplate += "<button class='copyQuest'>复制</button><button class='deleteQuest'>删除</button></div>";

		return qTemplate;
	},
	radio: function(index) {
		var template = "",
			targetQuest;

		template += "<div class='quest' id='quest" + index + "'><div class='question'><span>" + (index+1) + ".</span>";
		template += "<span>(单选题)</span>";
		template += "<input class='qTitle' type='text' value='" + nowForm.content[index].qTitle + "'/></div>";

		for(var j = 0;j < nowForm.content[index].options.length;j += 1) {
			template += "<div class='questOption'>";
			template += "<input type='radio' name='q"+ index +"'/>";
			template += "<input class='qOption' type='text' value=" + nowForm.content[index].options[j].oTitle + ">";
			template += "<button name='opt" + j + "' class='deleteQAns'>删除</button></div>";
		};

		template += buildQuest.questBtn();
		return template;
	},
	checkbox: function(index) {
		var template = "",
			targetQuest;

		template += "<div class='quest' id='quest" + index + "'><div class='question'><span>" + (index+1) + ".</span>";
		template += "<span>(多选题)</span>";
		template += "<input class='qTitle' type='text' value='" + nowForm.content[index].qTitle + "'/></div>";
		for(var j = 0;j < nowForm.content[index].options.length;j += 1) {
			template += "<div class='questOption'>";
			template += "<input type='checkbox' name='more'/>";
			template += "<input class='qOption' type='text' value=" + nowForm.content[index].options[j].oTitle + ">";
			template += "<button name='opt" + j + "' class='deleteQAns'>删除</button></div>";
		};

		template += buildQuest.questBtn();
		return template;
	},
	textarea: function(index) {
		var template = "",
			targetQuest;

		template += "<div class='quest' id='quest" + index + "'><div class='question'><span>" + (index+1) + ".</span>";
		template += "<span>(文本题)</span>";
		template += "<input class='qTitle' type='text' value='" + nowForm.content[index].qTitle + "'/></div>";
		template += "<textarea></textarea>";
		template += "<div><input class='requireBtn' type='checkbox'><span>是否必填</span></div>";		


		template += buildQuest.questBtn();
		return template;
	}
};

//页面载入是生成问卷且绑定按钮事件
function editForm() {
	var questType = document.getElementById("questType"),
		formTitle = document.getElementById("title"),
		questions, template;

	questType.style.display = "none";
	formTitle.value = nowForm.title;
	formBody.innerHTML = "";

	for(var i = 0;i < nowForm.content.length;i += 1) {
		switch(nowForm.content[i].qType) {
			case "radio":
				template = buildQuest.radio(i);				
				break;
			case "checkbox":
				template = buildQuest.checkbox(i);
				break;
			case "textarea":
				template = buildQuest.textarea(i);
				break;
		};
		formBody.innerHTML = formBody.innerHTML + template;
	};
	questions = document.getElementsByClassName("quest");

	for(i = 0;i < questions.length;i += 1) {
		editQuestBtnEvent(i);
	};

	container.style.height = body.offsetHeight * 1.03 + "px";
};

//绑定每个问题中按钮的事件
function editQuestBtnEvent(index) {
	var moveUpBtn = formBody.getElementsByClassName("moveUp")[index],
		moveDownBtn = formBody.getElementsByClassName("moveDown")[index],
		addAnsBtn = formBody.getElementsByClassName("addAns")[index],
		copyQuestBtn = formBody.getElementsByClassName("copyQuest")[index],
		deleteQuestBtn = formBody.getElementsByClassName("deleteQuest")[index],
		targetQuest = document.getElementById("quest" + index),
		deleteQAnsBtns,requireBtn;

	btnEvent.moveUpBtnEvent(moveUpBtn);
	btnEvent.moveDownBtnEvent(moveDownBtn);
	btnEvent.addAnsBtnEvent(addAnsBtn);
	btnEvent.copyBtnEvent(copyQuestBtn);
	btnEvent.deleteQuestBtnEvent(deleteQuestBtn);
	index === 0 ? moveUpBtn.disabled = true : moveUpBtn.disabled = false;
	index === nowForm.content.length - 1 ? moveDownBtn.disabled = true : moveDownBtn.disabled = false;
	nowForm.content[index].qType === "textarea" ? addAnsBtn.disabled = true : addAnsBtn.disabled = false;

	if(nowForm.content[index].qType !== "textarea" && nowForm.content[index].options.length !== 0) {
		deleteQAnsBtns = targetQuest.getElementsByClassName("deleteQAns");
		for(var i = 0;i < deleteQAnsBtns.length;i += 1) {
			btnEvent.deleteQAnsBtnEvent(deleteQAnsBtns[i]);
		};
	};

	if(nowForm.content[index].qType === "textarea" && nowForm.content[index].require === true) {
		requireBtn = formBody.getElementsByClassName("quest")[index].getElementsByClassName("requireBtn")[0];
		requireBtn.checked = true;
	};
};

//绑定控制问卷的按钮的事件
function editFormBtnEvent() {
	var addQuestBtn = document.getElementById("questAdd"),
		addRadioBtn = document.getElementById("qSingle"),
		addCheckboxBtn = document.getElementById("qMore"),
		addTextareaBtn = document.getElementById("qText"),	
		returnBtn = document.getElementById("returnBtn"),
		submitBtn = document.getElementById("submitBtn"),
		saveBtn = document.getElementById("saveBtn");

		btnEvent.addQuestBtnEvent(addQuestBtn);
		btnEvent.btnTypeBtnEvent(addRadioBtn);
		btnEvent.btnTypeBtnEvent(addCheckboxBtn);
		btnEvent.btnTypeBtnEvent(addTextareaBtn);
		btnEvent.returnBtnEvent(returnBtn);
		btnEvent.submitBtnEvent(submitBtn);
		btnEvent.saveBtnEvent(saveBtn);
};

editForm();
editFormBtnEvent();

