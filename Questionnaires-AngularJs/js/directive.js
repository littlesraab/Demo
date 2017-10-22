var directives = {};

//返回按钮指令
directives.backFormList = function() {
	return {
		restrict: 'EA',
		replace: true,
		template: "<div class='back'>"
		        + "<a class='pageCtrl' ui-sref='forms.formList'>返回</a>"
				+ "</div>"
	}
};
//获取问题类型的指令
directives.getType = function(getType) {
	return {
		restrict: 'EA',
		replace: true,
		template: "<span>({{getTypeFunc(question.qType)}})</span>",
		link: function(scope, element, attrs) {
			scope.getTypeFunc = function(type) {
				return getType.getTypeFunc(type);
			};
		}
	}
};
//转换页面指令
directives.changePage = function($location, $rootScope) {
	return {
		restrict: "EA",
		replace: true,
		transclude: true,
		template: "<button class='questBtn' ng-transclude></button>",
		link: function(scope, element, attrs) {
			if(attrs.disable === "true") {
				element.attr("disabled", "true");
			};

			scope.changePageFunc = function(index, pageName) {
				$rootScope.selected = index;
				$location.path('forms/' + pageName);
				scope.$apply();
			};
			//绑定事件
			element.on("click", function() {				
				scope.changePageFunc(attrs.index, attrs.name);
			});
		}
	}
};

//加在表格数据页面的样式指令
directives.setStyle = function() {
	return {
		restrict: "EA",
		replace: true,
		transclude: true,
		template: 	"<div class='dOData'>"
				  + "<p class='oData' ng-transclude></p>"
				  +	"</div>",
		link: function(scope, element, attrs) {
			if(attrs.parentIndex === "undefined") {
				scope.tempData = parseInt(scope.selectedForm.content[attrs.index].oData / scope.selectedForm.qData * 100);
			}else {
				scope.tempData = parseInt(scope.selectedForm.content[attrs.parentIndex].options[attrs.index].oData / scope.selectedForm.qData * 100);
			};
			element.children("p").css("width", scope.tempData + "%");
		}
	}
};
//编辑问卷页面各个问题的操作按钮
directives.addOptionsBtn = function() {
	return {
		restrict: "EA",
		link: function(scope, element, attrs) {
			if(scope.selectedForm.content[attrs.index].options === undefined) {
				element.attr("disabled", "true");
			}else {
				element.on("click", function() {
					scope.questionAction(attrs.index, "addOption");
					scope.$apply();
				});
			};
		}		
	}
};

directives.moveUpBtn = function() {
	return {
		restrict: "EA",
		link: function(scope, element, attrs) {
			element.on("click", function() {
				scope.questionAction(parseInt(attrs.index), "moveUp");
				scope.$apply();
			});				
		}		
	}
};

directives.moveDownBtn = function() {
	return {
		restrict: "EA",
		link: function(scope, element, attrs) {
			element.on("click", function() {
				scope.questionAction(parseInt(attrs.index), "moveDown");
				scope.$apply();
			});			 
		}		
	}
};

directives.copyBtn = function() {
	return {
		restrict: "EA",
		link: function(scope, element, attrs) {
			element.on("click", function() {
				scope.questionAction(parseInt(attrs.index), "copyQuestion");
				scope.$apply();
			});
		}		
	}
};

directives.deleteBtn = function() {
	return {
		restrict: "EA",
		link: function(scope, element, attrs) {
			element.on("click", function() {
				scope.questionAction(parseInt(attrs.index), "deleteQuestion");
				scope.$apply();
			});
		}		
	}
};

directives.deleteOption = function() {
	return {
		restrict: "EA",
		link: function(scope, element, attrs) {
			element.on("click", function() {
				scope.selectedForm.content[attrs.parentIndex].options.splice(attrs.index, 1);
			});
		}
	}
};
//编辑页面的添加问题操作
directives.checkQuestionNumber = function() {
	return {
		restrict: "EA",
		controller: function($scope) {
			this.checkQuestionNumber = function() {
				if($scope.selectedForm.content.length > 9) {
					console.log("问题数码超过10");
					return false;
				}else {
					return true;
				};
			};
		}
	}
};

directives.addRadio = function() {
	return {
		restrict: "EA",
		require: "checkQuestionNumber",
		link: function(scope, element, attrs, checkQuestionNumberCtrl) {
			element.on("click", function() {
				if(checkQuestionNumberCtrl.checkQuestionNumber() === true) {
					scope.newQuestionTemp = {
						"qTitle": "newQTitle",
						"qType": "radio",
						"options": [
							{
								"oTitle": "oTitle1",
								"oData": 0
							},
							{
								"oTitle": "oTitle2",
								"oData": 0
							}
						]
					};
					scope.selectedForm.content.push(scope.newQuestionTemp);
					scope.$apply();
				};
			});
		}
	}
};

directives.addCheckbox = function() {
	return {
		restrict: "EA",
		require: "checkQuestionNumber",
		link: function(scope, element, attrs, checkQuestionNumberCtrl) {
			element.on("click", function() {
				if(checkQuestionNumberCtrl.checkQuestionNumber() === true) {
					scope.newQuestionTemp = {
						"qTitle": "newQTitle",
						"qType": "checkbox",
						"options": [
							{
								"oTitle": "oTitle1",
								"oData": 0
							},
							{
								"oTitle": "oTitle2",
								"oData": 0
							}
						]
					};
					scope.selectedForm.content.push(scope.newQuestionTemp);
					scope.$apply();
				};
			});
		}
	}
};

directives.addTextarea = function() {
	return {
		restrict: "EA",
		require: "checkQuestionNumber",
		link: function(scope, element, attrs, checkQuestionNumberCtrl) {
			element.on("click", function() {
				if(checkQuestionNumberCtrl.checkQuestionNumber() === true) {
					scope.newQuestionTemp = {
						"qTitle": "newQTitle",
						"qType": "textarea",
						"require": false,
						"oData": 0
					};
					scope.selectedForm.content.push(scope.newQuestionTemp);
					scope.$apply();
				};
			});
		}
	}	
}
//保存问卷的操作
directives.saveForm = function($location, $rootScope) {
	return {
		restrict: "EA",
		link: function(scope, element, attrs) {
			element.on("click", function() {
				if(scope.saveForm(attrs.type)){
					$rootScope.selected = undefined;
					$location.path('forms/formList');
					scope.$apply();
				};
			});
		}
	}
};

directives.calendar = function() {
	return {
		restrict: "EA",
		replace: true,
		templateUrl: "templates/calendar.html"
	}
};

formApp.directive(directives);