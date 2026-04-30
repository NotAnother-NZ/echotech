// $(document).ready(function () {

//     if ($("[data-about-numbers=true]").length > 0) {

//         // Array to store numbers from elements
//         let numbers = [];

//         // Store numbers from elements
//         $("[data-about-number=true]").each(function () {
//             numbers.push(parseInt($(this).text())); // Parse numbers as integers
//         });

//         // Initialize Odometer with the first value from the numbers array
//         let el = document.querySelector("#about-number");
//         let od = new Odometer({
//             el: el,
//             value: 0, // First value from the numbers array
//             format: "d",
//             duration: 150,
//         });

//         // Initialize other variables
//         let titles = [];

//         //go through all the data-about-numbers elements and only show the first one, and hide the rest of them
//         $("[data-about-numbers=true]").each(function (index) {
//             if (index == 0) {
//                 $(this).show();
//             } else {
//                 $(this).hide();
//             }
//         });

//         //Store the number titles from elements
//         $("[data-about-title=true]").each(function () {
//             titles.push($(this).text());
//         });

//         console.log(numbers);
//         console.log(titles);

//         // Get the height and top position of #about-numbers-section
//         let aboutNumbersSection = $("#about-numbers-section");
//         let sectionHeight = aboutNumbersSection.outerHeight();
//         let sectionTop = aboutNumbersSection.offset().top;

//         // Scroll event handler for the document
//         $(document).scroll(function () {
//             // Check if the scroll position is within #about-numbers-section
//             if (
//                 $(document).scrollTop() >= sectionTop &&
//                 $(document).scrollTop() <= sectionTop + sectionHeight
//             ) {
//                 // Calculate the scroll percentage
//                 let scrollPosition = $(document).scrollTop() - sectionTop;
//                 let scrollPercentage = Math.round(
//                     (scrollPosition / (sectionHeight - $(window).height())) * 100
//                 );

//                 // Log the rounded scroll percentage
//                 console.log(
//                     scrollPercentage + "% scrolled inside #about-numbers-section"
//                 );

//                 // Update Odometer value based on scroll percentage
//                 if (scrollPercentage > 1 && scrollPercentage < 33) {
//                     od.update(numbers[0]); // Update with the first value from the numbers array
//                 } else if (scrollPercentage >= 33 && scrollPercentage < 66) {
//                     od.update(numbers[1]); // Update with the second value from the numbers array
//                     //update the text of #about-title to the title[1] value
//                     $("#about-title").text(titles[1]);
//                 } else if (scrollPercentage >= 66) {
//                     od.update(numbers[2]); // Update with the third value from the numbers array
//                     //update the text of #about-title to the title[2] value
//                     $("#about-title").text(titles[2]);
//                 } else {
//                     od.update(0); // Update with default value
//                     //update the text of #about-title to the title[0] value
//                     $("#about-title").text(titles[0]);
//                 }
//             }
//         });
//     }
// });

// $(document).ready(function () {

//     if ($("[data-about-numbers=true]").length > 0) {

//         // Array to store numbers from elements
//         let numbers = [];

//         // Store numbers from elements
//         $("[data-about-number=true]").each(function () {
//             numbers.push(parseInt($(this).text())); // Parse numbers as integers
//         });

//         // // Initialize Odometer with the first value from the numbers array
//         // let el = document.querySelector("#about-number");
//         // let od = new Odometer({
//         //     el: el,
//         //     value: 0, // First value from the numbers array
//         //     format: "d",
//         //     duration: 150,
//         // });

//         // Initialize other variables
//         let titles = [];

//         //go through all the data-about-numbers elements and only show the first one, and hide the rest of them
//         $("[data-about-numbers=true]").each(function (index) {
//             if (index == 0) {
//                 $(this).show();
//             } else {
//                 $(this).hide();
//             }
//         });

//         //Store the number titles from elements
//         $("[data-about-title=true]").each(function () {
//             titles.push($(this).text());
//         });

//         console.log(numbers);
//         console.log(titles);

//         // Get the height and top position of #about-numbers-section
//         let aboutNumbersSection = $("#about-numbers-section");
//         let sectionHeight = aboutNumbersSection.outerHeight();
//         let sectionTop = aboutNumbersSection.offset().top;

//         // Scroll event handler for the document
//         $(document).scroll(function () {
//             // Check if the scroll position is within #about-numbers-section
//             if (
//                 $(document).scrollTop() >= sectionTop &&
//                 $(document).scrollTop() <= sectionTop + sectionHeight
//             ) {
//                 // Calculate the scroll percentage
//                 let scrollPosition = $(document).scrollTop() - sectionTop;
//                 let scrollPercentage = Math.round(
//                     (scrollPosition / (sectionHeight - $(window).height())) * 100
//                 );

//                 // Log the rounded scroll percentage
//                 console.log(
//                     scrollPercentage + "% scrolled inside #about-numbers-section"
//                 );

//                 // Update Odometer value based on scroll percentage
//                 if (scrollPercentage > 1 && scrollPercentage < 33) {
//                     // od.update(numbers[0]); // Update with the first value from the numbers array
//                     //update the text of #about-title to the title[0] value
//                     $("#about-title").text(titles[0]);
//                     // $("#about-number").text(numbers[0]);
//                     //use anime js to animate the text of #about-number in 250ms quadratic easing
//                     anime({
//                         targets: "#about-number",
//                         innerHTML: numbers[0],
//                         round: 1,
//                         easing: "easeInOutQuad",
//                         duration: 250,
//                     });
//                 } else if (scrollPercentage >= 33 && scrollPercentage < 66) {
//                     // od.update(numbers[1]); // Update with the second value from the numbers array
//                     //update the text of #about-title to the title[1] value
//                     $("#about-title").text(titles[1]);
//                     // $("#about-number").text(numbers[1]);
//                     //use anime js to animate the text of #about-number in 250ms quadratic easing
//                     anime({
//                         targets: "#about-number",
//                         innerHTML: numbers[1],
//                         round: 1,
//                         easing: "easeInOutQuad",
//                         duration: 250,
//                     });
//                 } else if (scrollPercentage >= 66) {
//                     // od.update(numbers[2]); // Update with the third value from the numbers array
//                     //update the text of #about-title to the title[2] value
//                     $("#about-title").text(titles[2]);
//                     // $("#about-number").text(numbers[2]);
//                     //use anime js to animate the text of #about-number in 250ms quadratic easing
//                     anime({
//                         targets: "#about-number",
//                         innerHTML: numbers[2],
//                         round: 1,
//                         easing: "easeInOutQuad",
//                         duration: 250,
//                     });
//                 } else {
//                     // od.update(0); // Update with default value
//                     //update the text of #about-title to the title[0] value
//                     $("#about-title").text(titles[0]);
//                     // $("#about-number").text(numbers[0]);
//                     //use anime js to animate the text of #about-number in 250ms quadratic easing
//                     anime({
//                         targets: "#about-number",
//                         innerHTML: numbers[0],
//                         round: 1,
//                         easing: "easeInOutQuad",
//                         duration: 250,
//                     });
//                 }
//             }
//         });
//     }
// });

$(document).ready(function () {
  if ($("[data-about-numbers=true]").length > 0) {
    let numbers = [];
    let titles = [];

    let aboutNumberElements = $("[data-about-number=true]");
    let aboutTitleElements = $("[data-about-title=true]");

    // Remove commas and update text content of number elements
    aboutNumberElements.each(function () {
      let numberText = $(this).text().replace(/,/g, ""); // Remove commas from the text
      $(this).text(numberText); // Update text content
    });

    aboutNumberElements.each(function () {
      numbers.push(parseInt($(this).text())); // Parse numbers and store in the array
    });

    $("[data-about-numbers=true]").each(function (index) {
      if (index != 0) {
        $(this).hide();
      }
    });

    aboutTitleElements.each(function () {
      titles.push($(this).text());
    });

    let aboutNumbersSection = $("#about-numbers-section");
    let sectionHeight = aboutNumbersSection.outerHeight();
    let sectionTop = aboutNumbersSection.offset().top;

    $(document).scroll(function () {
      if (
        $(document).scrollTop() >= sectionTop &&
        $(document).scrollTop() <= sectionTop + sectionHeight
      ) {
        let scrollPosition = $(document).scrollTop() - sectionTop;
        let scrollPercentage = Math.round(
          (scrollPosition / (sectionHeight - $(window).height())) * 100
        );

        console.log(
          scrollPercentage + "% scrolled inside #about-numbers-section"
        );

        let index = 0;
        if (scrollPercentage >= 33 && scrollPercentage < 66) {
          index = 1;
        } else if (scrollPercentage >= 66) {
          index = 2;
        }

        $("#about-title").text(titles[index]);

        TweenMax.to("#about-number", 0.2, {
          // Reduced duration to speed up the animation
          innerHTML: numbers[index],
          roundProps: "innerHTML",
          ease: Power1.easeOut, // Using Power1.easeOut for quick and snappy transition
        });
      }
    });
  }
});
