$(document).ready(function () {
  //if #announcement is available
  if ($("#announcement").length) {
    //wait for 2secs and then click on $('#announcement-anim').click()
    setTimeout(function () {
      //check if there is a sessionStorage with key announcement and value hidden, if not click on #announcement-anim
      if (sessionStorage.getItem("announcement") !== "hidden") {
        $("#announcement-anim").click();
      }
    }, 2000);

    //if user clicks on #announcement-close, add an entry to the sessionStorage with key announcement and value hidden
    $("#announcement-close").click(function () {
      sessionStorage.setItem("announcement", "hidden");
    });

    //do the same, if #mobile-announcement is clicked
    $("#mobile-announcement").click(function () {
      sessionStorage.setItem("announcement", "hidden");
    });

    //do the same, if #announcement-read-more is clicked
    $("#announcement-read-more").click(function () {
      sessionStorage.setItem("announcement", "hidden");
    });
  }
});
