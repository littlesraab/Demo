//声明变量
var checkQuest = document.getElementsByClassName("pageCtrl")[0],
	createQuest = document.getElementsByClassName("pageCtrl")[1],
	//iframe中取父页面的元素
	container = parent.container,
	//确定iframe中body的高度
	bodyH = document.getElementsByTagName("body")[0].offsetHeight;

//通过iframe的body高度确定iframe高度
container.style.height = bodyH * 1.5 + "px";

//绑定按钮事件
checkQuest.onclick = function () {
	parent.changePage(container,"questList.html");
};

createQuest.onclick = function() {
	parent.changePage(container,"editForm.html");
};