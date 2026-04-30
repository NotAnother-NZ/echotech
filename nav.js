//go through all the elements inside of #multi-nav-links-wrapper. if any of them is clicked, add .disabled class to the rest of them, and remove it from the clicked one.
$("#multi-nav-links-wrapper").on("click", "a", function () {
  //add .disabled class to all of them
  $("#multi-nav-links-wrapper a").addClass("disabled");
  //remove it from the clicked one
  $(this).removeClass("disabled");
});

//go through all the elements inside of #multi-nav-link-hover. if any of them is hovered, add .disabled class to all of them, and then remove it from the hovered one.
$("#multi-nav-link-hover1").on("mouseenter", "a", function () {
  //add .disabled class to all of them
  $("#multi-nav-link-hover1 a").addClass("disabled");
  //remove it from the hovered one
  $(this).removeClass("disabled");
});

//same but for #multi-nav-link-hover2
$("#multi-nav-link-hover2").on("mouseenter", "a", function () {
  $("#multi-nav-link-hover2 a").addClass("disabled");
  $(this).removeClass("disabled");
});

//same but for #multi-nav-link-hover3
$("#multi-nav-link-hover3").on("mouseenter", "a", function () {
  $("#multi-nav-link-hover3 a").addClass("disabled");
  $(this).removeClass("disabled");
});

//same but for #multi-nav-link-hover4
$("#multi-nav-link-hover4").on("mouseenter", "a", function () {
  $("#multi-nav-link-hover4 a").addClass("disabled");
  $(this).removeClass("disabled");
});

//same but for #multi-nav-link-hover5
$("#multi-nav-link-hover5").on("mouseenter", "a", function () {
  $("#multi-nav-link-hover5 a").addClass("disabled");
  $(this).removeClass("disabled");
});

//if #nav-link1 is clicked, click on #multi-services
$("#nav-link1").click(function () {
  $("#multi-services").click();
});

//if #nav-link2 is clicked, click on #multi-edays
$("#nav-link2").click(function () {
  $("#multi-edays").click();
});

//if #nav-link3 is clicked, click on #multi-about
$("#nav-link3").click(function () {
  $("#multi-about").click();
});

/*
 *
 *
 *
 * MOBILE NAVIGATION
 *
 *
 */

//if any .mobile-nav-open is clicked, show .multi-nav-wrapper
$(".mobile-nav-open").click(function () {
  console.log("clicked");
  $(".multi-nav-wrapper").show();

  //show mobile-nav-1 and hide the rest of them by default
  $("#mobile-nav-1").show();
  $("#mobile-nav-2").hide();
  $("#mobile-nav-3").hide();
  $("#mobile-nav-4").hide();
  $("#mobile-nav-5").hide();
  $("#mobile-nav-6").hide();
});

//if any .mobile-nav-close is clicked, hide .multi-nav-wrapper
$(".mobile-nav-close").click(function () {
  $(".multi-nav-wrapper").hide();
});

//show mobile-nav-1 and hide the rest of them by default
$("#mobile-nav-1").show();
$("#mobile-nav-2").hide();
$("#mobile-nav-3").hide();
$("#mobile-nav-4").hide();
$("#mobile-nav-5").hide();
$("#mobile-nav-6").hide();

//if #mobile-nav-services is clicked, show #mobile-nav-2 and hide #mobile-nav-1 to 5
$("#mobile-nav-services").click(function () {
  $("#mobile-nav-2").show();

  $("#mobile-nav-1").hide();
  $("#mobile-nav-3").hide();
  $("#mobile-nav-4").hide();
  $("#mobile-nav-5").hide();
  $("#mobile-nav-6").hide();
});

//if #mobile-nav-back1 is clicked, show #mobile-nav-1 and hide the rest
$("#mobile-nav-back1").click(function () {
  $("#mobile-nav-1").show();

  $("#mobile-nav-2").hide();
  $("#mobile-nav-3").hide();
  $("#mobile-nav-4").hide();
  $("#mobile-nav-5").hide();
  $("#mobile-nav-6").hide();
});

//if #mobile-nav-back2 is clicked, show #mobile-nav-2 and hide the rest
$("#mobile-nav-back2").click(function () {
  $("#mobile-nav-2").show();

  $("#mobile-nav-1").hide();
  $("#mobile-nav-3").hide();
  $("#mobile-nav-4").hide();
  $("#mobile-nav-5").hide();
  $("#mobile-nav-6").hide();
});

//if #mobile-nav-back3 is clicked, show #mobile-nav-2 and hide the rest
$("#mobile-nav-back3").click(function () {
  $("#mobile-nav-2").show();

  $("#mobile-nav-1").hide();
  $("#mobile-nav-3").hide();
  $("#mobile-nav-4").hide();
  $("#mobile-nav-5").hide();
  $("#mobile-nav-6").hide();
});

//if #mobile-nav-back4 or #mobile-nav-back5 is clicked, show #mobile-nav-1 and hide the rest
$("#mobile-nav-back4, #mobile-nav-back5").click(function () {
  $("#mobile-nav-1").show();

  $("#mobile-nav-2").hide();
  $("#mobile-nav-3").hide();
  $("#mobile-nav-4").hide();
  $("#mobile-nav-5").hide();
  $("#mobile-nav-6").hide();
});

//if #mobile-nav-edays is clicked, show #mobile-nav-5 and hide the rest
$("#mobile-nav-edays").click(function () {
  $("#mobile-nav-5").show();

  $("#mobile-nav-1").hide();
  $("#mobile-nav-2").hide();
  $("#mobile-nav-3").hide();
  $("#mobile-nav-4").hide();
  $("#mobile-nav-6").hide();
});

//if #mobile-nav-about is clicked, show #mobile-nav-6 and hide the rest
$("#mobile-nav-about").click(function () {
  $("#mobile-nav-6").show();

  $("#mobile-nav-1").hide();
  $("#mobile-nav-2").hide();
  $("#mobile-nav-3").hide();
  $("#mobile-nav-4").hide();
  $("#mobile-nav-5").hide();
});

//if #mobile-nav-ewaste is clicked, show #mobile-nav-3 and hide the rest
$("#mobile-nav-ewaste").click(function () {
  $("#mobile-nav-3").show();

  $("#mobile-nav-1").hide();
  $("#mobile-nav-2").hide();
  $("#mobile-nav-4").hide();
  $("#mobile-nav-5").hide();
  $("#mobile-nav-6").hide();
});

//if #mobile-nav-datasec is clicked, show #mobile-nav-4 and hide the rest
$("#mobile-nav-datasec").click(function () {
  $("#mobile-nav-4").show();

  $("#mobile-nav-1").hide();
  $("#mobile-nav-2").hide();
  $("#mobile-nav-3").hide();
  $("#mobile-nav-5").hide();
  $("#mobile-nav-6").hide();
});
