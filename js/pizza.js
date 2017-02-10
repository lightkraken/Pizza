var Pizza = {};

//-------------------------------------------------------------------

Pizza.Load = Scene.new_scene("load");

Pizza.Load.entered = function() {
		this.get_html_elements();
		this.load_menu.css("display","flex");

		//When finished loading assets, open the main menu
 		A.load_assets(function(){
			Scene.push_scene("main_menu");
		});
};

Pizza.Load.obscuring = function() {
	this.load_menu.hide();
};

Pizza.Load.get_html_elements = function() {
	this.load_menu = $("#loading");
};

//-------------------------------------------------------------------

Pizza.Main_Menu = Scene.new_scene("main_menu");

Pizza.Main_Menu.entered = function() {
	this.get_html_elements();
	this.main_menu.css("display","flex");
	this.populate_star_field();
	this.draw_map();
	this.draw_cities();
	this.bind_events();
};

Pizza.Main_Menu.obscuring = function() {
	this.main_menu.hide();
	this.release_events();
};

Pizza.Main_Menu.revealed = function() {
	this.main_menu.show();
	this.bind_events();
};

Pizza.Main_Menu.get_html_elements = function() {
	this.main_menu = $("#main_menu");
	this.canvas = $("#mm_canvas")[0];
	this.context = this.canvas.getContext('2d');
	this.new_york = $("#mm_ny_img");
	this.san_francisco = $("#mm_sf_img");
	this.chicago = $("#mm_ch_img");
};

Pizza.Main_Menu.populate_star_field = function() {
	var number_of_stars = 100;

	for (i=1; i <= 100; i++) {
		var x = U.randInt(0, this.main_menu.width());
		var y = U.randInt(0, this.main_menu.height());
		var width = U.randInt(2,5);

		this.context.fillStyle = "rgb(255,255,255)";
		this.context.rect(x,y,width,width);
		this.context.fill();
	}
};

Pizza.Main_Menu.draw_map = function() {
	mapImg = A.images.map;
	y_offset = 60;
	x = this.canvas.width/2 - mapImg.width/2;
	y = this.canvas.height/2 - mapImg.height/2 + y_offset;
	this.context.drawImage(mapImg, x, y);
};

Pizza.Main_Menu.draw_cities = function() {
	var sq_width = 15;
	var line_width = 4;
	var x;
	var y;
	var color;

	//san fran
	x = 257;
	y = 334;
	color = "green";

	//draw city
	this.context.beginPath();
	this.context.fillStyle = color;
	this.context.rect(x, y, sq_width, sq_width);
	this.context.fill();

	//draw line
	this.context.beginPath();
	this.context.strokeStyle = color;
	this.context.lineWidth = line_width;
	this.context.moveTo(x+5, y+5);
	x -= 58;
	y -= 58;
	this.context.lineTo(x, y);
	x -= 50;
	this.context.lineTo(x, y);
	this.context.stroke();

	//new york
	x = 679;
	y = 299;
	color = "rgb(236,92,24)";

	//draw city
	this.context.beginPath();
	this.context.fillStyle = color;
	this.context.rect(x, y, sq_width, sq_width);
	this.context.fill();

	//draw line
	this.context.beginPath();
	this.context.strokeStyle = color;
	this.context.lineWidth = line_width;
	this.context.moveTo(x+5, y+5);
	x += 120;
	y += 120;
 	this.context.lineTo(x, y);
	x += 60;
	this.context.lineTo(x, y);
	this.context.stroke();

	//chicago
	x = 560;
	y = 305;
	color = "blue";

	//draw city
	this.context.beginPath();
	this.context.fillStyle = color;
	this.context.rect(560, 305, sq_width, sq_width);
	this.context.fill();

	//draw line
	this.context.beginPath();
	this.context.strokeStyle = color;
	this.context.lineWidth = line_width;
	this.context.moveTo(x+5, y+5);
	x += 95;
	y -= 95;
 	this.context.lineTo(x, y);
	x += 200;
	this.context.lineTo(x, y);
	this.context.stroke();
};

Pizza.Main_Menu.bind_events = function() {
	this.new_york.on("click", function(){
		Scene.push_scene("new_york");
	});

	this.chicago.on("click", function(){
		Scene.push_scene("chicago");
	});

	this.san_francisco.on("click", function(){
		Scene.push_scene("san_francisco");
	});
};

Pizza.Main_Menu.release_events = function() {
	this.new_york.off("click");
	this.chicago.off("click");
	this.san_francisco.off("click");
};

//-------------------------------------------------------------------

Pizza.New_York = Scene.new_scene("new_york");

Pizza.New_York.pizzas = {
	cheese : "The Sunspot",
	meat : "Meat Supernova",
	veggie : "Kale Quasar",
};

Pizza.New_York.entered = function(){
	this.get_html_elements();
	this.bind_events();
	this.new_york.show();
};

Pizza.New_York.revealed = function(){
	this.new_york.show();
	this.bind_events();
};

Pizza.New_York.exiting = function(){
	this.new_york.hide();
	this.release_events();
};

Pizza.New_York.obscuring = function(){
	this.new_york.hide();
	this.release_events();
};

Pizza.New_York.get_html_elements = function(){
	var self = this;

	this.new_york = $("#new_york");
	this.back_button = $("#ny_back");
	this.order_cheese = $("#ny_cheese");
	this.order_meat = $("#ny_meat");
	this.order_veggie = $("#ny_veggie");

    $("#new_york_accordion").accordion({
      header: ".accordion_heading",
	  collapsible: true,
	  active: false,
	  heightStyle: "content",
    });

	this.dialog = $("#order_dialog").dialog({
		autoOpen : false,
		resizable : false,
		modal : true,
		minWidth : 400,
		buttons : {
			"Yes" : function(){
				$(this).dialog("close");
				Scene.push_scene("status",[self.chosen_pizza, self.name]);
			},
			"No" : function(){
				$(this).dialog("close");
			},
		},
	});
};

Pizza.New_York.bind_events = function(){
	var self = this;

	this.back_button.on("click", function(){
		Scene.pop_scene();
	});

	this.order_cheese.on("click", function(){
		$("#order_dialog p span").html(self.pizzas.cheese);
		self.chosen_pizza = self.pizzas.cheese;
		self.dialog.dialog("open");
		$("button").blur();
	});

	this.order_meat.on("click", function(){
		$("#order_dialog p span").html(self.pizzas.meat);
		self.chosen_pizza = self.pizzas.meat;
		self.dialog.dialog("open");
		$("button").blur();
	});

	this.order_veggie.on("click", function(){
		$("#order_dialog p span").html(self.pizzas.veggie);
		self.chosen_pizza = self.pizzas.veggie;
		self.dialog.dialog("open");
		$("button").blur();
	});
};

Pizza.New_York.release_events = function(){
	this.back_button.off("click");
	this.order_cheese.off("click");
	this.order_meat.off("click");
	this.order_veggie.off("click");
};

//-------------------------------------------------------------------

Pizza.San_Francisco = Scene.new_scene("san_francisco");

Pizza.San_Francisco.pizzas = {
	cheese : "Lunar Cheese",
	meat : "The MEATeorite",
	veggie : "Venusian Veggie",
};

Pizza.San_Francisco.entered = function(){
	this.get_html_elements();
	this.bind_events();
	this.san_francisco.show();
};

Pizza.San_Francisco.revealed = function(){
	this.san_francisco.show();
	this.bind_events();
};

Pizza.San_Francisco.exiting = function(){
	this.san_francisco.hide();
	this.release_events();
};

Pizza.San_Francisco.obscuring = function(){
	this.san_francisco.hide();
	this.release_events();
};

Pizza.San_Francisco.get_html_elements = function(){
	var self = this;

	this.san_francisco = $("#san_francisco");
	this.back_button = $("#sf_back");
	this.order_cheese = $("#sf_cheese");
	this.order_meat = $("#sf_meat");
	this.order_veggie = $("#sf_veggie");

	this.dialog = $("#order_dialog").dialog({
		autoOpen : false,
		resizable : false,
		modal : true,
		minWidth : 400,
		buttons : {
			"Yes" : function(){
				$(this).dialog("close");
				Scene.push_scene("status",[self.chosen_pizza, self.name]);
			},
			"No" : function(){
				$(this).dialog("close");
			},
		},
	});

	$("#san_fran_accordion").accordion({
      header: ".accordion_heading",
	  collapsible: true,
	  active: false,
	  heightStyle: "content",
    });
};

Pizza.San_Francisco.bind_events = function(){
	var self = this;

	this.back_button.on("click", function(){
		Scene.pop_scene();
	});

	this.order_cheese.on("click", function(){
		$("#order_dialog p span").html(self.pizzas.cheese);
		self.chosen_pizza = self.pizzas.cheese;
		self.dialog.dialog("open");
		$("button").blur();
	});

	this.order_meat.on("click", function(){
		$("#order_dialog p span").html(self.pizzas.meat);
		self.chosen_pizza = self.pizzas.meat;
		self.dialog.dialog("open");
		$("button").blur();
	});

	this.order_veggie.on("click", function(){
		$("#order_dialog p span").html(self.pizzas.veggie);
		self.chosen_pizza = self.pizzas.veggie;
		self.dialog.dialog("open");
		$("button").blur();
	});
};

Pizza.San_Francisco.release_events = function(){
	this.back_button.off("click");
	this.order_cheese.off("click");
	this.order_meat.off("click");
	this.order_veggie.off("click");
};

//-------------------------------------------------------------------

Pizza.Chicago = Scene.new_scene("chicago");

Pizza.Chicago.pizzas = {
	cheese : "Cheese Nebula",
	meat : "The Big Bang",
	veggie : "Absolute Zero",
};

Pizza.Chicago.entered = function(){
	this.get_html_elements();
	this.bind_events();
	this.chicago.show();
};

Pizza.Chicago.revealed = function(){
	this.chicago.show();
	this.bind_events();
};

Pizza.Chicago.exiting = function(){
	this.chicago.hide();
	this.release_events();
};

Pizza.Chicago.obscuring = function(){
	this.chicago.hide();
	this.release_events();
};

Pizza.Chicago.get_html_elements = function(){
	var self = this;

	this.chicago = $("#chicago");
	this.back_button = $("#ch_back");
	this.order_cheese = $("#ch_cheese");
	this.order_meat = $("#ch_meat");
	this.order_veggie = $("#ch_veggie");

	this.dialog = $("#order_dialog").dialog({
		autoOpen : false,
		resizable : false,
		modal : true,
		minWidth : 400,
		buttons : {
			"Yes" : function(){
				$(this).dialog("close");
				Scene.push_scene("status",[self.chosen_pizza, self.name]);
			},
			"No" : function(){
				$(this).dialog("close");
			},
		},
	});

    $("#chicago_accordion").accordion({
      header: ".accordion_heading",
	  collapsible: true,
	  active: false,
	  heightStyle: "content",
    });
};

Pizza.Chicago.bind_events = function(){
	var self = this;

	this.back_button.on("click", function(){
		Scene.pop_scene();
	});

	this.order_cheese.on("click", function(){
		$("#order_dialog p span").html(self.pizzas.cheese);
		self.chosen_pizza = self.pizzas.cheese;
		self.dialog.dialog("open");
		$("button").blur();
	});

	this.order_meat.on("click", function(){
		$("#order_dialog p span").html(self.pizzas.meat);
		self.chosen_pizza = self.pizzas.meat;
		self.dialog.dialog("open");
		$("button").blur();
	});

	this.order_veggie.on("click", function(){
		$("#order_dialog p span").html(self.pizzas.veggie);
		self.chosen_pizza = self.pizzas.veggie;
		self.dialog.dialog("open");
		$("button").blur();
	});
};

Pizza.Chicago.release_events = function(){
	this.back_button.off("click");
	this.order_cheese.off("click");
	this.order_meat.off("click");
	this.order_veggie.off("click");
};

//-------------------------------------------------------------------

Pizza.Status = Scene.new_scene("status");

Pizza.Status.entered = function(info){
	this.address_counter = 0;
	this.status_counter = 0;

	this.get_html_elements();
	this.set_appearance(info);
	this.status.css("display","flex");
	this.bind_events();
	this.detect_address();
	this.begin_making_pizza();
};

Pizza.Status.exiting = function(){
	this.back_button.hide();
	this.release_events();
	this.status.hide();
};

Pizza.Status.get_html_elements = function(){
	this.status = $("#status");
	this.address = $("#status_address");
	this.countdown1 = $("#countdown1");
	this.countdown2 = $("#countdown2");
	this.countdown3 = $("#countdown3");
	this.status_current = $("#status_current");
	this.back_button = $("#status_back");
};

Pizza.Status.set_appearance = function(info){
	var pizza = info[0];
	var location = info[1];

	switch (location) {
		case "chicago":
			$("#status_restaurant").html("Pizza Nebula");
			$("#status_restaurant").addClass("chicago_title");
			break;
		case "new_york":
			$("#status_restaurant").html("Galaxy Pizza");
			$("#status_restaurant").addClass("new_york_title");
			break;
		case "san_francisco":
			$("#status_restaurant").html("Astral Pizza");
			$("#status_restaurant").addClass("san_fran_title");
			break;
	}

	$("#status_pizza span").html(pizza);
};

Pizza.Status.detect_address = function(){
	this.address.empty();
	this.address.html("Detecting address...");

	setTimeout(this.address_blink.bind(this), 400);
};

Pizza.Status.address_blink = function(){
	if (this.address_counter < 8) {
		if (this.address_counter % 2 === 0) {
			this.address.css("color","black");
		} else {
			this.address.css("color","white");
		}

		this.address_counter += 1;
		setTimeout(this.address_blink.bind(this), 400);
	} else {
		this.address.html("Earth, the Solar System");
	}
};

Pizza.Status.begin_making_pizza = function(){
	this.countdown1.css("background-color", "black");
	this.countdown2.css("background-color", "black");
	this.countdown3.css("background-color", "black");
	this.status_current.html("Preparing pizza...");

	setTimeout(this.increment_countdown.bind(this), 10000);
};

Pizza.Status.increment_countdown = function(){
	if (this.status_counter < 2) {
		switch (this.status_counter) {
			case 0:
				this.status_current.html("Baking pizza...");
				this.countdown1.css("background-color", "white");
				break;
			case 1:
				this.status_current.html("Out for delivery...");
				this.countdown2.css("background-color", "white");
				break;
		}

		this.status_counter += 1;
		setTimeout(this.increment_countdown.bind(this), 6000);

	} else {
			this.status_current.html("Delivered!");
			this.countdown3.css("background-color", "white");
			this.back_button.show();
	}
};

Pizza.Status.bind_events = function(){
	this.back_button.on("click", function(){
		Scene.pop_scene();
		Scene.pop_scene();
	});
};

Pizza.Status.release_events = function(){
	this.back_button.off("click");
};

//-------------------------------------------------------------------

Pizza.preload_images = function(){
	A.add_images({
		map : ["images/map.png"],

		red_planet : ["images/red_planet.png", function(img){
			$(img).attr("id","rp_img");
			$("#mm_ny_img").append(img);
		}],

		blue_planet : ["images/blue_planet.png", function(img){
			$(img).attr("id","bp_img");
			$("#mm_ch_img").append(img);
		}],

		green_planet : ["images/green_planet.png", function(img){
			$(img).attr("id","gp_img");
			$("#mm_sf_img").append(img);
		}],

		cheese_pizza : ["images/cheese_pizza.png", function(img){
			$(img).prependTo(".cheese");
		}],

		meat_pizza : ["images/meat_pizza.png", function(img){
			$(img).prependTo(".meat");
		}],

		veggie_pizza : ["images/veggie_pizza.png", function(img){
			$(img).prependTo(".veggie");
		}],

		pizzacat : ["images/pizzacat.gif", function(img){
			$("#pizzacat").append(img);
		}],
	});
};

Pizza.scale_site = function(){
	var pizza_width = 1012;
	var pizza_height = 612;
	var window_width = $(window).width();
	var window_height = $(window).height();
	var scale = function(amount1, amount2){
		amount1 = Number(amount1.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
		amount2 = Number(amount2.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
		var amount = amount1 < amount2 ? amount1 : amount2;
		$('#viewport').css('transform', 'scale(' + amount + ')');
		$('.shrinking-dialog').remove();
		$( '<style class="shrinking-dialog">.ui-dialog{transform: scale(' + amount + ')}</style>' ).appendTo( 'head' );
	};

	if ((window_height < pizza_height) || (window_width < pizza_width) ) {
		scale(window_height / pizza_height, window_width / pizza_width);
	}
};

Pizza.start = function(){
	this.preload_images();
	Pizza.scale_site();
	$(window).resize(Pizza.scale_site);
	Scene.start("load");
};
