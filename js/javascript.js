/* DETECT WINDOW SCROLL */

function windowScroll() {
    var top = window.pageYOffset || document.documentElement.scrollTop;
    if (top > 100) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
    if (window.innerHeight + top >= document.documentElement.scrollHeight) {
        document.body.classList.add('scrolledend');
    } else {
        document.body.classList.remove('scrolledend');
    }
}

window.addEventListener("scroll",windowScroll);

windowScroll();
//open external links in a new window
function external_new_window() {
    for(var c = document.getElementsByTagName("a"), a = 0;a < c.length;a++) {
    var b = c[a];
    b.getAttribute("href") && b.hostname !== location.hostname && (b.target = "_blank")
    }
}
//open PDF links in a new window
function pdf_new_window ()
{
    if (!document.getElementsByTagName) return false;
    var links = document.getElementsByTagName("a");
    for (var eleLink=0; eleLink < links.length; eleLink ++) {
    if ((links[eleLink].href.indexOf('.pdf') !== -1)||(links[eleLink].href.indexOf('.doc') !== -1)||(links[eleLink].href.indexOf('.docx') !== -1)) {
        links[eleLink].onclick =
        function() {
            window.open(this.href);
            return false;
        }
    }
    }
} 
pdf_new_window();
external_new_window();
/* SMOOTH SCROLL */

function scrollPageTo(event) {
    var href=event.target.getAttribute('href');
    if(href.indexOf("#")> -1) {
        event.preventDefault(); 
        var id = event.target.getAttribute('href').replace('#','').replace('/','');
        if(id) element = document.getElementById(id);
        else element = '';
        if(element) {
            doScroll(element);
            history.pushState(null, null, '#'+element.getAttribute('id'));
        }
    }
}
function doScroll(element) {
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.offsetTop - 60
    });
}

function documentReady() {

    if(window.location.hash) {
    	var id = window.location.hash.substring(1);
    	if(id) element = document.getElementById(id);
        else element = '';
        if(element) {
            window.scroll({
                behavior: 'auto',
                left: 0,
                top: element.offsetTop - 60
            });
		}
    }

    var elements = document.querySelectorAll('a');
    elements.forEach(element => {
        element.addEventListener("click", function(event) {
            scrollPageTo(event);
        });
    });

    setTimeout(function(){ 
        var elements = document.querySelectorAll('.fullscreen');
        elements.forEach(element => {
            element.style.minHeight = element.offsetHeight + 'px';
        });
    }, 150);
}

document.addEventListener("DOMContentLoaded", documentReady);
    function is_youtubelink(url) {
      var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      return (url.match(p)) ? RegExp.$1 : false;
    }
    function is_imagelink(url) {
        var p = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
        return (url.match(p)) ? true : false;
    }
    function is_vimeolink(url,el) {
        var id = false;
        $.ajax({
          url: 'https://vimeo.com/api/oembed.json?url='+url,
          async: true,
          success: function(response) {
            if(response.video_id) {
              id = response.video_id;
              $(el).addClass('lightbox-vimeo').attr('data-id',id);
            }
          }
        });
    }
    
    $(document).ready(function() {
        //add classes to links to be able to initiate lightboxes
        $("a").each(function(){
            var url = $(this).attr('href');
            if(url) {
                if(url.indexOf('vimeo') !== -1 && !$(this).hasClass('no-lightbox')) is_vimeolink(url,$(this));
                if(is_youtubelink(url) && !$(this).hasClass('no-lightbox')) $(this).addClass('lightbox-youtube').attr('data-id',is_youtubelink(url));
                if(is_imagelink(url) && !$(this).hasClass('no-lightbox')) {
                    $(this).addClass('lightbox-image');
                    var href = $(this).attr('href');
                    var filename = href.split('/').pop();
                    var split = filename.split(".");
                    var name = split[0];
                    $(this).attr('title',name);
                }
            }
        });
        //remove the clicked lightbox
        $("body").on("click", ".lightbox", function(event){
            if($(this).hasClass('gallery')) {
                $(this).remove();
                if($(event.target).attr('id')=='next') {
                    //next item
                    if($("a.gallery.current").nextAll("a.gallery:first").length) $("a.gallery.current").nextAll("a.gallery:first").click();
                    else $("a.gallery.current").parent().find("a.gallery").first().click();
                }
                else if ($(event.target).attr('id')=='prev') {
                    //prev item
                    if($("a.gallery.current").prevAll("a.gallery:first").length) $("a.gallery.current").prevAll("a.gallery:first").click();
                    else $("a.gallery.current").parent().find("a.gallery").last().click();
                }
                else {
                    $("a.gallery").removeClass('gallery');
                }
            }
            else $(this).remove();
        });
        //prevent image from being draggable (for swipe)
        $("body").on('dragstart', ".lightbox img", function(event) { event.preventDefault(); });
        //add the youtube lightbox on click
        $("a.lightbox-youtube").click(function(event){
            event.preventDefault();
            $('<div class="lightbox"><a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://www.youtube.com/embed/'+$(this).attr('data-id')+'?autoplay=1&showinfo=0&rel=0"></iframe></div></div></div>').appendTo('body');
        });
        //add the image lightbox on click
        $("a.lightbox-image").click(function(event){
            event.preventDefault();
            $('<div class="lightbox"><a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="img" style="background: url(\''+$(this).attr('href')+'\') center center / contain no-repeat;" title="'+$(this).attr('title')+'" ><img src="'+$(this).attr('href')+'" alt="'+$(this).attr('title')+'" /></div><span>'+$(this).attr('title')+'</span></div>').appendTo('body');
        });
        //add the vimeo lightbox on click
        $("body").on("click", "a.lightbox-vimeo", function(event){
            event.preventDefault();
            $('<div class="lightbox"><a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://player.vimeo.com/video/'+$(this).attr('data-id')+'/?autoplay=1&byline=0&title=0&portrait=0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div></div></div>').appendTo('body');
        });
    
        $("body").on("click", "a[class*='lightbox-']", function(){
            var link_elements = $(this).parent().find("a[class*='lightbox-']");
            $(link_elements).removeClass('current');
            for (var i=0; i<link_elements.length; i++) {
                if($(this).attr('href') == $(link_elements[i]).attr('href')) {
                    $(link_elements[i]).addClass('current');
                }
            }
            if(link_elements.length>1) {
                $('.lightbox').addClass('gallery');
                $(link_elements).addClass('gallery');
            }
        });
    
        
    });