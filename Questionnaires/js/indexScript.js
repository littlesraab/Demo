//声明iframe变量、问卷列表还有被选中的的问卷地址
var container = document.getElementById("main"),
	forms, selected;


container.data = 1;
//取得JSON中的问卷列表
function checkData(data) {
	forms = data.forms;
};

//根据内容多少生成iframe的高度
function setHeight(container) {
	var containerH = this.document.body.scrollHeight;
	container.height = containerH;
};

//改变iframe的src
function changePage(container,url) {
	container.src = url;
};

window.onload = function() {

	//动态生成srcipt，跨域取得本地JSON
	var script = document.createElement("script"),
		target = document.getElementsByTagName("body")[0];
	
	script.type = "text/javascript";
	script.src = "JSON/data.json";
	target.appendChild(script);

	//改变iframe的src
	container.src = "homeMain.html";
};
