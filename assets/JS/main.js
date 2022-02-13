// When the user scrolls down 20px from the top of the document, slide up the navbar
window.onscroll = function(e) {
  // print "false" if direction is down and "true" if up
  if (this.oldScroll > this.scrollY){
    document.getElementById("myTopnav").style.top = "0px";
  }
  else{
    document.getElementById("myTopnav").style.top = "-90px";
  }
  this.oldScroll = this.scrollY;
}

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  };
  function openEXP(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }
  // Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
//controle the visibitly of open2work elements change here will reflect directly on the site
//document.getElementById("open2work").style.visibility = "visible";
//document.getElementById("notopen2work").style.visibility = "hidden";
/*$('#scrollToTop').click(function(){
	$('html, body').animate({scrollTop : 0},800);
	return false;
});*/