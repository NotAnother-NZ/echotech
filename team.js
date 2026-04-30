$(document).ready(function () {
  if ($("#team").length) {
    let teamPopupWrapper = document.getElementById("team-popup-wrapper");

    const teamlenis = new Lenis({
      duration: 1,
      lerp: 1,
      wrapper: teamPopupWrapper,
      orientation: "vertical",
      gestureOrientation: "vertical",
      normalizeWheel: true,
      wheelMultiplier: 2,
      orientation: "vertical",
      gestureOrientation: "vertical",
      normalizeWheel: true,
      smoothTouch: true,
      syncTouch: true,
      syncTouchLerp: 0,
      touchInertiaMultiplier: 10,
      touchMultiplier: 0,
    });

    // Function to update Lenis on each animation frame
    function raf(time) {
      teamlenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Start the animation frame loop
    requestAnimationFrame(raf);

    //run this only if on desktop
    if ($(window).width() > 768) {
      //go through all the .popup-link elements and give them an unique id based on their index value
      $(".popup-link").each(function (index) {
        $(this).attr("id", "popup-link-" + index);
      });

      //do the same for the .team-popup-item elements
      $(".team-popup-item").each(function (index) {
        $(this).attr("id", "team-popup-item-" + index);
      });

      //if a .popup-link element is clicked, get its index value and show the corresponding .team-popup-item element but hide all the others
      $(".popup-link").click(function () {
        var index = $(this).index(".popup-link");
        $(".team-popup-item").hide();
        $("#team-popup-item-" + index).show();
        // lenis.stop();
        // teamPagelenis.stop();
        teamlenis.start();
      });

      //if #team-popup-close is clicked
      $(".team-popup-close").click(function () {
        // lenis.start();
        // teamPagelenis.start();
        teamlenis.stop();
      });

      //go through all .team-contact-wrap elements; if all their children are hidden, hide that .team-contact-wrap element
      $(".team-contact-wrap").each(function () {
        if ($(this).children(":visible").length == 0) {
          $(this).hide();
        }
      });
    }
  }

  //go through all .team-contact-wrap elements; if all their children are hidden, hide that .team-contact-wrap element
  $(".team-contact-wrap").each(function () {
    if ($(this).children(":visible").length == 0) {
      $(this).hide();
    }
  });
});
