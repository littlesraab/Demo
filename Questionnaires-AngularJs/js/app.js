//注入主模块依赖的其他模块
var formApp = angular.module("formApp", ["ui.router","ngAnimate"]);

//把$state和$stateParams放到$rootScope中方便以后调用
formApp.run(function($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
});

//配置路由，主页面分为头部和主体，路由只是在主体部分加载不同的模板
formApp.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/forms");

	$stateProvider
		.state("forms", {
			url: "/forms",
			views: {
				'': {
					templateUrl: "templates/home.html",
					controller: "homeCtrl"
				},
				'head@forms': {
					templateUrl: "templates/homeHead.html"

				},
				'main@forms': {
					templateUrl: "templates/homeMain.html"
				}
			}
		})
		.state("forms.formList", {
			url: "/formList",
			views: {
				"main@forms": {
					templateUrl: "templates/formList.html",
					controller: "formListCtrl"
				}				
			}
		})
		.state("forms.editForm", {
			url: "/editForm",
			views: {
				"main@forms": {
					templateUrl: "templates/editForm.html",
					controller: "editFormCtrl"
				}
			}
		})
		.state("forms.checkForm", {
			url: "/checkForm",
			views: {
				"main@forms": {
					templateUrl: "templates/checkForm.html",
					controller: "checkFormCtrl"
				}
			}
		})
		.state("forms.formData", {
			url: "/formData",
			views: {
				"main@forms": {
					templateUrl: "templates/formData.html",
					controller: "formDataCtrl"
				}
			}
		})
});