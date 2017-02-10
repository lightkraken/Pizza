//Image and sound loader

var A = {
	images_to_load : {},
	images : {},
	finished_everything_cb : null,
	counter_cb : null,
	counter : 0,
	
	add_images : function(images){  // {name: [imagefile, optionalCallback]}
		for (i in images) {
			this.images_to_load[i] = images[i];	
		}
	},

	load_assets : function(callback){
		this.finished_everything_cb = callback;
		this.load_images();
	},
	
	load_images : function(){
		var self = this;	
		this.counter = Object.keys(this.images_to_load).length;
		if (this.counter === 0){
			this.finished_everything_cb();
		}
		for (i in this.images_to_load){
			this.images[i] = new Image();
			(function(i){	
				self.images[i].onload = function(){
					if (typeof self.images_to_load[i][1] !== "undefined"){
						self.images_to_load[i][1](self.images[i]);
					}
					self.countdown();
				};
			})(i);
			this.images[i].src = this.images_to_load[i][0];
		}
	},
	
	countdown : function(){
		this.counter -= 1;
		if (this.counter === 0) {
			this.finished_everything_cb();
		}
	},
};