var dataint = {
	'data' : [
			  {'src': 'img1.png'},
			  {'src': 'img2.png'},
			  {'src': 'img3.png'},
			  {'src': 'img4.png'},
			  {'src': 'img5.png'},
			  {'src': 'img6.png'},
			  {'src': 'img7.png'},
			  {'src': 'img8.png'},
			  {'src': 'img9.png'}
			 ]
};


	

var showbig = function() {
	var mainer = document.getElementById("main");
	mainer.onclick = function(e) {
		e = window.event || e;
		var target = e.target || event.srcElement;
		console.log(target.tagName);
		if(target.tagName.toLowerCase() === "img") {
			var scrolltop = document.body.scrollTop || document.documentElement.offsetTop;
			var darken = document.createElement("div");
			darken.setAttribute("class", "darken");
			darken.style.top = scrolltop + "px";
			var aimg = document.createElement("img");
			aimg.src = target.src;
			aimg.setAttribute("alt", "img");
			var adiv = document.createElement("div");
			darken.appendChild(adiv);
			darken.appendChild(aimg);
			document.body.appendChild(darken);
			document.body.style.overflow = "hidden";
			
			re();
		}
	}
}

var re = function() {
	var main = document.getElementById("main");
	if(document.getElementsByClassName("darken")) {
		var darken = document.getElementsByClassName("darken")[0];
		var darkendiv = darken.getElementsByTagName("div")[0];
		var darkenimg = darken.getElementsByTagName("img")[0];
		darkendiv.onclick = function() {
			darken.parentNode.removeChild(darken);
			document.body.style.overflow = "auto";
		}
	}
}

var activeadd = function() {
	var parent = document.getElementById("main");
	window.onscroll = function() {
		if(checkscrollside()) {	
			for(var i = 0; i < dataint.data.length; i++) {
				var pin = document.createElement("div");
				pin.className = "pin";
				var box = document.createElement("div");
				box.className = "box";
				var img = document.createElement("img");
				img.src = "img/" + dataint.data[i]['src'];
				box.appendChild(img);
				pin.appendChild(box);
				parent.appendChild(pin);
			}
			waterfall();
		}				
	}
}

var waterfall =function() {
	var parent = document.getElementById("main");
	var pins = document.getElementsByClassName("pin");
	var apw = pins[0].offsetWidth;
	var num = Math.floor(document.documentElement.clientWidth/apw);	
	var documentW = document.documentElement.clientWidth;
	parent.style.width = num * apw + "px";
	parent.style.marginLeft = Math.floor((documentW - parseInt(parent.style.width))/2) + "px";

	var pinsh = [];
	for(var i = 0; i < pins.length; i++) {
		var pinh = pins[i].offsetHeight;
		if(i < num) {
			pinsh[i] = pinh;
		}else {
			var minh = Math.min.apply(null, pinsh);
			var minhindex = getminindex(pinsh, minh);
			pins[i].style.position = "absolute";
			pins[i].style.top = minh + "px";
			pins[i].style.left = minhindex * apw + "px";
			pinsh[minhindex] += pins[i].offsetHeight;
		}
	}
};
	

var getminindex = function(arr, min) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] === min) {
			return i;
		}
	}
}

var checkscrollside = function() {
	var parent = document.getElementById("main");
	var	pins = document.getElementsByClassName("pin");
	var	lastpinh = pins[pins.length - 1].offsetTop + Math.floor(pins[pins.length - 1].offsetHeight/2);
	var	scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
	var	documenth = document.documentElement.clientHeight;
	return lastpinh < scrolltop + documenth;
}

waterfall();
activeadd();
showbig();

