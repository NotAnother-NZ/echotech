$(document).ready(function () {
  //if #bac-form-wrapper is available
  copyTimes = 0;
  if ($("#bac-form-wrapper").length) {
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
          console.log("Total items selected:", uniqueItemIds.length);
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
        console.log("Total items selected:", 0);
      }
    }

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

      // Check if quantity is greater than or equal to 99
      if (quantity >= 99) {
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
      if (quantity > 0) {
        quantity--;
        quantityElement.text(quantity);
        updateCounterButtons(quantityElement);
      }
    });

    // Click event handler for counter add button
    $(".counter-add").click(function () {
      var quantityElement = $(this).siblings(".quantity");
      var quantity = parseInt(quantityElement.text());

      // Ensure quantity doesn't go above 99
      if (quantity < 99) {
        quantity++;
        quantityElement.text(quantity);
        updateCounterButtons(quantityElement);
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
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (!isLocationInNewZealand(place)) {
        // Reset address and postcode fields
        $("#address").val("");
        $("#post-code").val("");
        alert("Sorry, we currently don't pick up at that location!");
      } else {
        var postcode = extractPostcodeFromAddressComponents(
          place.address_components
        );
        if (postcode) {
          $("#post-code").val(postcode);
        }
      }

      // Calculate driving distance
      var origin = place.geometry.location;
      var destinationLocation = new google.maps.LatLng(-36.92, 174.82); // Latitude and Longitude of destination

      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destinationLocation],
          travelMode: "DRIVING",
        },
        function (response, status) {
          if (status !== "OK") {
            alert("Error was: " + status);
            return;
          }

          var distance = response.rows[0].elements[0].distance.value / 1000; // Distance in km

          if (distance > 50) {
            // Reset address and postcode fields
            $("#address").val("");
            $("#post-code").val("");
            alert("Sorry, we currently don't pick up at that location!");
            return;
          }

          console.log(
            "Driving distance to destination:",
            distance.toFixed(2),
            "km"
          );
          $("#distance").val(distance.toFixed(2) + "km");
          shippingCostAndGrandTotal();
        }
      );
    });

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

    // Listen for focus change on address input
    addressInput.addEventListener("blur", function () {
      if (!selectedFromAutocomplete) {
        $("#address").val("");
      }
      selectedFromAutocomplete = false;
    });

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

    //hide all the .dropdown-selected-circle elements by default - by setting its opacity to 0
    $(".dropdown-selected-circle").css("opacity", 0);

    //go through all the .form-product-dropdown element, and set its height to the outer height of .form-product-dropdown-title inside of it
    $(".form-product-dropdown").each(function () {
      $(this).height(
        $(this).find(".form-product-dropdown-title").outerHeight()
      );
    });

    //if any of the .form-product-dropdown-title elements are clicked, update the height of the .form-product-dropdown element by adding the outer height of .form-product-dropdown-title and .form-product-dropdown-options inside of it, otherwise return back to the height of .form-product-dropdown-title
    $(".form-product-dropdown-title").click(function () {
      var dropdown = $(this).closest(".form-product-dropdown");
      var dropdownOptions = dropdown.find(".form-product-dropdown-options");

      if (
        dropdown.height() ===
        dropdown.find(".form-product-dropdown-title").outerHeight()
      ) {
        dropdown.height(
          dropdown.find(".form-product-dropdown-title").outerHeight() +
            dropdownOptions.outerHeight()
        );
        //find inside .form-product-dropdown-title add .rotate class to the element with class .form-field-icon.right
        $(this).find(".form-field-icon.right").addClass("rotate");
        //hide the .dropdown-selected-circle
        dropdown.find(".dropdown-selected-circle").css("opacity", 0);
      } else {
        dropdown.height(
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

    function isValidPhoneNumber(value) {
      return /^[0-9]+$/.test(value);
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

    function validateFields(fields, type) {
      let ticker = 0;
      let completedFields = [];
      fields.forEach((field) => {
        const value = $("#" + field.id).val();
        console.log(`Field ID: ${field.id}, Value: ${value}`);
        const validations = field.validations;
        let isValid = true;
        validations.forEach((validation) => {
          if (typeof validation === "function") {
            if (!validation(value)) {
              isValid = false;
            }
          } else if (validation === "bac-terms-and-conditions-checkbox") {
            if (!isChecked(field.id)) {
              isValid = false;
            }
          } else if (
            validation === "bac-company-size" ||
            validation === "bac-business-sector"
          ) {
            if (!isSelected(field.id)) {
              isValid = false;
            }
          }
        });
        if (isValid) {
          ticker++;
          completedFields.push(field.name);
        }
      });
      console.log(`No. of ${type} Fields completed: ${ticker}`);
      console.log(
        `Total ${type} Fields: ${fields.map((field) => field.name).join(", ")}`
      );
      console.log(`Completed ${type} Fields: ${completedFields.join(", ")}`);
      return ticker;
    }

    // Trigger validation every second. make the setInterval into a function called triggerValidation
    const triggerValidation = setInterval(function () {
      let ticker = 0;
      const type =
        $("#collection-type").val() === "Residential"
          ? "Residential"
          : "Commercial";
      const fields =
        type === "Residential" ? fieldsResidential : fieldsCommercial;
      ticker = validateFields(fields, type);
      if (ticker === fields.length) {
        //remove .disable class from #review-booking
        $("#review-booking").removeClass("disable");
      } else {
        //add .disable class to #review-booking
        $("#review-booking").addClass("disable");
      }
    }, 250);

    /*
     *
     *
     * BOOKING REVIEW
     *
     *
     */

    let reviewContactDetails = "";

    //hide #booking-review-wrapper by default
    $("#booking-review-wrapper").hide();
    //show #booking-ongoing-wrapper by default
    $("#booking-ongoing-wrapper").show();
    //show #collection-sub-header by default
    $("#collection-sub-header").show();

    $("#review-booking").click(function () {
      //add #review to the current url but don't reload the page
      history.pushState(null, null, "#review");

      //show #booking-review-wrapper
      $("#booking-review-wrapper").show();
      //hide #booking-ongoing-wrapper
      $("#booking-ongoing-wrapper").hide();
      //hide #collection-sub-header
      $("#collection-sub-header").hide();
      //set the text of #bac-title to "Review Booking"
      $("#bac-title").text("Review Booking");
      //set the text of #bac-para to ""
      $("#bac-para").text("");
      //add .review class to #text-header-top and #main-wrapper
      $("#text-header-top, #main-wrapper").addClass("review");
      //scroll to the top of the page
      $(window).scrollTop(0);
      //stop the triggerValidation function
      clearInterval(triggerValidation);

      var itemSummaryWrapper = $(".item-summary-wrapper-proxy").clone();
      $(".item-summary-wrapper-proxy").remove();

      var orderDetails = $("#order-details")
        .val()
        .split("\n")
        .map(function (item) {
          return item.split(", ");
        });

      for (var i = 0; i < orderDetails.length; i++) {
        // Clone the itemSummaryWrapper for each order detail
        var clonedItemSummaryWrapper = itemSummaryWrapper.clone();
        // Iterate over the body2 elements and assign corresponding values from orderDetails
        clonedItemSummaryWrapper.find(".body2").each(function (index) {
          $(this).text(orderDetails[i][index]);
        });
        // Append the cloned itemSummaryWrapper to the item-summary-wrapper but make sure its before #item-summary-wrapper-des
        clonedItemSummaryWrapper.insertBefore("#item-summary-wrapper-des");
      }

      $("#review-address").text($("#address")[0].value);
      $("#review-post-code").text($("#post-code")[0].value);
      $("#review-date1").text($("#day1")[0].value);
      $("#review-date2").text($("#day2")[0].value);
      $("#review-date3").text($("#day3")[0].value);

      //calculating subtotal
      var reviewSubtotal = $("#total-price")[0].value;
      $("#review-subtotal").text("$" + (reviewSubtotal / 100).toFixed(2));
      //calculating shipping
      var reviewShipping = $("#shipping-cost")[0].value;
      $("#review-shipping").text("$" + (reviewShipping / 100).toFixed(2));
      //calculating total
      var reviewTotal = $("#grand-total")[0].value;
      $("#review-grand-total").text("$" + (reviewTotal / 100).toFixed(2));

      // Check if #collection-type has a value of close to "Residential" or "Commercial"
      if ($("#collection-type").val() === "Residential") {
        console.log("Residential on Booking review");
        // Store the value of #bac-first-name, #bac-surname, #bac-email-address, #bac-phone in a variable, will all in separate lines
        reviewContactDetails =
          $("#bac-first-name")[0].value +
          " " +
          $("#bac-surname")[0].value +
          "<br>" +
          $("#bac-email-address")[0].value +
          "<br>" +
          $("#bac-phone")[0].value;
        $("#review-contact-details")[0].innerHTML = reviewContactDetails;
        //hide #item-summary-wrapper-des
        $("#item-summary-wrapper-des").hide();
        //hide #tandc-text
        $("#tandc-text").hide();
        //show #payment-wrapper
        $("#payment-wrapper").show();

        stripeName = $("#bac-first-name").val() + " " + $("#bac-surname").val();
        stripeEmail = $("#bac-email-address").val();
        stripePhone = $("#bac-phone").val();
        stripeMetadata =
          reviewContactDetails + $("#collection-instruction").val();
      } else {
        console.log("Commercial on Booking review");
        // Store the value of #bac-company-name, #bac-contact-first-name, #bac-contact-surname, #bac-contact-email-address, #bac-contact-phone in a variable, will all in separate lines
        reviewContactDetails =
          $("#bac-company-name")[0].value +
          "<br>" +
          $("#bac-contact-first-name")[0].value +
          " " +
          $("#bac-contact-surname")[0].value +
          "<br>" +
          $("#bac-contact-email-address")[0].value +
          "<br>" +
          $("#bac-contact-phone")[0].value;
        $("#review-contact-details")[0].innerHTML = reviewContactDetails;

        stripeName =
          $("#bac-contact-first-name").val() +
          " " +
          $("#bac-contact-surname").val();
        stripeEmail = $("#bac-contact-email-address").val();
        stripePhone = $("#bac-contact-phone").val();

        //show #item-summary-wrapper-des if the value of #data-erasure-needed is "Yes"
        if ($("#data-erasure-needed").val() === "Yes") {
          $("#item-summary-wrapper-des").show();
          $("#tandc-text").show();
          //hide #payment-wrapper
          $("#payment-wrapper").hide();
          //set the text of #review-grand-total to "TBC"
          $("#review-grand-total").text("TBC");
        } else {
          $("#item-summary-wrapper-des").hide();
          $("#tandc-text").hide();
          $("#payment-wrapper").show();
          stripeMetadata =
            reviewContactDetails + $("#collection-instruction").val();
          var reviewTotal = $("#grand-total")[0].value;
          $("#review-grand-total").text("$" + (reviewTotal / 100).toFixed(2));
        }
      }
    });

    //if #cancel-booking is clicked, hard reload the page
    $("#cancel-booking").click(function () {
      //set the text of #bac-title to "Cancelling"
      $("#bac-title").text("Cancelling");
      //scroll to the top of the page
      $(window).scrollTop(0);
      //if the current url has #review in it, remove it and then store the url

      if (window.location.href.indexOf("#review") > -1) {
        urltogo = window.location.href.replace("#review", "");
        //go to the stored url
        window.location.href = urltogo;
      }
    });

    // //check if user is trying to reload or go back
    // window.onbeforeunload = function (event) {
    //     // Check if the current URL contains #review
    //     if (window.location.href.includes("#review")) {
    //         // Customize the message for leaving the review section
    //         event.returnValue = "Are you sure you want to leave this page?";
    //         return event.returnValue; // For legacy browsers
    //     }
    // };

    /*
     *
     *
     * STRIPE PAYMENT INTEGRATION
     *
     *
     */

    // var stripe = Stripe("pk_test_skEhxTitrwvq9DUcfeVFf68h00amxFRMoM"); // Replace with your test publishable key
    var stripe = Stripe("pk_live_vmX8g8tMYxOg9nqmrSUuObnd00MZEw25GX");

    var elements = stripe.elements();
    var cardElement = elements.create("card");
    cardElement.mount("#card-element");

    //when #bac-pay is clicked
    $("#bac-pay").click(function () {
      //set the text of #bac-pay to "Processing Payment"
      $("#bac-pay").text("Processing Payment");
      //set the text of #bac-title to "Processing Payment"
      $("#bac-title").text("Processing Payment");

      var stripeAmount = $("#grand-total").val();
      console.log(stripeAmount);
      stripeAmount = parseInt(stripeAmount);
      console.log(stripeAmount);

      var stripeAddress = $("#address").val() + ", " + $("#post-code").val();
      var stripeCollectionInstruction = $("#collection-instruction").val();
      var stripeContactDetails = reviewContactDetails;

      // Format contact details from reviewContactDetails. it currently has <br> tags, so replace them with line breaks
      var contactDetails = stripeContactDetails.replace(/<br>/g, "\n");

      //create successurl by extracting the current url domain + /booking-confirmation
      var stripeSuccessUrl = window.location.origin + "/booking-confirmation";

      // Format order details with line breaks
      var orderDetails = $("#order-details").val().split("\n").join("\n");
      var preferredDates =
        $("#day1").val() + "\n" + $("#day2").val() + "\n" + $("#day3").val();

      // Format metadata
      var metadata =
        "Booked Items -\n" +
        orderDetails +
        "\n\nPreferred Dates -\n" +
        preferredDates +
        "\n\nCollection Address -\n" +
        stripeAddress +
        "\n\nCollection Instruction -\n" +
        stripeCollectionInstruction +
        "\n\nContact Details -\n" +
        contactDetails;

      stripe.createToken(cardElement).then(function (result) {
        if (result.error) {
          console.error(result.error.message);
        } else {
          console.log("Token:", result.token); // Log token details for debugging
          $.ajax({
            url:
              "https://echo-stripe-logic.vercel.app/api/payment?amount=" +
              stripeAmount,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              token: result.token.id, // Ensure you're passing the token ID
              amount: stripeAmount,
              fullname: stripeName,
              email: stripeEmail,
              phone: stripePhone,
              address: stripeAddress,
              metadata: metadata,
              successUrl: stripeSuccessUrl,
            }),
            success: function (data) {
              console.log(data); // Handle response from server
              window.location.href = stripeSuccessUrl;
            },
            error: function (error) {
              console.error("Error:", error);
              alert("Payment failed. Please try again.");
              // Redirect to the urltogo
              urltogo = window.location.href.replace("#review", "");
              window.location.href = urltogo;
            },
          });
        }
      });
    });
  }
});
