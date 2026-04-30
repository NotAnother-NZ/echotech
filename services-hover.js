$(document).ready(function () {
  if ($("[data-services-hover=true]").length > 0) {
    let serviceHoverElements = [];
    let serviceImgElements = [];
    let serviceDetailElements = [];

    //go through all the elements with the attribute data-services-hover=true, and store them in an array
    $("[data-services-hover=true]").each(function () {
      serviceHoverElements.push($(this));
    });

    //go through all the elements with the attribute data-services-img=true, and store them in an array
    $("[data-services-img=true]").each(function () {
      serviceImgElements.push($(this));
    });

    //go through all the elements with the attribute data-services-details=true, and store them in an array
    $("[data-services-details=true]").each(function () {
      serviceDetailElements.push($(this));
    });

    //by default, remove disabled class from the first element from each of these arrays, and add disabled classes to all the siblings
    serviceHoverElements[0].removeClass("disabled");
    serviceImgElements[0].removeClass("disabled");
    serviceDetailElements[0].removeClass("disabled");

    for (let i = 1; i < serviceHoverElements.length; i++) {
      serviceHoverElements[i].addClass("disabled");
      //hide the img element inside of them
      serviceHoverElements[i].find("img").hide();
    }

    for (let i = 1; i < serviceImgElements.length; i++) {
      serviceImgElements[i].addClass("disabled");
    }

    for (let i = 1; i < serviceDetailElements.length; i++) {
      serviceDetailElements[i].addClass("disabled");
    }

    //when user hovers over an element with the attribute data-services-hover=true, remove the .disabled class from it, and add it to all its siblings
    $("[data-services-hover=true]").hover(
      function () {
        $(this).siblings().addClass("disabled");
        $(this).removeClass("disabled");
        //show the img element inside of the hovered element and hide it from the siblings
        $(this).find("img").show();
        $(this).siblings().find("img").hide();

        //show the corresponsiding service image and details element based on the index of the service that is hovered
        let index = $(this).index();
        console.log(index);
        serviceImgElements[index / 2].removeClass("disabled");
        serviceDetailElements[index / 2].removeClass("disabled");
        serviceImgElements[index / 2].siblings().addClass("disabled");
        serviceDetailElements[index / 2].siblings().addClass("disabled");
      },
      function () {
        // $(this).siblings().removeClass("disabled");
        //hide the img element from all its siblings
        $(this).siblings().find("img").hide();
      }
    );
  }
});
