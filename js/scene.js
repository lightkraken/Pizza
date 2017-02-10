//Scene manager

var Scene = {
	scene_stack : [],
	scenes : {},
};

Scene.BasicScene = {
	init : function(name){
		this.name = name;
		return this;
	},
	entered : function(){},
	obscuring : function(){},
	revealed : function(){},
	exiting : function(){},		
};

Scene.start = function(scene){	
	this.push_scene(scene);
};

Scene.push_scene = function(scene, args){
	if (this.scene_stack.length > 0) {
		this.scene_stack[this.scene_stack.length-1].obscuring();
	}
	this.scene_stack.push(Object.create(this.scenes[scene]));	
	this.scene_stack[this.scene_stack.length-1].entered(args);
};

Scene.pop_scene = function(){
	this.scene_stack[this.scene_stack.length-1].exiting();		
	this.scene_stack.pop();
	this.scene_stack[this.scene_stack.length-1].revealed();	
};

Scene.new_scene = function(name){	
	this.scenes[name] = Object.create(this.BasicScene).init(name);
	return this.scenes[name];
};