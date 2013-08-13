var Portfolio = {};

//FUNCTION

Portfolio.chargerImage = function(img, src){
	var image = new Image();
	image.onload = function(){
	  img.setAttribute("src",image.src);
	}
	image.src = src;
}

Portfolio.nameTransitionEnd = function(){
	var eventName = "";
	if( $.browser.webkit ) {
		eventName = "webkitTransitionEnd";
	} else if( $.browser.mozilla ) {
		eventName = "transitionend";
	} else if ($.browser.opera) {
		eventName = "oTransitionEnd";
	} else if ($.browser.msie) {
		eventName = "msTransitionEnd";
	}
	return eventName;
}

//MODEL & COLLECTION

Portfolio.WorkModel = Backbone.Model.extend({
	idAttribute : 'slug'
});

Portfolio.WorksCollection = Backbone.Collection.extend({
	model: Portfolio.WorkModel,
	url: 'works.json'
});

//VIEW

Portfolio.WorksCollectionView = Backbone.View.extend({
	el : $('#works'),
	initialize : function() {
	    this.template = _.template($('#works-collection-template').html());
	
	    _.bindAll(this, 'render');
	    this.collection.on('reset', this.render);
	},
	render : function() {
	    var renderedContent = this.template({ works : this.collection.toJSON() });
	    $(this.el).append(renderedContent);
	    return this;
	},
	events : {
        'click article' : 'openLightbox'
    },
    openLightbox : function(e) {
    	router.navigate('work/'+e.currentTarget.dataset.slug, {trigger: true});
    }
});

Portfolio.WorkModelView = Backbone.View.extend({
	el : $('body'),
	initialize : function() {
	    this.template = _.template($('#lightbox-work-template').html());
	
	    /*_.bindAll(this, 'render');
	    this.collection.bind('reset', this.render);*/
	},
	render : function() {
	    var renderedContent = this.template({ work : this.model.toJSON() });
	    this.$el.append(renderedContent);
	    this.openLightBox();
	    return this;
	},
	openLightBox : function(){
		var lightboxImg=$('#lightbox-image');
		var imgsSrc = this.model.get('img');
		var imgsDiv = lightboxImg.find('img');

		Portfolio.chargerImage(imgsDiv[0], imgsSrc[0]);
		Portfolio.chargerImage(imgsDiv[1], imgsSrc[1]);
		Portfolio.chargerImage(imgsDiv[2], imgsSrc[2]);
	
		var fenetre=$('#lightbox .row');
		var fenetreHeight = fenetre.height();
		var windowInnerHeight = window.innerHeight;
		var topScroll=$(document).scrollTop();
		
		if(fenetreHeight<(windowInnerHeight-40))
			topScroll+=((windowInnerHeight-fenetreHeight)/3)-22;
		
		fenetre.css('top',topScroll);
		
		$('#lightbox').removeClass('disappear').addClass('appear');
	},
	events : {
        'click #closeLightbox' : 'closeLightbox',
        'click #lightbox-overlay' : 'closeLightbox'
    },
    closeLightbox : function(e) {
    	/*var lightbox = $('#lightbox');
    	lightbox.removeClass('appear').addClass('disappear');
		$('#lightbox-overlay').on(Portfolio.nameTransitionEnd(),function(e){lightbox.remove();router.navigate('', {trigger: true});});*/
		router.navigate('home', {trigger: true});
    }
});


//ROUTER

Portfolio.Router = Backbone.Router.extend({
	initialize : function() {
	    this.myWorks = new Portfolio.WorksCollection();
		this.myWorksView = new Portfolio.WorksCollectionView({collection: this.myWorks});
		this.myWorks.fetch();
	},
    routes : {
        "work/:id" : "lightboxWork",
        "home" : "home",
        "" : "home"
    },
	lightboxWork : function(id) {
		var self = this;
		var myWork = this.myWorks.get(id);
		if(myWork)
			this.showWork(myWork);
		else
			this.myWorks.on('reset', function(){self.lightboxWork(id)});
		
	},
	showWork : function(work){
		var myWorkView = new Portfolio.WorkModelView({model: work});
		myWorkView.render();
	},
	home : function(){
		var lightbox = $('#lightbox');
		if(lightbox.length){
			lightbox.removeClass('appear').addClass('disappear');
			$('#lightbox-overlay').on(Portfolio.nameTransitionEnd(),function(e){lightbox.remove();});
		}
	}
});

//MAIN

var router = new Portfolio.Router();
Backbone.history.start({/*pushState: true,*/ root: "/"});
