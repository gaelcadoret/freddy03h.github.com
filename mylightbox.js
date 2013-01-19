(function($) {
        $.fn.mylightbox = function(params) {
        
        var json;
        var articles = $(this);
        var doc = $(document);
		var buttonClose=$('#closeLightbox');
		var lightbox=$('#lightbox');
		var fenetre=$('#lightbox .row');
		var lightboxInfo=$('#lightbox-info');
		var lightboxImg=$('#lightbox-image');
		
		//lightbox.css({'height':((doc.height()))+'px'});
		
		var image1 = lightboxImg.find('img:eq(0)');
		var image2 = lightboxImg.find('img:eq(1)');
		var image3 = lightboxImg.find('img:eq(2)');
		
		var lienImage1 = lightboxImg.find('a:eq(0)');
		var lienImage2 = lightboxImg.find('a:eq(1)');
		var lienImage3 = lightboxImg.find('a:eq(2)');
		
		var titrePrincipal = lightboxInfo.find('h1:first');
		var textPresentation= lightboxInfo.find('dd:eq(0)');
		var textContext= lightboxInfo.find('dd:eq(1)');
		var textSkill= lightboxInfo.find('dd:eq(2)');
		var textState= lightboxInfo.find('dd:eq(3)');
		
		
		function changerImage(img, src)
		{
		   // on crée l'objet
		   var image = new Image();
		 
		   // événements : cas d'erreur
		   /*image.onerror = function()
		   {
		      alert("Erreur lors du chargement de l'image");
		   }
		   image.onabort = function()
		   {
		      alert("Chargement interrompu");
		   }*/
		 
		   // événement : une fois le chargement terminé
		   image.onload = function()
		   {
		      //img.src = image.src;
		      img.attr("src",image.src);
		      //img.width = image.width;
		      //img.height = image.height;
		   }
		 
		   // on modifie l'adresse de l'objet "image", ce qui lance le chargement
		   image.src = src;            
		}
		
		function placeWorkOnLightbox(work){

			changerImage(image1,work.img[0]);
			changerImage(image2,work.img[1]);
			changerImage(image3,work.img[2]);
			
			lienImage1.attr('href',work.img[0]);
			lienImage2.attr('href',work.img[1]);
			lienImage3.attr('href',work.img[2]);
			
			titrePrincipal.empty().append(work.title);
			textPresentation.empty().append(work.presentation);
			textContext.empty().append(work.context);
			textSkill.empty().append(work.skill);
			textState.empty().append(work.state);
		}
		
		function openingLightbox(event){
			//lightbox.css({'height':((doc.height()))+'px'});

			var articleSelected = $(event.currentTarget);
			
			var index = articleSelected.data('index');
			placeWorkOnLightbox(json.works[index]);
			
			var fenetreHeight = fenetre.height();
			var windowInnerHeight = window.innerHeight;
			var topScroll=doc.scrollTop();

			if(fenetreHeight<(windowInnerHeight-40))
				topScroll+=((windowInnerHeight-fenetreHeight)/3)-22;
			
			fenetre.css('top',topScroll);
			
			if(lightbox.hasClass('disappear')){
				lightbox.removeClass('disappear').addClass('appear');
			}
			
		}
		
		function endingLightbox(event){
			if(lightbox.hasClass('appear')){
				lightbox.removeClass('appear').addClass('disappear');
			}
			
			
			window.setTimeout(function(){
				image1.attr("src","css/img/ajax-loader.gif");
				image1.attr("src","css/img/ajax-loader.gif");
				image1.attr("src","css/img/ajax-loader.gif");
				//lightbox.css({'height':'0px'});
			}, 800);
		}
		
		//*******
        $.getJSON("works.json", function(jsonGetting){
		   json=jsonGetting;
		   //console.log("JSON LOADED");
		   	articles.bind('click', openingLightbox);
			buttonClose.bind('click', endingLightbox);
			lightbox.bind('click', endingLightbox);
			fenetre.bind('click', function(event){event.stopPropagation();});
		 });
        //*******
		
		
        	
        }
})(jQuery);