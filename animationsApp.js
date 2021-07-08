(function($) {
  "use strict"; // Start of use strict

 // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    $(".container-fluid").hide();
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
      $(".container-fluid").show();
    };
  });


  // Close any open menu accordions when window is resized below 768px
  
    // Hide content while side bar is active
  
    if ($(window).width() < 767){
      $(".nav-item").on('click', function(e) {
        $("body").toggleClass("sidebar-toggled");
        // $(".sidebar").toggleClass("toggled");
          // $(".container-fluid").show();
          $('.sidebar .collapse').collapse('hide');
    });
  }else{
    $(".sidebar").addClass("toggled");
    $('.sidebar .collapse').collapse('hide');
    $(".nav-item").on('click', function(e) {
      // $(".sidebar").addClass("toggled");
      // $(".container-fluid").show();
    });
  };

  $(window).resize(function(){
    if($(window).width() > 767){
      $(".sidebar").addClass("toggled");
    }
  })
 
    
    // Toggle the side navigation when window is resized below 480px
    // if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
    //   $("body").addClass("sidebar-toggled");
    //   $(".sidebar").addClass("toggled");
    //   $('.sidebar .collapse').collapse('hide');
    // };
  

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });
  $("body").addClass("sidebar-toggled");
  $(".sidebar").addClass("toggled");
  $('.sidebar .collapse').collapse('hide');

})(jQuery); // End of use strict
