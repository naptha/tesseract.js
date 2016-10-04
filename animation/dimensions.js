var dimensions = {

	width:0,

	height:0,

	getWidth: function () {
		if (window.innerWidth) {
		   return window.innerWidth;
		}
		if (document.documentElement && document.documentElement.clientHeight){
			return document.documentElement.clientWidth;
		}
		if (document.body) {
			return document.body.clientWidth;
		}
		return 0;
	},

	getHeight: function () {
		if (window.innerWidth) {
		   return window.innerHeight;
		}
		if (document.documentElement && document.documentElement.clientHeight){
			return document.documentElement.clientHeight;
		}
		if (document.body) {
			return document.body.clientHeight;
		}
		return 0;
	},

	update: function () {
		var curW = this.getWidth()
		var curH = this.getHeight()
		if (curW!=this.width||curH!=this.height){
			this.width=curW
			this.height=curH
			return true
		}
		return false
	}	
}
