formApp.factory("getType", function() {
	var factory = {};

	factory.getTypeFunc = function(type) {
		switch (type) {
			case "radio":
				return "单选题";
			case "checkbox":
				return "多选题";
			case "textarea":
				return "文本题";
			default:
				break;
		};
	};
	return factory;
});