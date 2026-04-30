$(document).ready(function () {
  //if #bac-form-wrapper is available
  copyTimes = 0;
  if ($("#bac-form-wrapper-new").length) {
    /*
     *
     *
     * COLLECTION TYPE SELECTOR AND FORM ELEMENTS TOGGLE
     *
     *
     */

    //go through all the .form-radio-button elements, and if one of them is clicked, add the .selected class to it and remove it from the rest of the .form-radio-button elements
    $(".form-radio-button").click(function () {
      $(this).addClass("selected");
      //remove .forest-green class from all the .body2 elements inside of this, and add .white instead
      $(this).find(".body2").removeClass("forest-green");
      $(this).find(".body2").addClass("white");
      //remove .not-selected class find from .radio-tick-icon inside of this
      $(this).find(".radio-tick-icon").removeClass("not-selected");

      $(this).siblings().removeClass("selected");
      $(this).siblings().find(".body2").removeClass("white");
      $(this).siblings().find(".body2").addClass("forest-green");
      $(this).siblings().find(".radio-tick-icon").addClass("not-selected");
    });

    //click on #res-form-button by default
    $("#res-form-button").click();
    //set the value of #collection-type to "Residential" by default
    $("#collection-type").val("Residential");
    //hide #collection-type by default
    $("#collection-type").hide();
    //hide #on-site-contact by default
    $("#on-site-contact").hide();
    //set #on-site-full-name and #on-site-phone to not required by default
    $("#on-site-full-name").prop("required", false);
    $("#on-site-phone").prop("required", false);
    //hide #order-details, #total-price, #total-weight, #distance, #shipping-cost, #grand-total by default
    $("#order-details").hide();
    $("#total-unique-items").hide();
    $("#total-price").hide();
    $("#total-weight").hide();
    $("#distance").hide();
    $("#shipping-cost").hide();
    $("#grand-total").hide();
    //hide #data-erasure-service by default
    $("#data-erasure-service").hide();
    //set the value of #data-erasure-needed to "No" by default
    $("#data-erasure-needed").val("No");
    //hide #data-erasure-needed by default
    $("#data-erasure-needed").hide();
    //remove clicked class from #data-erasure-service-checkbox by default
    $("#data-erasure-service-checkbox").removeClass("clicked");
    //set the text of #contact-details-title to "Contact Details" by default
    $("#contact-details-title").text("Contact Details");
    //show #contact-details by default
    $("#contact-details").show();
    //set #bac-first-name, #bac-surname, #bac-email-address, #bac-phone to required by default
    $("#bac-first-name").prop("required", true);
    $("#bac-surname").prop("required", true);
    $("#bac-email-address").prop("required", true);
    $("#bac-phone").prop("required", true);
    //hide #business-details, #billing-details, #business-contact-details and #contact-billing-same by default
    $("#business-details").hide();
    $("#billing-details").hide();
    $("#business-contact-details").hide();
    $("#contact-billing-same").hide();
    //uncheck #contact-billing-same-checkbox by default - by removing .clicked class from it
    $("#contact-billing-same-checkbox").removeClass("clicked");
    //set #bac-contact-first-name, #bac-contact-surname, #bac-contact-email-address, #bac-contact-phone to not required
    $("#bac-contact-first-name").prop("required", false);
    $("#bac-contact-surname").prop("required", false);
    $("#bac-contact-email-address").prop("required", false);
    $("#bac-contact-phone").prop("required", false);
    //set #bac-company-name, #bac-company-size, #bac-business-sector, #bac-billing-first-name, #bac-billing-surname, #bac-billing-email-address, #bac-billing-phone to not required
    $("#bac-company-name").prop("required", false);
    $("#bac-company-size").prop("required", false);
    $("#bac-business-sector").prop("required", false);
    $("#bac-billing-first-name").prop("required", false);
    $("#bac-billing-surname").prop("required", false);
    $("#bac-billing-email-address").prop("required", false);
    $("#bac-billing-phone").prop("required", false);
    //set the text of #bac-submit to "Complete Payment" by default
    // $("#bac-submit").val("Complete Payment");
    //hide #bac-submit and show #bac-pay by default
    $("#bac-submit").hide();
    $("#bac-pay").show();

    //hide .form-product-bulk-option-details by default
    $(".form-product-bulk-option-details").hide();
    //remove .commercial from .form-product-option by default
    $(".form-product-option").removeClass("commercial");

    //disable the first option of all the .select-input elements
    $(".select-input").each(function () {
      $(this).children().first().attr("disabled", "disabled");
    });

    //if #res-form-button is clicked, set the value of the textbox #collection-type to "Residential"
    $("#res-form-button").click(function () {
      $("#collection-type").val("Residential");
      //hide #on-site-contact
      $("#on-site-contact").hide();
      //set #on-site-full-name and #on-site-phone to not required
      $("#on-site-full-name").prop("required", false);
      $("#on-site-phone").prop("required", false);
      //hide #data-erasure-service
      $("#data-erasure-service").hide();
      //set the value of #data-erasure-needed to "No"
      $("#data-erasure-needed").val("No");
      //remove .clicked class from #data-erasure-service-checkbox
      $("#data-erasure-service-checkbox").removeClass("clicked");
      //set the text of #contact-details-title to "Contact Details"
      $("#contact-details-title").text("Contact Details");
      //show #contact-details
      $("#contact-details").show();
      //set #bac-first-name, #bac-surname, #bac-email-address, #bac-phone to required
      $("#bac-first-name").prop("required", true);
      $("#bac-surname").prop("required", true);
      $("#bac-email-address").prop("required", true);
      $("#bac-phone").prop("required", true);
      //hide #business-details, #billing-details, #business-contact-details and #contact-billing-same by default
      $("#business-details").hide();
      $("#billing-details").hide();
      $("#business-contact-details").hide();
      $("#contact-billing-same").hide();
      //uncheck #contact-billing-same-checkbox - by removing .clicked class from it
      $("#contact-billing-same-checkbox").removeClass("clicked");
      //set #bac-contact-first-name, #bac-contact-surname, #bac-contact-email-address, #bac-contact-phone to not required
      $("#bac-contact-first-name").prop("required", false);
      $("#bac-contact-surname").prop("required", false);
      $("#bac-contact-email-address").prop("required", false);
      $("#bac-contact-phone").prop("required", false);
      //set #bac-company-name, #bac-company-size, #bac-business-sector, #bac-billing-first-name, #bac-billing-surname, #bac-billing-email-address, #bac-billing-phone to not required
      $("#bac-company-name").prop("required", false);
      $("#bac-company-size").prop("required", false);
      $("#bac-business-sector").prop("required", false);
      $("#bac-billing-first-name").prop("required", false);
      $("#bac-billing-surname").prop("required", false);
      $("#bac-billing-email-address").prop("required", false);
      $("#bac-billing-phone").prop("required", false);
      //set the text of #bac-submit to "Complete Payment"
      // $("#bac-submit").val("Complete Payment");
      //hide #bac-submit and show #bac-pay
      $("#bac-submit").hide();
      $("#bac-pay").show();
      //hide .form-product-bulk-option-details
      $(".form-product-bulk-option-details").hide();
      //remove .commercial from .form-product-option
      $(".form-product-option").removeClass("commercial");
    });
    //if #com-form-button is clicked, set the value of the textbox #collection-type to "Commercial"
    $("#com-form-button").click(function () {
      $("#collection-type").val("Commercial");
      //show #on-site-contact
      $("#on-site-contact").show();
      //set #on-site-full-name and #on-site-phone to required
      $("#on-site-full-name").prop("required", true);
      $("#on-site-phone").prop("required", true);
      //show #data-erasure-service
      $("#data-erasure-service").show();
      //set the value of #data-erasure-needed to "No"
      $("#data-erasure-needed").val("No");
      //remove .clicked class from #data-erasure-service-checkbox
      $("#data-erasure-service-checkbox").removeClass("clicked");
      //set the text of #contact-details-title to "Business & Contact Details"
      $("#contact-details-title").text("Business & Contact Details");
      //hide #contact-details
      $("#contact-details").hide();
      //set #bac-first-name, #bac-surname, #bac-email-address, #bac-phone to not required
      $("#bac-first-name").prop("required", false);
      $("#bac-surname").prop("required", false);
      $("#bac-email-address").prop("required", false);
      $("#bac-phone").prop("required", false);
      //show #business-details, #billing-details, #business-contact-details and #contact-billing-same
      $("#business-details").show();
      $("#billing-details").show();
      $("#business-contact-details").hide();
      $("#contact-billing-same").show();
      //remove clicked class from #contact-billing-same-checkbox
      $("#contact-billing-same-checkbox").removeClass("clicked");
      //simulate a click on #contact-billing-same-checkbox
      $("#contact-billing-same-checkbox").click();
      //set #bac-company-name, #bac-company-size, #bac-business-sector, #bac-billing-first-name, #bac-billing-surname, #bac-billing-email-address, #bac-billing-phone to required
      $("#bac-company-name").prop("required", true);
      $("#bac-company-size").prop("required", true);
      $("#bac-business-sector").prop("required", true);
      $("#bac-billing-first-name").prop("required", true);
      $("#bac-billing-surname").prop("required", true);
      $("#bac-billing-email-address").prop("required", true);
      $("#bac-billing-phone").prop("required", true);
      //set the text of #bac-submit to "Complete Payment"
      // $("#bac-submit").val("Complete Payment");
      //hide #bac-submit and show #bac-pay
      $("#bac-submit").hide();
      $("#bac-pay").show();
      //show .form-product-bulk-option-details
      $(".form-product-bulk-option-details").show();
      //add .commercial to .form-product-option
      $(".form-product-option").addClass("commercial");
    });

    //hide #collection-instruction by default
    $("#collection-instruction").hide();
    //if #collection-instruction-toggle is clicked, show #collection-instruction and hide #collection-instruction-toggle
    $("#collection-instruction-toggle").click(function () {
      $("#collection-instruction").show();
      $("#collection-instruction-toggle").hide();
    });

    //if #contact-billing-same-checkbox is clicked, toggle the .clicked class on it
    $("#contact-billing-same-checkbox").click(function () {
      $(this).toggleClass("clicked");
      //check if #contact-billing-same-checkbox has the .clicked class, if so hide #business-contact-details, otherwise show it
      if ($(this).hasClass("clicked")) {
        $("#business-contact-details").hide();
        //set #bac-contact-first-name, #bac-contact-surname, #bac-contact-email-address, #bac-contact-phone to not required
        $("#bac-contact-first-name").prop("required", false);
        $("#bac-contact-surname").prop("required", false);
        $("#bac-contact-email-address").prop("required", false);
        $("#bac-contact-phone").prop("required", false);
      } else {
        $("#business-contact-details").show();
        //set #bac-contact-first-name, #bac-contact-surname, #bac-contact-email-address, #bac-contact-phone to required
        $("#bac-contact-first-name").prop("required", true);
        $("#bac-contact-surname").prop("required", true);
        $("#bac-contact-email-address").prop("required", true);
        $("#bac-contact-phone").prop("required", true);
      }
    });

    //if #data-erasure-service-checkbox is clicked, toggle the .clicked class on it
    $("#data-erasure-service-checkbox").click(function () {
      $(this).toggleClass("clicked");
      //check if #data-erasure-service-checkbox has the .clicked class, if so set the value of #data-erasure-needed to "Yes", otherwise set it to "No"
      if ($(this).hasClass("clicked")) {
        $("#data-erasure-needed").val("Yes");
        //set the text of #bac-submit to "Confirm Booking"
        // $("#bac-submit").val("Confirm Booking");
        //show #bac-submit and hide #bac-pay
        $("#bac-submit").show();
        $("#bac-pay").hide();
      } else {
        $("#data-erasure-needed").val("No");
        //set the text of #bac-submit to "Complete Payment"
        // $("#bac-submit").val("Complete Payment");
        //hide #bac-submit and show #bac-pay
        $("#bac-submit").hide();
        $("#bac-pay").show();
      }
    });

    //if #bac-terms-and-conditions-checkbox is clicked, toggle the .clicked class on it
    $("#bac-terms-and-conditions-checkbox").click(function () {
      $(this).toggleClass("clicked");
    });

    /*
     *
     *
     * QUANTITY SELECTOR AND COST CALCULATION
     *
     *
     */

    //go through all the .quantity elements, and give them an attribute of data-item-id starting from item1
    $(".quantity").each(function (index) {
      $(this).attr("data-item-id", "item" + (index + 1));
    });

    // Initialize total cost and weight
    var totalCost = 0;
    var totalWeight = 0;
    var orderDetails = [];

    // Initialize an empty array to store unique item IDs
    var uniqueItemIds = [];

    // Function to update total cost and weight
    function updateTotal() {
      // Reset total cost and weight
      totalCost = 0;
      totalWeight = 0;
      orderDetails = [];
      uniqueItemIds = []; // Reset unique item IDs array

      // Iterate over each selected item
      $(".form-product-option-counter.selected").each(function () {
        var itemId = $(this).find(".quantity").attr("data-item-id");
        var quantity = parseInt($(this).find(".quantity").text());

        // Add item ID to uniqueItemIds array if it doesn't already exist
        if (uniqueItemIds.indexOf(itemId) === -1) {
          uniqueItemIds.push(itemId);
        }

        var apiUrl = `https://echo-pricing-logic.vercel.app/item?id=${itemId}&quantity=${quantity}`;

        // Reference to the outer scope for using inside AJAX success callback
        var self = this;

        // Add the .disable class to the add and subtract buttons
        $(this).find(".counter-add, .counter-sub").addClass("disable");

        // Call API to get item price and weight
        $.get(apiUrl, function (response) {
          var [price, weight, name] = response.split(", ");
          totalCost += parseInt(price);
          totalWeight += parseInt(weight);

          // Add order details for the current item
          orderDetails.push({
            itemName: name,
            unitPrice: "$" + parseInt(price) / quantity,
            quantity: quantity + "x",
            price: "$" + price,
          });

          // Display total cost and weight
          $("#total-cost").text(totalCost.toFixed(2));
          $("#total-weight").text(totalWeight);

          // Format order details
          var formattedOrderDetails = orderDetails.map(function (item) {
            return (
              item.itemName +
              ", " +
              item.unitPrice +
              ", " +
              item.quantity +
              ", " +
              item.price
            );
          });

          // Update #order-details textarea with formatted order details
          $("#order-details").val(formattedOrderDetails.join("\n"));

          // Store the total price in #total-price in cents
          $("#total-price").val(totalCost * 100);
          // Store the total weight in #total-weight in kg
          $("#total-weight").val(totalWeight + "kg");

          shippingCostAndGrandTotal();

          // Remove the .disable class from the add and subtract buttons
          $(self).find(".counter-add, .counter-sub").removeClass("disable");

          // Print the total number of different items selected
          $("#total-unique-items").val(uniqueItemIds.length);
          //console.log("Total items selected:", uniqueItemIds.length);
          copyTimes = uniqueItemIds.length;
        }).fail(function () {
          console.error("Failed to fetch item details for", itemId);

          // Remove the .disable class from the add and subtract buttons
          $(self).find(".counter-add, .counter-sub").removeClass("disable");
        });
      });

      // If all quantities are 0, clear out the order details
      if ($(".form-product-option-counter.selected").length === 0) {
        $("#order-details").val("");
        $("#total-cost").val("");
        $("#total-weight").val("");
        $("#total-price").val("");
        $("#shipping-cost").val("");
        $("#grand-total").val("");
        $("#distance").val("");
        $("#total-unique-items").val("0");
        //console.log("Total items selected:", 0);
      }
    }

    let maxQuantity = 999;
    let minQuantity = 0;

    // Function to update counter buttons based on quantity
    function updateCounterButtons(quantityElement) {
      var quantity = parseInt(quantityElement.text());
      var counterSub = quantityElement.siblings(".counter-sub");
      var counterAdd = quantityElement.siblings(".counter-add");
      var formProductOptionCounter = quantityElement.closest(
        ".form-product-option-counter"
      );

      // Check if quantity is less than or equal to 0
      if (quantity <= 0) {
        counterSub.addClass("disable");
        formProductOptionCounter.removeClass("selected");
        counterSub.removeClass("invert");
        counterAdd.removeClass("invert");
        quantityElement.removeClass("white").addClass("forest-green");
      } else {
        counterSub.removeClass("disable");
        formProductOptionCounter.addClass("selected");
        counterSub.addClass("invert");
        counterAdd.addClass("invert");
        quantityElement.removeClass("forest-green").addClass("white");
      }

      // Check if quantity is greater than or equal to 999
      if (quantity >= maxQuantity) {
        counterAdd.addClass("disable");
      } else {
        counterAdd.removeClass("disable");
      }

      // Update total cost and weight
      updateTotal();
    }

    // Click event handler for counter subtract button
    $(".counter-sub").click(function () {
      var quantityElement = $(this).siblings(".quantity");
      var quantity = parseInt(quantityElement.text());

      // Ensure quantity doesn't go below 0
      if (quantity > minQuantity) {
        quantity--;
        quantityElement.text(quantity);
        updateCounterButtons(quantityElement);
      }
    });

    // Click event handler for counter add button
    $(".counter-add").click(function () {
      var quantityElement = $(this).siblings(".quantity");
      var quantity = parseInt(quantityElement.text());

      // Ensure quantity doesn't go above 999
      if (quantity < maxQuantity) {
        quantity++;
        quantityElement.text(quantity);
        updateCounterButtons(quantityElement);
      }
    });

    //if .bulk-counter-10 is clicked, click on counter-add 10 times
    $(".bulk-counter-10").click(function () {
      //go to its parent's parent and then search for the closest .quantity element and get its text
      var quantity = parseInt(
        $(this).parent().parent().find(".quantity").text()
      );
      if (quantity < maxQuantity) {
        //add 10 to the quantity instead of clicking 10 times
        quantity += 10;
        if (quantity > maxQuantity) {
          quantity = maxQuantity;
        }
        $(this).parent().parent().find(".quantity").text(quantity);
        updateCounterButtons($(this).parent().parent().find(".quantity"));
      }
    });

    //do the same but for .bulk-counter-25
    $(".bulk-counter-25").click(function () {
      var quantity = parseInt(
        $(this).parent().parent().find(".quantity").text()
      );
      if (quantity < maxQuantity) {
        //add 25 to the quantity instead of clicking 25 times
        quantity += 25;
        if (quantity > maxQuantity) {
          quantity = maxQuantity;
        }
        $(this).parent().parent().find(".quantity").text(quantity);
        updateCounterButtons($(this).parent().parent().find(".quantity"));
      }
    });

    //do the same but for .bulk-counter-50
    $(".bulk-counter-50").click(function () {
      var quantity = parseInt(
        $(this).parent().parent().find(".quantity").text()
      );
      if (quantity < maxQuantity) {
        //add 50 to the quantity instead of clicking 50 times
        quantity += 50;
        if (quantity > maxQuantity) {
          quantity = maxQuantity;
        }
        $(this).parent().parent().find(".quantity").text(quantity);
        updateCounterButtons($(this).parent().parent().find(".quantity"));
      }
    });

    // Initialize counter buttons on page load
    $(".quantity").each(function () {
      updateCounterButtons($(this));
    });

    /*
     *
     *
     * ADDRESS AUTOCOMPLETE AND POSTCODE EXTRACTION
     *
     *
     */

    var addressInput = document.getElementById("address");
    var autocomplete = new google.maps.places.Autocomplete(addressInput, {
      componentRestrictions: {
        country: "nz",
      }, // Restrict autocomplete to New Zealand
    });

    var selectedFromAutocomplete = false;

    autocomplete.addListener("place_changed", function () {
      selectedFromAutocomplete = true;
      processPlaceSelection(autocomplete.getPlace());
    });

    function processPlaceSelection(place) {
      if (!place.geometry) {
        // alert("Selected place does not have a geometry.");
        alert(
          "Please select your address from the Google Maps suggestions dropdown."
        );
        // Reset address and postcode fields
        $("#address").val("");
        $("#post-code").val("");
        return;
      }

      if (!isLocationInNewZealand(place)) {
        // Reset address and postcode fields
        $("#address").val("");
        $("#post-code").val("");
        alert("Sorry, we currently don't pick up at that location!");
        return;
      }

      var postcode = extractPostcodeFromAddressComponents(
        place.address_components
      );
      if (postcode) {
        $("#post-code").val(postcode);
      }

      calculateAndDisplayDistance(place.geometry.location);
    }

    function calculateAndDisplayDistance(origin) {
      const aucklandCatchment = new google.maps.LatLng(
        -36.9249524,
        174.8192662
      );
      const wellingtonCatchment = new google.maps.LatLng(
        -41.2370845,
        174.9130315
      );

      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [aucklandCatchment, wellingtonCatchment],
          travelMode: "DRIVING",
        },
        function (response, status) {
          if (status !== "OK") {
            alert("Error: Unable to calculate distance. Please try again.");
            return;
          }

          const distances = response.rows[0].elements;
          let distanceToAuckland = distances[0].distance
            ? distances[0].distance.value / 1000
            : null; // Distance in km
          let distanceToWellington = distances[1].distance
            ? distances[1].distance.value / 1000
            : null; // Distance in km

          console.log("test distance 1 = " + distanceToAuckland);
          console.log("test distance 2 = " + distanceToWellington);
          distanceToAuckland = parseInt(distanceToAuckland);
          distanceToWellington = parseInt(distanceToWellington);

          // Determine which catchment area is applicable
          if (distanceToAuckland <= 50) {
            console.log(
              "User's location is within Auckland catchment area:",
              distanceToAuckland.toFixed(2),
              "km"
            );
            // Set catchment area logic here for Auckland
            $("#distance").val(distanceToAuckland.toFixed(2) + "km");
          } else {
            if (distanceToWellington <= 50) {
              console.log(
                "User's location is within Wellington catchment area:",
                distanceToWellington.toFixed(2),
                "km"
              );
              // Set catchment area logic here for Wellington
              $("#distance").val(distanceToWellington.toFixed(2) + "km");
            } else {
              alert("Sorry, we currently don't pick up at that location!");
              $("#address").val("");
              $("#post-code").val("");
              $("#distance").val("");
            }
          }

          // Optionally, adjust shipping cost and grand total if applicable
          shippingCostAndGrandTotal();
        }
      );
    }

    function shippingCostAndGrandTotal() {
      let distance = $("#distance").val();
      distance = distance.substring(0, distance.length - 2); // Remove "km" from the end
      let weight = $("#total-weight").val();
      weight = weight.substring(0, weight.length - 2); // Remove "kg" from the end
      var apiUrl = `https://echo-pricing-logic.vercel.app/shipping?distance=${distance}&weight=${weight}`;

      $.get(apiUrl, function (response) {
        $("#shipping-cost").val(response);
        var totalPrice = parseFloat($("#total-price").val());
        var grandTotal = totalPrice + parseFloat(response);
        $("#grand-total").val(grandTotal);
      });
    }

    function extractPostcodeFromAddressComponents(components) {
      for (var i = 0; i < components.length; i++) {
        for (var j = 0; j < components[i].types.length; j++) {
          if (components[i].types[j] === "postal_code") {
            return components[i].long_name;
          }
        }
      }
      return null;
    }

    function isLocationInNewZealand(place) {
      for (var i = 0; i < place.address_components.length; i++) {
        var addressComponent = place.address_components[i];
        for (var j = 0; j < addressComponent.types.length; j++) {
          if (
            addressComponent.types[j] === "country" &&
            addressComponent.short_name !== "NZ"
          ) {
            return false;
          }
        }
      }
      return true;
    }

    // Note: No longer needed as we use the Distance Matrix API now
    // function calculateDistance(origin, destination) {...}
    // function deg2rad(deg) {...}

    /*
     *
     *
     * ITEM DROPDOWN HEIGHT CALCULATION AND SELECTED CIRCLE
     *
     *
     */

    function itemDropdownCalculation() {
      //hide all the .dropdown-selected-circle elements by default - by setting its opacity to 0
      $(".dropdown-selected-circle").css("opacity", 0);

      //go through all the .form-product-dropdown element, and set its height to the outer height of .form-product-dropdown-title inside of it
      $(".form-product-dropdown").each(function () {
        $(this).height(
          Math.round($(this).find(".form-product-dropdown-title").outerHeight())
        );
      });

      //if any of the .form-product-dropdown-title elements are clicked, update the height of the .form-product-dropdown element by adding the outer height of .form-product-dropdown-title and .form-product-dropdown-options inside of it, otherwise return back to the height of .form-product-dropdown-title
      $(".form-product-dropdown-title").click(function () {
        var dropdown = $(this).closest(".form-product-dropdown");
        var dropdownOptions = dropdown.find(".form-product-dropdown-options");

        if (
          Math.round(dropdown.height()) ===
          Math.round(
            dropdown.find(".form-product-dropdown-title").outerHeight()
          )
        ) {
          console.log("dropdown height is equal to title height");
          console.log("dropdown height: " + Math.round(dropdown.height()));
          console.log(
            "title height: " +
              Math.round(
                dropdown.find(".form-product-dropdown-title").outerHeight()
              )
          );
          dropdown.height(
            Math.round(
              dropdown.find(".form-product-dropdown-title").outerHeight()
            ) + Math.round(dropdownOptions.outerHeight())
          );
          console.log("actual dropdown height: " + dropdown.height());
          console.log(
            "actual title height: " +
              dropdown.find(".form-product-dropdown-title").outerHeight()
          );

          //find inside .form-product-dropdown-title add .rotate class to the element with class .form-field-icon.right
          $(this).find(".form-field-icon.right").addClass("rotate");
          //hide the .dropdown-selected-circle
          dropdown.find(".dropdown-selected-circle").css("opacity", 0);
        } else {
          console.log("dropdown height is not equal to title height");
          console.log("dropdown height: " + Math.round(dropdown.height()));
          console.log(
            "title height: " +
              Math.round(
                dropdown.find(".form-product-dropdown-title").outerHeight()
              )
          );
          dropdown.height(
            Math.round(
              dropdown.find(".form-product-dropdown-title").outerHeight()
            )
          );
          console.log("actual dropdown height: " + dropdown.height());
          console.log(
            "actual title height: " +
              dropdown.find(".form-product-dropdown-title").outerHeight()
          );
          //find inside .form-product-dropdown-title remove .rotate class from the element with class .form-field-icon.right
          $(this).find(".form-field-icon.right").removeClass("rotate");
          //search for the elements with class .form-product-option-counter inside its parent's children elements, and see if any of them have a .selected class, if so, show the .dropdown-selected-circle inside of the .form-product-dropdown-title, otherwise hide it
          if (dropdown.find(".form-product-option-counter.selected").length) {
            dropdown.find(".dropdown-selected-circle").css("opacity", 1);
          } else {
            dropdown.find(".dropdown-selected-circle").css("opacity", 0);
          }
        }
      });
    }

    //run itemDropdownCalculation function
    itemDropdownCalculation();

    //if #res-form-button or #com-form-button is clicked, run itemDropdownCalculation function
    $("#res-form-button, #com-form-button").click(function () {
      itemDropdownCalculation();
      //click on all the .form-product-dropdown-title elements, only the ones that have rotate class on .form-field-icon.right of the dropdown
      for (let i = 0; i < $(".form-product-dropdown-title").length; i++) {
        if (
          $(".form-product-dropdown-title")
            .eq(i)
            .find(".form-field-icon.right")
            .hasClass("rotate")
        ) {
          $(".form-product-dropdown-title").eq(i).click();
        }
      }
    });

    //run it also when window is resized
    $(window).resize(function () {
      itemDropdownCalculation();
      //click on all the .form-product-dropdown-title elements, only the ones that have rotate class on .form-field-icon.right of the dropdown
      for (let i = 0; i < $(".form-product-dropdown-title").length; i++) {
        if (
          $(".form-product-dropdown-title")
            .eq(i)
            .find(".form-field-icon.right")
            .hasClass("rotate")
        ) {
          $(".form-product-dropdown-title").eq(i).click();
        }
      }
    });

    /*
     *
     *
     * IMAGE UPLOAD & LINK CONVERTION
     *
     *
     */

    /*
     *
     *
     * FORM SANITIZATION
     *
     *
     */

    // sanitizing phone number inputs
    $("#on-site-phone, #bac-phone, #bac-billing-phone, #bac-contact-phone").on(
      "input",
      function () {
        // Get the entered value
        var enteredValue = $(this).val();
        // Check if the entered value contains any character that is not a number, plus, asterisk, hyphen, or space
        if (/[^0-9+\-*\s]/.test(enteredValue)) {
          // Remove the last entered character
          $(this).val(enteredValue.slice(0, -1));
        }
      }
    );

    // Validation functions
    function isNotEmpty(value) {
      return value.trim() !== "";
    }

    function isNotZero(value) {
      return parseFloat(value) !== 0;
    }

    function isValidNumber(value) {
      return !isNaN(value) && value.indexOf(".") === -1;
    }

    function isValidName(value) {
      return /^[a-zA-Z ]+$/.test(value);
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    // function isValidPhoneNumber(value) {
    //     return /^[0-9]+$/.test(value);
    // }

    function isValidPhoneNumber(value) {
      return /^[+()-\s\d]+$/.test(value);
    }

    function isChecked(value) {
      return $("#" + value).hasClass("clicked");
    }

    function isSelected(value) {
      return $("#" + value).val() !== "";
    }

    const fieldsResidential = [
      {
        id: "address",
        name: "Address",
        validations: [isNotEmpty],
      },
      {
        id: "post-code",
        name: "Post Code",
        validations: [isNotEmpty],
      },
      {
        id: "day1",
        name: "Day 1",
        validations: [isNotEmpty],
      },
      {
        id: "day2",
        name: "Day 2",
        validations: [isNotEmpty],
      },
      {
        id: "day3",
        name: "Day 3",
        validations: [isNotEmpty],
      },
      {
        id: "total-unique-items",
        name: "Total Unique Items",
        validations: [isNotZero, isNotEmpty],
      },
      {
        id: "grand-total",
        name: "Grand Total",
        validations: [isValidNumber, isNotEmpty],
      },
      {
        id: "bac-first-name",
        name: "First Name",
        validations: [isValidName, isNotEmpty],
      },
      {
        id: "bac-surname",
        name: "Surname",
        validations: [isValidName, isNotEmpty],
      },
      {
        id: "bac-email-address",
        name: "Email Address",
        validations: [isValidEmail, isNotEmpty],
      },
      {
        id: "bac-phone",
        name: "Phone",
        validations: [isValidPhoneNumber, isNotEmpty],
      },
      {
        id: "bac-terms-and-conditions-checkbox",
        name: "Terms and Conditions Checkbox",
        validations: ["bac-terms-and-conditions-checkbox"],
      },
    ];

    const fieldsCommercial = [
      {
        id: "address",
        name: "Address",
        validations: [isNotEmpty],
      },
      {
        id: "post-code",
        name: "Post Code",
        validations: [isNotEmpty],
      },
      {
        id: "on-site-full-name",
        name: "On-Site Full Name",
        validations: [isValidName, isNotEmpty],
      },
      {
        id: "on-site-phone",
        name: "On-Site Phone",
        validations: [isValidPhoneNumber, isNotEmpty],
      },
      {
        id: "day1",
        name: "Day 1",
        validations: [isNotEmpty],
      },
      {
        id: "day2",
        name: "Day 2",
        validations: [isNotEmpty],
      },
      {
        id: "day3",
        name: "Day 3",
        validations: [isNotEmpty],
      },
      {
        id: "total-unique-items",
        name: "Total Unique Items",
        validations: [isNotZero, isNotEmpty],
      },
      {
        id: "grand-total",
        name: "Grand Total",
        validations: [isValidNumber, isNotEmpty],
      },
      {
        id: "bac-company-name",
        name: "Company Name",
        validations: [isNotEmpty],
      },
      {
        id: "bac-company-size",
        name: "Company Size",
        validations: ["bac-company-size", isSelected],
      },
      {
        id: "bac-business-sector",
        name: "Business Sector",
        validations: ["bac-business-sector", isSelected],
      },
      {
        id: "bac-billing-first-name",
        name: "Billing First Name",
        validations: [isValidName, isNotEmpty],
      },
      {
        id: "bac-billing-surname",
        name: "Billing Surname",
        validations: [isValidName, isNotEmpty],
      },
      {
        id: "bac-billing-email-address",
        name: "Billing Email Address",
        validations: [isValidEmail, isNotEmpty],
      },
      {
        id: "bac-billing-phone",
        name: "Billing Phone",
        validations: [isValidPhoneNumber, isNotEmpty],
      },
      {
        id: "bac-contact-first-name",
        name: "Contact First Name",
        validations: [isValidName, isNotEmpty],
      },
      {
        id: "bac-contact-surname",
        name: "Contact Surname",
        validations: [isValidName, isNotEmpty],
      },
      {
        id: "bac-contact-email-address",
        name: "Contact Email Address",
        validations: [isValidEmail, isNotEmpty],
      },
      {
        id: "bac-contact-phone",
        name: "Contact Phone",
        validations: [isValidPhoneNumber, isNotEmpty],
      },
      {
        id: "bac-terms-and-conditions-checkbox",
        name: "Terms and Conditions Checkbox",
        validations: ["bac-terms-and-conditions-checkbox"],
      },
    ];

    function generateValidationMessage(type, incompleteFields) {
      let baseMessage = `Note: To help us process your ${type.toLowerCase()} request efficiently, please make sure to complete `;
      const fieldDescriptions = {
        address: "your address",
        "post-code": "your postal code",
        day1: "the first preferred date",
        day2: "the second preferred date",
        day3: "the third preferred date",
        "bac-first-name": "your first name",
        "bac-surname": "your surname",
        "bac-email-address": "your email address",
        "bac-phone": "your phone number",
        "bac-terms-and-conditions-checkbox":
          "the terms and conditions confirmation",
        // Commercial-specific fields
        "on-site-full-name": "the on-site contact's full name",
        "on-site-phone": "the on-site contact's phone number",
        "bac-company-name": "your company name",
        "bac-company-size": "your company size",
        "bac-business-sector": "your business sector",
        "bac-billing-first-name": "the billing contact's first name",
        "bac-billing-surname": "the billing contact's surname",
        "bac-billing-email-address": "the billing contact's email address",
        "bac-billing-phone": "the billing contact's phone number",
        "bac-contact-first-name": "the primary contact's first name",
        "bac-contact-surname": "the primary contact's surname",
        "bac-contact-email-address": "the primary contact's email address",
        "bac-contact-phone": "the primary contact's phone number",
        // Special instructions for unique items and grand total
        "total-unique-items":
          "selection of at least 1 item from the list of items to be collected",
        "grand-total": "",
      };

      let fieldsToMention = incompleteFields.filter(
        (field) =>
          fieldDescriptions[field] && fieldDescriptions[field].length > 0
      );

      let fieldList = fieldsToMention
        .map((fieldId) => fieldDescriptions[fieldId] || fieldId)
        .join(", ")
        .replace(/, ([^,]*)$/, ", and $1");
      let fullMessage =
        fieldList.length > 0
          ? `${baseMessage}${fieldList}.`
          : `${baseMessage}all necessary fields.`;
      fullMessage +=
        "<br><br>Ensuring all details are filled accurately aids in a smooth and quick processing.";

      return fullMessage;
    }

    function validateFields(fields, type) {
      let incompleteFields = [];
      let ticker = 0; // Initialize ticker for counting completed fields

      fields.forEach((field) => {
        const value = $("#" + field.id).val();
        let isValid = true;
        const validations = field.validations;
        validations.forEach((validation) => {
          if (typeof validation === "function") {
            if (!validation(value)) {
              isValid = false;
            }
            // return validation(value);
          } else if (validation === "bac-terms-and-conditions-checkbox") {
            if (!isChecked(field.id)) {
              isValid = false;
            }
            // return isChecked("#" + field.id);
          } else if (
            validation === "bac-company-size" ||
            validation === "bac-business-sector"
          ) {
            if (!isSelected(field.id)) {
              isValid = false;
            }
            // return isSelected("#" + field.id);
          }
          return false;
        });

        if (!isValid) {
          incompleteFields.push(field.id); // Collect IDs of incomplete fields
        } else {
          ticker++; // Increment ticker for each valid field
        }
      });

      if (incompleteFields.length > 0) {
        $("#form-validator-text").html(
          generateValidationMessage(type, incompleteFields)
        );
        $("#form-validator-wrapper").show();
      } else {
        $("#form-validator-wrapper").hide();
      }

      // Log the ticker value and the status of the fields
      //console.log(`No. of ${type} Fields completed: ${ticker}`);
      //console.log(`Total ${type} Fields: ${fields.length}`);
      //console.log(`Incomplete ${type} Fields: ${incompleteFields.length}`);
      //print the incomplete fields name
      //console.log(`Incomplete ${type} Fields: ${incompleteFields.join(", ")}`);

      // You might want to use the ticker value for further logic, e.g., enabling a submit button
      if (ticker === fields.length) {
        $("#review-booking").removeClass("disable");
      } else {
        $("#review-booking").addClass("disable");
      }

      return ticker; // Although it's not necessary to return the ticker, it might be useful depending on your setup
    }

    // function validateFields(fields, type) {
    //     let ticker = 0;
    //     let completedFields = [];
    //     fields.forEach((field) => {
    //         const value = $("#" + field.id).val();
    //         // console.log(`Field ID: ${field.id}, Value: ${value}`);
    //         const validations = field.validations;
    //         let isValid = true;
    //         validations.forEach((validation) => {
    //             if (typeof validation === "function") {
    //                 if (!validation(value)) {
    //                     isValid = false;
    //                 }
    //             } else if (validation === "bac-terms-and-conditions-checkbox") {
    //                 if (!isChecked(field.id)) {
    //                     isValid = false;
    //                 }
    //             } else if (
    //                 validation === "bac-company-size" ||
    //                 validation === "bac-business-sector"
    //             ) {
    //                 if (!isSelected(field.id)) {
    //                     isValid = false;
    //                 }
    //             }
    //         });
    //         if (isValid) {
    //             ticker++;
    //             completedFields.push(field.name);
    //         }
    //     });
    //     console.log(`No. of ${type} Fields completed: ${ticker}`);
    //     console.log(
    //         `Total ${type} Fields: ${fields.map((field) => field.name).join(", ")}`
    //     );
    //     console.log(`Completed ${type} Fields: ${completedFields.join(", ")}`);
    //     return ticker;
    // }

    // // Trigger validation every second. make the setInterval into a function called triggerValidation
    // const triggerValidation = setInterval(function () {
    //     let ticker = 0;
    //     const type =
    //         $("#collection-type").val() === "Residential" ?
    //         "Residential" :
    //         "Commercial";
    //     const fields =
    //         type === "Residential" ? fieldsResidential : fieldsCommercial;
    //     ticker = validateFields(fields, type);
    //     if (ticker === fields.length) {
    //         //remove .disable class from #review-booking
    //         $("#review-booking").removeClass("disable");
    //     } else {
    //         //add .disable class to #review-booking
    //         $("#review-booking").addClass("disable");
    //     }
    // }, 250);

    // Trigger validation periodically
    const triggerValidation = setInterval(function () {
      const type =
        $("#collection-type").val() === "Residential"
          ? "Residential"
          : "Commercial";
      const fields =
        type === "Residential" ? fieldsResidential : fieldsCommercial;
      validateFields(fields, type); // Now solely responsible for updating the UI based on validation
    }, 250);

    /*
     *
     *
     * FORM LOGIC
     *
     *
     */

    Webflow.push(function () {
      // Disable submitting form fields during development
      $("#bac-main-form").submit(function () {
        //set the text of #bac-title to "Processing..."
        $("#bac-title").text("Processing...");

        // Serialize the form data or manually gather the data
        var formData = $(this).serializeArray(); // Example serialization

        // Store formData in sessionStorage or handle as needed
        sessionStorage.setItem("formData", JSON.stringify(formData));

        // Optionally, redirect to a review page or handle the data in another way
        window.location.href = "/booking-review"; // Change this to your review page URL
        return false;
      });
    });

    /*
     *
     *
     * FORM PRE-FILLING
     *
     *
     */

    // Pre-fill form fields from stored session data
    var storedFormData = sessionStorage.getItem("formData");
    if (storedFormData) {
      var formData = JSON.parse(storedFormData);

      // Pre-fill form based on stored data
      formData.forEach(function (item) {
        var input = $("[name='" + item.name + "'], [id='" + item.name + "']");
        if (
          input.attr("type") === "checkbox" ||
          input.attr("type") === "radio"
        ) {
          input.filter('[value="' + item.value + '"]').prop("checked", true);
        } else {
          input.val(item.value);
        }

        // Trigger changes for dropdowns or other components as needed
        if (input.hasClass("select-input") && input.val() == item.value) {
          input.trigger("change");
        }
      });

      // Adjust UI based on collection type
      if ($("#collection-type").val() === "Residential") {
        $("#res-form-button").click();
      } else if ($("#collection-type").val() === "Commercial") {
        $("#com-form-button").click();
      }

      // Delay item selection simulation to ensure UI updates are processed
      setTimeout(function () {
        // Assuming #order-details or similar structure to find and parse item selections
        var orderDetailsContent = formData.find(
          (item) => item.name === "Selected-Items"
        ).value;
        //empty the value of #order-details
        $("#order-details").val("");
        var orderLines = orderDetailsContent.split("\n");

        orderLines.forEach(function (line) {
          // Extract item name and quantity
          var parts = line.split(", ");
          var itemName = parts[0].trim();
          var quantity = parseInt(parts[2]);

          $(".form-product-option").each(function () {
            var itemNameElement = $(this).find(".item-name").text().trim();
            if (itemNameElement === itemName) {
              var addButton = $(this).find(".counter-add:not(.disable)");
              for (let i = 0; i < quantity; i++) {
                addButton.click();
              }
            }
          });
        });

        //wait for 500ms, click on all .form-product-dropdown-title elements
        setTimeout(function () {
          $(".form-product-dropdown-title").click();
          setTimeout(function () {
            $(".form-product-dropdown-title").click();
            //empty #order-details
            $("#order-details").val("");
            setTimeout(function () {
              //click on #counter-add-test
              $("#counter-add-test").click();
              setTimeout(function () {
                //click on #counter-sub-test
                $("#counter-sub-test").click();
              }, 500);
            }, 100);
          }, 100);
        }, 500);
      }, 100); // Adjust delay as necessary to ensure all dynamic content is visible
    }
  }
});
