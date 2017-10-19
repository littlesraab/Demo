var forms = parent.forms,
	selected = parent.selected,
	container = parent.container,
	body = document.getElementsByTagName("body")[0],
	formBody = document.getElementById("dBody"),
	nowForm;
//根据是否有特定问卷是否进行转跳
if(selected === undefined) {
	alert("你还没选择问卷!");
	parent.changePage("questList.html");
}else {
	nowForm = forms[selected];
};
//生成比例条
function editDataRow(index) {
	var dQAnIs = document.getElementById("dQuest" + index).getElementsByClassName("dQAnI");

	for(var i = 0;i < dQAnIs.length;i += 1) {
		if(nowForm.content[index].qType !== "textarea") {
			dQAnIs[i].style.width = parseInt(nowForm.content[index].options[i].oData/nowForm.qData * 100) + "%";
			dQAnIs[i].innerHTML = parseInt(nowForm.content[index].options[i].oData/nowForm.qData * 100) + "%";
		}else {
			dQAnIs[i].style.width = parseInt(nowForm.content[index].oData/nowForm.qData * 100) + "%";
			dQAnIs[i].innerHTML = parseInt(nowForm.content[index].oData/nowForm.qData * 100) + "%";
		};
	};
};
//事件合集
var btnEvent = {
	returnBtnEvent: function(target) {
		target.onclick = function() {
			parent.changePage(container,"questList.html");
		};		
	} 
};
//题目的模板
var buildQuest = {
	radio: function(index) {
		var template = "";

		template += "<div class='dQuest' id='dQuest" + index + "'><div class='dQData'><span class='dQKind'>" + (index + 1) + ".(单选题)</span>";
		template += "<span class='dQTitle'>" + nowForm.content[index].qTitle + "</span>";
		template += "</div>";
		for(var i = 0;i < nowForm.content[index].options.length; i += 1) {
			template += "<div class='dQAn'><span>" + nowForm.content[index].options[i].oTitle + ":<span>";
			template += "<span>" + nowForm.content[index].options[i].oData + "<span><div class='dQAnO'><div class='dQAnI'></div></div></div>";
		};
		template += "</div>";
		formBody.innerHTML = formBody.innerHTML + template;
	},
	checkbox: function(index) {
		var template = "";

		template += "<div class='dQuest' id='dQuest" + index + "'><div class='dQData'><span class='dQKind'>" + (index + 1) + ".(多选题)</span>";
		template += "<span class='dQTitle'>" + nowForm.content[index].qTitle + "</span>";
		template += "</div>";
		for(var i = 0;i < nowForm.content[index].options.length; i += 1) {
			template += "<div class='dQAn'><span>" + nowForm.content[index].options[i].oTitle + ":<span>";
			template += "<span>" + nowForm.content[index].options[i].oData + "<span><div class='dQAnO'><div class='dQAnI'></div></div></div>";
		};
		template += "</div>";
		formBody.innerHTML = formBody.innerHTML + template;
	},
	textarea: function(index) {
		var template = "";

		template += "<div class='dQuest' id='dQuest" + index + "'><div class='dQData'><span class='dQKind'>" + (index + 1) + ".(文本题)</span>";
		template += "<span class='dQTitle'>" + nowForm.content[index].qTitle + "</span>";
		template += "<span>(必填)</span>";
		template += "</div>";
		template += "<div class='dQAn'><span>本题有效回答率:</span><span>" + nowForm.content[index].oData + "</span>";
		template += "<div class='dQAnO'><div class='dQAnI'></div><div></div>";
		template += "</div>";
		formBody.innerHTML = formBody.innerHTML + template;
	},
};
//生成问卷列表
function editForm() {
	var dCtrl = document.getElementById("dCtrl"),
		dTitle = document.getElementById("dTitle"),
		returnBtn;

	dTitle.innerHTML = nowForm.title;

	for(var i = 0;i < nowForm.content.length;i += 1) {
		switch(nowForm.content[i].qType) {
			case "radio":
				buildQuest.radio(i);
				break;
			case "checkbox":
				buildQuest.checkbox(i);
				break;
			case "textarea":
				buildQuest.textarea(i);
				break;
		};
		editDataRow(i);
	};
	dCtrl.innerHTML = "<button id='returnBtn'>返回</button>";
	returnBtn = document.getElementById("returnBtn");
	btnEvent.returnBtnEvent(returnBtn);
	container.style.height = body.offsetHeight * 1.1 + "px";
};

editForm();