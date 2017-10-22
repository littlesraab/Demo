//过滤器为在问卷数据页面为数据加上百分号
formApp.filter("percent", function() {
	return function(target) {
		var result = target.toFixed(0) + "%";

		return result;
	};
});