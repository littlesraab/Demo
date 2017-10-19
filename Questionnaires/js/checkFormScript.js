var forms = parent.forms,
	selected = parent.selected,
	container = parent.container,
	body = document.getElementsByTagName("body")[0],
	formBody = document.getElementById("cBody"),
	nowForm;

//根据是否有特定问卷是否进行转跳
if(selected === undefined) {
	console.log("你还没选择问卷");
	parent.changePage("questList.html");
}else {
	nowForm = forms[selected];
};

//提交问卷的方法
function submitData() {
	var cQuests = document.getElementsByClassName("cQuest"),
		textareaes = document.getElementsByTagName("textarea"),
		result, index, cOptions;

	//若为文本题，要根据其是否必填来进行检验
	for(var i = 0;i < textareaes.length;i += 1) {
		index = parseInt(textareaes[i].parentNode.id.charAt(textareaes[i].parentNode.id.length - 1));

		if(textareaes[i].value === "" && nowForm.content[index].require === true) {
			//若为必填而没填，则不能提交
			result = false;
			break;
		}else{
			result = true;
		};

		//要必填的文本题通过检验后，才改变数据
		if(result === true) {
			parent.forms[selected].qData += 1;
			if(textareaes[i].value !== "") {
				parent.forms[selected].content[index].oData += 1;
			};
		};
	};

	//要必填文本通过检测，才能检测其他题目
	for(i = 0;i < nowForm.content.length;i += 1) {
		if(result === true && nowForm.content[i].qType !== "textarea") {
			cOptions = cQuest[i].getElementsByClassName("cOption");
			for(var j = 0;j < nowForm.content[i].options.length;j += 1) {
				if(cOptions[j].checked === true) {
					nowForm.content[i].options[j].oData += 1;
				};
			};
		};
	};

	return result;
};
//按钮事件合集
var btnEvent = {
	returnBtnEvent: function(target) {
		target.onclick = function() {
			parent.changePage(container,"questList.html");
		};	
	},
	reflashBtnEvent: function(target) {
		target.onclick = function() {
			parent.changePage(container,"checkForm.html");
		};
	},
	submitBtnEvnet: function(target) {
		target.onclick = function() {
			if(submitData() === true) {
				console.log("succeed");
				parent.changePage(container,"questList.html");
			}else {
				console.log("fail");
			};
		};
	}
};
//问题模板合集
var bulidForm = {
	radio: function(index) {
		var template = "";

		template += "<div id='cQuest" + index + "' class='cQuest'><div class='cQData'><span>" + (index + 1) + ".</span>";
		template += "<span class='cQKind'>(单选题)</span>";
		template += "<span class='cQTitle'>" + nowForm.content[index].qTitle + "</span>";
		template += "</div>";
		for(var i = 0;i < nowForm.content[index].options.length; i += 1) {
			template += "<div class='cQAns'><input type='radio' class='cOption' name='cQAn" + i + "'/>";
			template += "<span class='cQAContent'>" + nowForm.content[index].options[i].oTitle + "</span></div>";
		};
		template += "</div>";
		formBody.innerHTML = formBody.innerHTML + template;
	},
	checkbox: function(index) {
		var template = "";

		template += "<div id='cQuest" + index + "' class='cQuest'><div class='cQData'><span>" + (index + 1) + ".</span>";
		template += "<span class='cQKind'>(多选题)</span>";
		template += "<span class='cQTitle'>" + nowForm.content[index].qTitle + "</span>";
		template += "</div>";
		for(var i = 0;i < nowForm.content[index].options.length; i += 1) {
			template += "<div class='cQAns'><input type='checkbox' class='cOption' name='cQAn" + i + "'/>";
			template += "<span class='cQAContent'>" + nowForm.content[index].options[i].oTitle + "</span></div>";
		};
		template += "</div>";
		formBody.innerHTML = formBody.innerHTML + template;
	},
	textarea: function(index) {
		var template = "";

		template += "<div id='cQuest" + index + "' class='cQuest'><div class='cQData'><span>" + (index + 1) + ".</span>";
		template += "<span class='cQKind'>(文字题)</span>";
		template += "<span class='cQTitle'>" + nowForm.content[index].qTitle + "</span>";
		if(nowForm.content[index].require === true) {
			template += "<span>(必填)</span>";
		};
		template += "<textarea class='cTA'></textarea>";
		template += "</div>";
		formBody.innerHTML = formBody.innerHTML + template;
	}
};
//生成问卷
function editForm() {
	var cTitle = document.getElementById("cTitle"),
		cCtrl = document.getElementById("cCtrl");

	cTitle.innerHTML = nowForm.title;
	//判定问题类型
	for(var i = 0;i < nowForm.content.length;i += 1) {
		switch(nowForm.content[i].qType) {
			case "radio":
				bulidForm.radio(i);
				break;
			case "checkbox":
				bulidForm.checkbox(i);
				break;
			case "textarea":
				bulidForm.textarea(i);
				break;
		};
	};
	var template = "";

	if(nowForm.status === 1) {
			template = "<button id='reflashBtn'>重填问卷</button><button id='submitBtn'>提交问卷</button>";
		};
	template += "<button id='returnBtn'>返回</button>";
	//确定HTML和问卷元素的高度		
	cCtrl.innerHTML = template;
	container.style.height = body.offsetHeight * 1.03 + "px";
};
//绑定按钮事件
function editBtnEvent() {
	var returnBtn = document.getElementById("returnBtn"),
		reflashBtn = document.getElementById("reflashBtn"),
		submitBtn = document.getElementById("submitBtn");

	btnEvent.returnBtnEvent(returnBtn);
	btnEvent.reflashBtnEvent(reflashBtn);
	btnEvent.submitBtnEvnet(submitBtn);
};

editForm();
editBtnEvent();