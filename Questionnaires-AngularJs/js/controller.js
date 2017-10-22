var controllers = {};

controllers.homeCtrl = function($rootScope, $scope, $http) {
	//用$http取得JSON且转换成js中的问卷列表，且放在$rootScope上，让各个页面可以用
	$http.get("../angularJs/JSON/data.json")
		.success(function(data) {
			$rootScope.forms = data.forms;
		}).error(function(data) {
			console.log("error!");
		});

	//存放被选中的问卷
	$rootScope.selected = undefined;
};

controllers.formListCtrl = function($rootScope, $scope, $location) {
	//取消之前所选的问卷
	$rootScope.selected = undefined;

	//刷新全选按钮，确保为未选
	$scope.isSelectAll = false;

	//读取和更新问卷的状态
	$scope.getStatus = function(target) {
		var now = new Date();
		var deadlineArr,deadline;
		for(var i = 0;i < $rootScope.forms.length; i += 1) {
			deadlineArr = $rootScope.forms[i].deadline.split("-");
			deadline = new Date(deadlineArr[0],deadlineArr[1],deadlineArr[2]);
			
			if(target === 1 && deadline.getTime() - now.getTime() < 0) {
				$rootScope.forms[i].status = 2;
			};
		};

		switch (target) {
      		case 0:
        		return "未发布";
      		case 1:
        		return "发布中";
      		default:
        		return "已结束";
    	};
	};

	//删除单个问卷的方法
	$scope.deleteForm = function(index) {
		if($rootScope.forms[index].status === 1) {
			alert('"' + $rootScope.forms[index].title + '"正在发布中，不能删除');
		}else {
			$rootScope.forms.splice(index, 1);
		}
	};

	//全选按钮的方法，即历遍问卷列表，逐一改变其值
	$scope.selectAll = function(selAllBtn) {		
		for(var i = 0; i < $rootScope.forms.length; i += 1) {
			$rootScope.forms[i].select = selAllBtn;
		};
	};

	//历遍问卷列表，删除和要求的问卷
	$scope.deleteAll = function() {
		for(var i = 0; i < $rootScope.forms.length; i += 1) {
			if($rootScope.forms[i].status !== 1) {
				$rootScope.forms.splice(index, 1);
			};
		};
	};

	//确定所选的问卷，并进行路由的改变
	$scope.changePage = function(index, page) {
		$rootScope.selected = index;
		$location.path('forms/' + page);
	};
};

controllers.editFormCtrl = function($rootScope, $scope, $location, getType) {
	$scope.template = undefined;
	//确定日历所在的容器
	var container = document.getElementById("calendar");
	//生成实例
	var myCalendar = new calendar(container);
	myCalendar.init();

	//确定是编辑问卷还是新建问卷
	if($rootScope.selected === undefined) {
		$scope.selectedForm = {
			"title": "这里是问卷的标题",
      		"deadline": "2018-1-1",
      		"status": 0,
      		"content": []
		};
	}else{
		$scope.selectedForm = $rootScope.forms[$rootScope.selected];
	};

	//问题下方各个题目的按钮事件
	$scope.questionAction = function(index, type) {
		switch(type) {
			case "moveUp":
				$scope.template = $scope.selectedForm.content[index - 1];
				$scope.selectedForm.content[index - 1] = $scope.selectedForm.content[index];
				$scope.selectedForm.content[index] = $scope.template;
				break;
			case "moveDown":
				$scope.template = $scope.selectedForm.content[index];
				$scope.selectedForm.content[index] = $scope.selectedForm.content[index + 1];				
				$scope.selectedForm.content[index + 1] = $scope.template;
				break;
			case "addOption":
				$scope.selectedForm.content[index].options.push({'oTitle': 'newOption', 'oData': 0});
				break;
			case "copyQuestion":
				if($scope.selectedForm.content.length > 9) {
					alert("问题数码超过10");
				}else {
					$scope.template = angular.copy($scope.selectedForm.content[index]);
					$scope.selectedForm.content.push($scope.template);
				};
				break;
			case "deleteQuestion":
				$scope.selectedForm.content.splice(index, 1);
				break;
		};
	};

	//保存修改好的问卷，并保证各个问题合符要求
	$scope.saveForm = function(type) {
		$scope.pass = true;
		$scope.now = new Date();
		$scope.selectedFormTime = $scope.selectedForm.deadline.split("-");
		$scope.formDeadLine = new Date($scope.selectedFormTime[0], $scope.selectedFormTime[1] + 1, $scope.selectedFormTime[2]);
		if($scope.now.getTime() - $scope.formDeadLine.getTime() >= 0) {
			alert("时间不对");
			$scope.pass = false;
		}else {
			$scope.selectedForm.deadline = $("#cText").val();
		};


		if ($scope.selectedForm.title === "") {
			alert("标题不对");
			$scope.pass = false;
		};

		if($scope.selectedForm.content.length === 0) {
			alert("至少要有一个问题");
			$scope.pass = false;
		};

		for(var i = 0;i < $scope.selectedForm.content.length;i += 1) {
			if($scope.selectedForm.content[i].qTitle === "") {
				alert("有标题不对");
				$scope.pass = false;
			};
			if($scope.selectedForm.content[i].qType !== "textarea") {
				for(var j = 0;j < $scope.selectedForm.content[i].options.length;j += 1) {
					if($scope.selectedForm.content[i].options[j].oTitle === "") {
						alert("有标题不对");
						$scope.pass = false;
					};
				};
			};
		};

		//若各个问题都合符要求，就确定问卷的状态并且修改问卷列表
		if($scope.pass === true) {
			if(type === "0") {
				$scope.selectedForm.status = 0;
			}else {
				$scope.selectedForm.status = 1;
			};
			
			if($rootScope.selected === undefined) {
				$rootScope.forms.push($scope.selectedForm);
			}else {
				$rootScope.forms[$rootScope.selected] = $scope.selectedForm;
			};
		};
		return $scope.pass;
	};	
};

controllers.checkFormCtrl = function($rootScope, $scope, $location, getType) {
	//确定被选的问卷
	$scope.selectedForm = $rootScope.forms[$rootScope.selected];
	//确定问卷未被修改前的状态
	$scope.copyForm = angular.copy($scope.selectedForm);
	//确定问卷是否已经保存了
	$scope.pass = true;

    //在确定提交问卷后修改问卷数据
	$scope.saveFormData = function() {
		for(var i = 0;i < $scope.selectedForm.content.length; i += 1) {
			if($scope.selectedForm.content[i].qType === "textarea" && $scope.selectedForm.content[i].require === true) {
				var targetTextarea = document.getElementsByClassName("cQuestion")[i].getElementsByTagName("textarea")[0];
				if(targetTextarea.value === "") {
					$scope.pass = false;
					break;
				};
			};
		};

		if($scope.pass === true) {
			var targets;
			for(i = 0;i < $scope.selectedForm.content.length; i += 1) {
				if($scope.selectedForm.content[i].qType !== "textarea") {
					targets = document.getElementsByClassName("cQuestion")[i].getElementsByTagName("input");
					for(var j = 0;j < targets.length; j += 1) {
						if(targets[j].checked === true) {
							$scope.selectedForm.content[i].options[j].oData += 1;
						};
					};
				}else {
					if($scope.selectedForm.content[i].require !== true) {
						targets = document.getElementsByClassName("cQuestion")[i].getElementsByTagName("textarea")[0];
						if(targets.value !== "") {
							$scope.selectedForm.content[i].oData += 1;
						};
					}else {
						$scope.selectedForm.content[i].oData += 1;
					};
				};
			};
			$scope.selectedForm.qData += 1;
			$rootScope.forms[$rootScope.selected] = $scope.selectedForm;
			$location.path("forms/formList");
		}else {
			alert("保存失败，有必填题目未填写");
		};
	};
};

controllers.formDataCtrl = function($rootScope, $scope, $location, getType) {
	$scope.selectedForm = $rootScope.forms[$rootScope.selected];
};

formApp.controller(controllers);
