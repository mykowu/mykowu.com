// when the DOM is ready...
$(document).ready(function () {

var $panels = $('#how_container .scrollContainer > div');
var $container = $('#how_container .scrollContainer');

// if false, we'll float all the panels left and fix the width 
// of the container
var horizontal = true;

// float the panels left if we're going horizontal
if (horizontal) {
  $panels.css({
    'float' : 'left',
    'position' : 'relative' // IE fix to ensure overflow is hidden
  });
  
  // calculate a new width for the container (so it holds all panels)
  $container.css('width', $panels[0].offsetWidth * $panels.length);
}

// collect the scroll object, at the same time apply the hidden overflow
// to remove the default scrollbars that will appear
var $scroll = $('#how_container .scroll').css('overflow', 'hidden');

// apply our left + right buttons
$scroll
  .before($('<img class="scrollButtons left" src="images/prev_button.png" />').bind({
    mouseover:function(){
		$(this).attr("src", "images/prev_button_hover.png");
	},
	mouseleave:function(){
		$(this).attr("src", "images/prev_button.png");
	}
  }))
  .after($('<img class="scrollButtons right" src="images/next_button.png" />').bind({
    mouseover:function(){
		$(this).attr("src", "images/next_button_hover.png");
	},
	mouseleave:function(){
		$(this).attr("src", "images/next_button.png");
	}
  }));
  
// handle nav selection
function selectNav() {
  $(this)
    .parents('ul:first')
      .find('.selected')
        .removeClass('selected').addClass('unselected')
      .end()
    .end().parents("li").removeClass('unselected')
    .addClass('selected');
}

$('#how_container .how_nav').find('a').click(selectNav);

// go find the navigation link that has this target and select the nav
function trigger(data) {
  var el = $('#how_container .how_nav').find('a[href$="' + data.id + '"]').get(0);
  selectNav.call(el);
}

if (window.location.hash) {
  trigger({ id : window.location.hash.substr(1) });
} else {
  $('ul.how_nav a:first').click();
}

// offset is used to move to *exactly* the right place, since I'm using
// padding on my example, I need to subtract the amount of padding to
// the offset.  Try removing this to get a good idea of the effect
var offset = parseInt((horizontal ? 
  $container.css('paddingTop') : 
  $container.css('paddingLeft')) 
  || 0) * -1;


var scrollOptions = {
  target: $scroll, // the element that has the overflow
  
  // can be a selector which will be relative to the target
  items: $panels,
  
  navigation: '.how_nav a',
  
  // selectors are NOT relative to document, i.e. make sure they're unique
  prev: 'img.left', 
  next: 'img.right',
  
  // allow the scroll effect to run both directions
  axis: 'xy',
  
  onAfter: trigger, // our final callback
  
  offset: offset,
  cycle: false,
  
  // duration of the sliding effect
  duration: 500,
  
  // easing - can be used with the easing plugin: 
  // http://gsgd.co.uk/sandbox/jquery/easing/
  easing: 'swing',
  
  // onBefore function is dropping the opacity on next and prev buttons on end items
  onBefore: function(event, target, toScroll, items, position){
	if(position > 0){
		$('#how_container .left').css({"opacity" : "1"});
	} else{
		$('#how_container .left').css({"opacity" : ".5"});
	}
	
	if(position >= ($('#how_container .panel').length -1)){
		$('#how_container .right').css({"opacity" : ".5"});
	} else{
		$('#how_container .right').css({"opacity" : "1"});
	}
  }
};
// Freeze prev button on start
$('#how_container .left').css({"opacity" : ".5"});

// apply serialScroll to the slider - we chose this plugin because it 
// supports// the indexed next and previous scroll along with hooking 
// in to our navigation.
$('#how_container').serialScroll(scrollOptions);

// now apply localScroll to hook any other arbitrary links to trigger 
// the effect
$.localScroll({
	offset: {top: -70}
});

// finally, if the URL has a hash, move the slider in to position, 
// setting the duration to 1 because I don't want it to scroll in the
// very first page load.  We don't always need this, but it ensures
// the positioning is absolutely spot on when the pages loads.
scrollOptions.duration = 1;
$.localScroll.hash();

});