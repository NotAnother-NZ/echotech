/*
 *
 *
 * FORM LOGIC
 *
 *
 */

Webflow.push(function () {
  // Disable submitting form fields during development
  $("#bac-main-review-form").submit(function () {
    return false;
  });
});

/*
 *
 *
 * BOOKING REVIEW
 *
 *
 */

$(document).ready(function () {
  if ($("#bac-form-wrapper-review").length) {
    //hide #payment-status-wrapper by default
    $("#payment-status-wrapper").hide();
    // make sure that there's a sessionStorage of formData, otherwise go to /book-a-collection
    if (
      !sessionStorage.getItem("formData") ||
      sessionStorage.getItem("formData") === ""
    ) {
      window.location.href = "/book-a-collection";
    } else {
      var formData = JSON.parse(sessionStorage.getItem("formData"));
      console.log(formData);

      // // Initialize an empty object to store formData for easy access
      // let formDataObj = {};
      // formData.forEach(function (item) {
      //     formDataObj[item.name] = item.value;
      // });

      // Parse formData into an object for easier access
      let formDataObj = formData.reduce((acc, item) => {
        acc[item.name] = item.value;
        return acc;
      }, {});

      // Now you can access the values directly from formDataObj
      if (formDataObj["Collection-Type"] === "Residential") {
        console.log("Residential on Booking review");

        //set the text of #bac-para to a custom text
        $("#bac-para").text(
          "Please verify your contact and collection information below. After reviewing the details and costs, proceed with payment to finalize your booking."
        );

        let reviewContactDetails =
          formDataObj["First-Name"] +
          " " +
          formDataObj["Surname"] +
          "<br>" +
          formDataObj["Email-Address"] +
          "<br>" +
          formDataObj["Phone-Number"];
        $("#review-contact-details").html(reviewContactDetails); // Use .html() for HTML content

        //get address and set that to #review-address
        $("#review-address").text(formDataObj["Address"]);
        //get post code and set that to #review-post-code
        $("#review-post-code").text(formDataObj["Post-Code"]);
        //get Preferred-Day-1, Preferred-Day-2, Preferred-Day-3 and set that to #review-date1, #review-date2, #review-date3
        $("#review-date1").text(formDataObj["Preferred-Day-1"]);
        $("#review-date2").text(formDataObj["Preferred-Day-2"]);
        $("#review-date3").text(formDataObj["Preferred-Day-3"]);

        var itemSummaryWrapper = $(".item-summary-wrapper-proxy").clone();
        $(".item-summary-wrapper-proxy").remove();

        // Assuming "Selected-Items" is a newline-separated string of order details,
        // you directly split it by "\n" without using .val()
        var orderDetails = formDataObj["Selected-Items"]
          .split("\n")
          .map(function (item) {
            return item.split(", ");
          });

        for (var i = 0; i < orderDetails.length; i++) {
          // Clone the itemSummaryWrapper for each order detail
          var clonedItemSummaryWrapper = itemSummaryWrapper.clone();
          // Iterate over the body2 elements and assign corresponding values from orderDetails
          clonedItemSummaryWrapper.find(".body2").each(function (index) {
            // Ensure that there's an item at the current index to avoid errors
            if (index < orderDetails[i].length) {
              $(this).text(orderDetails[i][index]);
            }
          });
          // Append the cloned itemSummaryWrapper to the DOM, specifically before #item-summary-wrapper-des if it needs to be in a specific location
          // Make sure you're appending it to the right parent element
          clonedItemSummaryWrapper.insertBefore("#item-summary-wrapper-des");
        }

        //get Total-Price-in-cents and convert it to dollars and set that to #review-subtotal
        var reviewSubtotal = formDataObj["Total-Price-in-cents"];
        $("#review-subtotal").text("$" + (reviewSubtotal / 100).toFixed(2));
        //get Shipping-Cost-in-cents and convert it to dollars and set that to #review-shipping
        var reviewShipping = formDataObj["Shipping-Cost-in-cents"];
        $("#review-shipping").text("$" + (reviewShipping / 100).toFixed(2));
        //get Total-Cost-in-cents and convert it to dollars and set that to #review-grand-total
        var reviewTotal = formDataObj["Total-Cost-in-cents"];
        $("#review-grand-total").text("$" + (reviewTotal / 100).toFixed(2));

        $("#item-summary-wrapper-des").hide();
        $("#tandc-text").hide();
        $("#payment-wrapper").show();

        $("#bac-submit").hide();
        $("#bac-pay").show();

        // Use these stripe variables as needed
        let stripeName =
          formDataObj["First-Name"] + " " + formDataObj["Surname"];
        let stripeEmail = formDataObj["Email-Address"];
        let stripePhone = formDataObj["Phone-Number"];
        let stripeMetadata = formDataObj["Collection-Instruction"];

        // filling up the #res-payment-receipt form
        $("#res-pay-first-name").val(formDataObj["First-Name"]);
        $("#res-pay-surname").val(formDataObj["Surname"]);
        $("#res-pay-email").val(formDataObj["Email-Address"]);
        $("#res-pay-phone").val(formDataObj["Phone-Number"]);
        $("#res-pay-address").val(formDataObj["Address"]) +
          ", " +
          formDataObj["Post-Code"];
        $("#res-pay-instruction").val(formDataObj["Collection-Instruction"]);
        $("#res-pay-dates").val(
          formDataObj["Preferred-Day-1"] +
            ", " +
            formDataObj["Preferred-Day-2"] +
            ", " +
            formDataObj["Preferred-Day-3"]
        );

        let totalItems = formDataObj["Selected-Items"]
          .split("\n")
          .reduce((acc, line) => {
            let parts = line.split(", ");
            let quantity = parseInt(parts[2]); // Assuming the quantity is always at this position
            return acc + quantity;
          }, 0);

        console.log("Total Items: ", totalItems);
        $("#res-pay-total-items").val(totalItems);

        $("#res-pay-items").val(formDataObj["Selected-Items"]);
        $("#res-pay-subtotal").val("$" + (reviewSubtotal / 100).toFixed(2));
        $("#res-pay-shipping").val("$" + (reviewShipping / 100).toFixed(2));
        $("#res-pay-grandtotal").val("$" + (reviewTotal / 100).toFixed(2));

        /*
         *
         *
         * STRIPE PAYMENT INTEGRATION
         *
         *
         */

        // var stripe = Stripe("pk_test_skEhxTitrwvq9DUcfeVFf68h00amxFRMoM"); // Testing publishable key
        var stripe = Stripe("pk_live_vmX8g8tMYxOg9nqmrSUuObnd00MZEw25GX"); // Live publishable key
        var elements = stripe.elements();
        var cardElement = elements.create("card");
        cardElement.mount("#card-element");

        // When #bac-pay is clicked
        $("#bac-pay").click(function () {
          // Indicate that payment is being processed
          $("#bac-pay").text("Processing Payment...");
          $("#bac-title").text("Processing Payment...");

          var stripeAmount = formDataObj["Total-Cost-in-cents"];
          stripeAmount = parseInt(stripeAmount);

          var stripeAddress =
            formDataObj["Address"] + ", " + formDataObj["Post-Code"];
          var stripeCollectionInstruction =
            formDataObj["Collection-Instruction"];
          var stripeSuccessUrl = window.location.href + "?respay=true";

          var metadata =
            "Collection Instruction -\n" + stripeCollectionInstruction;

          stripe.createToken(cardElement).then(function (result) {
            if (result.error) {
              // Display the error returned by Stripe's createToken method
              console.error(result.error.message);
              alert("Payment failed: " + result.error.message);
              // Reset the payment button text
              $("#bac-pay").text("Complete payment");
              $("#bac-title").text("Complete Your Payment");
              //set the bg color of #bac-pay to var(--swatches--sky)
              $("#bac-pay").css("background-color", "var(--swatches--sky)");
              //set the text color of .title7 inside of #bac-pay to var(--swatches--white)
              $("#bac-pay .title7").css("color", "var(--swatches--white)");
              //show #payment-status-wrapper
              $("#payment-status-wrapper").show();
              //set the text of #payment-status to "Payment failed: " + result.error.message
              $("#payment-status").text(
                "Payment failed: " + result.error.message
              );
            } else {
              console.log("Token:", result.token); // Log token details for debugging
              $.ajax({
                url:
                  "https://echo-stripe-logic.vercel.app/api/payment?amount=" +
                  stripeAmount,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                  token: result.token.id,
                  amount: stripeAmount,
                  fullname: stripeName,
                  email: stripeEmail,
                  phone: stripePhone,
                  address: stripeAddress,
                  metadata: metadata,
                  successUrl: stripeSuccessUrl,
                }),
                success: function (data) {
                  console.log(data); // Handle successful response
                  window.location.href = stripeSuccessUrl;
                },
                error: function (jqXHR) {
                  // Display error message returned from your server
                  var errorMessage =
                    jqXHR.responseJSON && jqXHR.responseJSON.error
                      ? jqXHR.responseJSON.error.message
                      : "An unexpected error occurred. Please try again.";
                  console.error("Payment failed: ", errorMessage);
                  alert("Payment failed: " + errorMessage);
                  // Reset the payment button text
                  $("#bac-pay").text("Complete payment");
                  $("#bac-title").text("Complete Your Payment");
                  //set the bg color of #bac-pay to var(--swatches--sky)
                  $("#bac-pay").css("background-color", "var(--swatches--sky)");
                  //set the text color of .title7 inside of #bac-pay to var(--swatches--white)
                  $("#bac-pay .title7").css("color", "var(--swatches--white)");
                  //show #payment-status-wrapper
                  $("#payment-status-wrapper").show();
                  //set the text of #payment-status to "Payment failed: " + errorMessage
                  $("#payment-status").text("Payment failed: " + errorMessage);
                },
              });
            }
          });
        });
      } else {
        console.log("Commercial on Booking review");

        // we need to check whether Data-Erasure-Needed is "Yes" or "No"
        if (formDataObj["Data-Erasure-Needed"] === "No") {
          console.log("Data Erasure is not needed");

          //set the text of #bac-para to a custom text
          $("#bac-para").text(
            "Please verify your contact and collection information below. After reviewing the details and costs, proceed with payment to finalize your booking."
          );

          let reviewContactDetails =
            formDataObj["Contact-First-Name"] +
            " " +
            formDataObj["Contact-Surname"] +
            "<br>" +
            formDataObj["Contact-Email-Address"] +
            "<br>" +
            formDataObj["Contact-Phone"];

          $("#review-contact-details").html(reviewContactDetails); // Use .html() for HTML content

          //get address and set that to #review-address
          $("#review-address").text(formDataObj["Address"]);
          //get post code and set that to #review-post-code
          $("#review-post-code").text(formDataObj["Post-Code"]);
          //get Preferred-Day-1, Preferred-Day-2, Preferred-Day-3 and set that to #review-date1, #review-date2, #review-date3
          $("#review-date1").text(formDataObj["Preferred-Day-1"]);
          $("#review-date2").text(formDataObj["Preferred-Day-2"]);
          $("#review-date3").text(formDataObj["Preferred-Day-3"]);

          var itemSummaryWrapper = $(".item-summary-wrapper-proxy").clone();
          $(".item-summary-wrapper-proxy").remove();

          // Assuming "Selected-Items" is a newline-separated string of order details,
          // you directly split it by "\n" without using .val()
          var orderDetails = formDataObj["Selected-Items"]
            .split("\n")
            .map(function (item) {
              return item.split(", ");
            });

          for (var i = 0; i < orderDetails.length; i++) {
            // Clone the itemSummaryWrapper for each order detail
            var clonedItemSummaryWrapper = itemSummaryWrapper.clone();
            // Iterate over the body2 elements and assign corresponding values from orderDetails
            clonedItemSummaryWrapper.find(".body2").each(function (index) {
              // Ensure that there's an item at the current index to avoid errors
              if (index < orderDetails[i].length) {
                $(this).text(orderDetails[i][index]);
              }
            });
            // Append the cloned itemSummaryWrapper to the DOM, specifically before #item-summary-wrapper-des if it needs to be in a specific location
            // Make sure you're appending it to the right parent element
            clonedItemSummaryWrapper.insertBefore("#item-summary-wrapper-des");
          }

          //get Total-Price-in-cents and convert it to dollars and set that to #review-subtotal
          var reviewSubtotal = formDataObj["Total-Price-in-cents"];
          $("#review-subtotal").text("$" + (reviewSubtotal / 100).toFixed(2));
          //get Shipping-Cost-in-cents and convert it to dollars and set that to #review-shipping
          var reviewShipping = formDataObj["Shipping-Cost-in-cents"];
          $("#review-shipping").text("$" + (reviewShipping / 100).toFixed(2));
          //get Total-Cost-in-cents and convert it to dollars and set that to #review-grand-total
          var reviewTotal = formDataObj["Total-Cost-in-cents"];
          $("#review-grand-total").text("$" + (reviewTotal / 100).toFixed(2));

          $("#item-summary-wrapper-des").hide();
          $("#tandc-text").hide();
          $("#payment-wrapper").show();

          $("#bac-submit").hide();
          $("#bac-pay").show();

          // Use these stripe variables as needed
          let stripeName =
            formDataObj["Billing-First-Name"] +
            " " +
            formDataObj["Billing-Surname"];
          let stripeEmail = formDataObj["Billing-Email-Address"];
          let stripePhone = formDataObj["Billing-Phone"];
          let stripeMetadata = formDataObj["Collection-Instruction"];

          // filling up the #res-payment-receipt form
          $("#com-pay-onsite-name").val(formDataObj["Full-Name-on-site"]);
          $("#com-pay-onsite-phone").val(formDataObj["Phone-Number-on-site"]);
          $("#com-pay-company-name").val(formDataObj["Company-Name"]);
          $("#com-pay-company-size").val(formDataObj["Company-Size"]);
          $("#com-pay-business-sector").val(formDataObj["Business-Sector"]);

          $("#com-pay-first-name").val(formDataObj["Contact-First-Name"]);
          $("#com-pay-surname").val(formDataObj["Contact-Surname"]);
          $("#com-pay-email").val(formDataObj["Contact-Email-Address"]);
          $("#com-pay-phone").val(formDataObj["Contact-Phone"]);

          $("#com-pay-first-name-billing").val(
            formDataObj["Billing-First-Name"]
          );
          $("#com-pay-surname-billing").val(formDataObj["Billing-Surname"]);
          $("#com-pay-email-billing").val(formDataObj["Billing-Email-Address"]);
          $("#com-pay-phone-billing").val(formDataObj["Billing-Phone"]);

          $("#com-pay-address").val(formDataObj["Address"]) +
            ", " +
            formDataObj["Post-Code"];
          $("#com-pay-instruction").val(formDataObj["Collection-Instruction"]);
          $("#com-pay-dates").val(
            formDataObj["Preferred-Day-1"] +
              ", " +
              formDataObj["Preferred-Day-2"] +
              ", " +
              formDataObj["Preferred-Day-3"]
          );

          let totalItems = formDataObj["Selected-Items"]
            .split("\n")
            .reduce((acc, line) => {
              let parts = line.split(", ");
              let quantity = parseInt(parts[2]); // Assuming the quantity is always at this position
              return acc + quantity;
            }, 0);

          console.log("Total Items: ", totalItems);
          $("#com-pay-total-items").val(totalItems);

          $("#com-pay-items").val(formDataObj["Selected-Items"]);
          $("#com-pay-subtotal").val("$" + (reviewSubtotal / 100).toFixed(2));
          $("#com-pay-shipping").val("$" + (reviewShipping / 100).toFixed(2));
          $("#com-pay-grandtotal").val("$" + (reviewTotal / 100).toFixed(2));

          /*
           *
           *
           * STRIPE PAYMENT INTEGRATION
           *
           *
           */

          // var stripe = Stripe("pk_test_skEhxTitrwvq9DUcfeVFf68h00amxFRMoM"); // Testing publishable key
          var stripe = Stripe("pk_live_vmX8g8tMYxOg9nqmrSUuObnd00MZEw25GX"); // Live publishable key
          var elements = stripe.elements();
          var cardElement = elements.create("card");
          cardElement.mount("#card-element");

          // When #bac-pay is clicked
          $("#bac-pay").click(function () {
            // Indicate that payment is being processed
            $("#bac-pay").text("Processing Payment...");
            $("#bac-title").text("Processing Payment...");

            var stripeAmount = formDataObj["Total-Cost-in-cents"];
            stripeAmount = parseInt(stripeAmount);

            var stripeAddress =
              formDataObj["Address"] + ", " + formDataObj["Post-Code"];
            var stripeCollectionInstruction =
              formDataObj["Collection-Instruction"];
            var stripeSuccessUrl = window.location.href + "?compay=true";

            var metadata =
              "Collection Instruction -\n" + stripeCollectionInstruction;

            stripe.createToken(cardElement).then(function (result) {
              if (result.error) {
                // Display the error returned by Stripe's createToken method
                console.error(result.error.message);
                alert("Payment failed: " + result.error.message);
                // Reset the payment button text
                $("#bac-pay").text("Complete payment");
                $("#bac-title").text("Complete Your Payment");
                //set the bg color of #bac-pay to var(--swatches--sky)
                $("#bac-pay").css("background-color", "var(--swatches--sky)");
                //set the text color of .title7 inside of #bac-pay to var(--swatches--white)
                $("#bac-pay .title7").css("color", "var(--swatches--white)");
                //show #payment-status-wrapper
                $("#payment-status-wrapper").show();
                //set the text of #payment-status to "Payment failed: " + result.error.message
                $("#payment-status").text(
                  "Payment failed: " + result.error.message
                );
              } else {
                console.log("Token:", result.token); // Log token details for debugging
                $.ajax({
                  url:
                    "https://echo-stripe-logic.vercel.app/api/payment?amount=" +
                    stripeAmount,
                  method: "POST",
                  contentType: "application/json",
                  data: JSON.stringify({
                    token: result.token.id,
                    amount: stripeAmount,
                    fullname: stripeName,
                    email: stripeEmail,
                    phone: stripePhone,
                    address: stripeAddress,
                    metadata: metadata,
                    successUrl: stripeSuccessUrl,
                  }),
                  success: function (data) {
                    console.log(data); // Handle successful response
                    window.location.href = stripeSuccessUrl;
                  },
                  error: function (jqXHR) {
                    // Display error message returned from your server
                    var errorMessage =
                      jqXHR.responseJSON && jqXHR.responseJSON.error
                        ? jqXHR.responseJSON.error.message
                        : "An unexpected error occurred. Please try again.";
                    console.error("Payment failed: ", errorMessage);
                    alert("Payment failed: " + errorMessage);
                    // Reset the payment button text
                    $("#bac-pay").text("Complete payment");
                    $("#bac-title").text("Complete Your Payment");
                    //set the bg color of #bac-pay to var(--swatches--sky)
                    $("#bac-pay").css(
                      "background-color",
                      "var(--swatches--sky)"
                    );
                    //set the text color of .title7 inside of #bac-pay to var(--swatches--white)
                    $("#bac-pay .title7").css(
                      "color",
                      "var(--swatches--white)"
                    );
                    //show #payment-status-wrapper
                    $("#payment-status-wrapper").show();
                    //set the text of #payment-status to "Payment failed: " + errorMessage
                    $("#payment-status").text(
                      "Payment failed: " + errorMessage
                    );
                  },
                });
              }
            });
          });
        } else {
          // we don't need to process any payment, but we need to submit the form data

          console.log("Data Erasure is needed");

          //set #bac-para to a custom text
          $("#bac-para").text(
            "You have selected our data erasure services. As the pricing for this service is POA, please confirm your booking and contact details below, and we’ll be in touch to discuss options and pricing for your booking."
          );

          let reviewContactDetails =
            formDataObj["Contact-First-Name"] +
            " " +
            formDataObj["Contact-Surname"] +
            "<br>" +
            formDataObj["Contact-Email-Address"] +
            "<br>" +
            formDataObj["Contact-Phone"];

          $("#review-contact-details").html(reviewContactDetails); // Use .html() for HTML content

          //get address and set that to #review-address
          $("#review-address").text(formDataObj["Address"]);
          //get post code and set that to #review-post-code
          $("#review-post-code").text(formDataObj["Post-Code"]);
          //get Preferred-Day-1, Preferred-Day-2, Preferred-Day-3 and set that to #review-date1, #review-date2, #review-date3
          $("#review-date1").text(formDataObj["Preferred-Day-1"]);
          $("#review-date2").text(formDataObj["Preferred-Day-2"]);
          $("#review-date3").text(formDataObj["Preferred-Day-3"]);

          var itemSummaryWrapper = $(".item-summary-wrapper-proxy").clone();
          $(".item-summary-wrapper-proxy").remove();

          // Assuming "Selected-Items" is a newline-separated string of order details,
          // you directly split it by "\n" without using .val()
          var orderDetails = formDataObj["Selected-Items"]
            .split("\n")
            .map(function (item) {
              return item.split(", ");
            });

          for (var i = 0; i < orderDetails.length; i++) {
            // Clone the itemSummaryWrapper for each order detail
            var clonedItemSummaryWrapper = itemSummaryWrapper.clone();
            // Iterate over the body2 elements and assign corresponding values from orderDetails
            clonedItemSummaryWrapper.find(".body2").each(function (index) {
              // Ensure that there's an item at the current index to avoid errors
              if (index < orderDetails[i].length) {
                $(this).text(orderDetails[i][index]);
              }
            });
            // Append the cloned itemSummaryWrapper to the DOM, specifically before #item-summary-wrapper-des if it needs to be in a specific location
            // Make sure you're appending it to the right parent element
            clonedItemSummaryWrapper.insertBefore("#item-summary-wrapper-des");
          }

          //get Total-Price-in-cents and convert it to dollars and set that to #review-subtotal
          var reviewSubtotal = formDataObj["Total-Price-in-cents"];
          $("#review-subtotal").text("$" + (reviewSubtotal / 100).toFixed(2));
          //get Shipping-Cost-in-cents and convert it to dollars and set that to #review-shipping
          var reviewShipping = formDataObj["Shipping-Cost-in-cents"];
          $("#review-shipping").text("$" + (reviewShipping / 100).toFixed(2));
          //get Total-Cost-in-cents and convert it to dollars and set that to #review-grand-total
          // var reviewTotal = formDataObj["Total-Cost-in-cents"];
          // $("#review-grand-total").text("$" + (reviewTotal / 100).toFixed(2));
          //set #review-grand-total to "TBC"
          $("#review-grand-total").text("TBC");

          $("#item-summary-wrapper-des").show();
          $("#tandc-text").show();
          $("#payment-wrapper").hide();

          $("#bac-submit").show();
          $("#bac-pay").hide();

          // filling up the #res-payment-receipt form
          $("#com-book-onsite-name").val(formDataObj["Full-Name-on-site"]);
          $("#com-book-onsite-phone").val(formDataObj["Phone-Number-on-site"]);
          $("#com-book-company-name").val(formDataObj["Company-Name"]);
          $("#com-book-company-size").val(formDataObj["Company-Size"]);
          $("#com-book-business-sector").val(formDataObj["Business-Sector"]);

          $("#com-book-first-name").val(formDataObj["Contact-First-Name"]);
          $("#com-book-surname").val(formDataObj["Contact-Surname"]);
          $("#com-book-email").val(formDataObj["Contact-Email-Address"]);
          $("#com-book-phone").val(formDataObj["Contact-Phone"]);

          $("#com-book-first-name-billing").val(
            formDataObj["Billing-First-Name"]
          );
          $("#com-book-surname-billing").val(formDataObj["Billing-Surname"]);
          $("#com-book-email-billing").val(
            formDataObj["Billing-Email-Address"]
          );
          $("#com-book-phone-billing").val(formDataObj["Billing-Phone"]);

          $("#com-book-address").val(formDataObj["Address"]) +
            ", " +
            formDataObj["Post-Code"];
          $("#com-book-instruction").val(formDataObj["Collection-Instruction"]);
          $("#com-book-dates").val(
            formDataObj["Preferred-Day-1"] +
              ", " +
              formDataObj["Preferred-Day-2"] +
              ", " +
              formDataObj["Preferred-Day-3"]
          );

          let totalItems = formDataObj["Selected-Items"]
            .split("\n")
            .reduce((acc, line) => {
              let parts = line.split(", ");
              let quantity = parseInt(parts[2]); // Assuming the quantity is always at this position
              return acc + quantity;
            }, 0);

          console.log("Total Items: ", totalItems);
          $("#com-book-total-items").val(totalItems);

          $("#com-book-items").val(formDataObj["Selected-Items"]);
          $("#com-book-subtotal").val("$" + (reviewSubtotal / 100).toFixed(2));
          $("#com-book-shipping").val("$" + (reviewShipping / 100).toFixed(2));
          $("#com-book-grandtotal").val("TBC");

          //if #bac-submit is clicked, submit the #com-booking-receipt form
          $("#bac-submit").click(function () {
            //set the text of #bac-submit to "Confirming Booking"
            $("#bac-submit").text("Confirming Booking...");
            //set the text of #bac-title to "Confirming Booking"
            $("#bac-title").text("Confirming Booking...");
            $("#com-booking-receipt").submit();
            //find the sessionStorage of formData and remove it
            sessionStorage.removeItem("formData");
          });
        }
      }
    }
  }

  //continuosly check every 500ms if the current url has ?respay=true, if so, submit the #res-payment-receipt form
  setInterval(function () {
    if (window.location.href.indexOf("?respay=true") > -1) {
      //set the text of #bac-title to "Processing Payment"
      $("#bac-title").text("Processing Payment...");
      $("#res-payment-receipt").submit();
      //remove it from the url instantly but don't reload the page
      history.pushState(
        null,
        null,
        window.location.href.replace("?respay=true", "")
      );
      //find the sessionStorage of formData and remove it
      sessionStorage.removeItem("formData");
    } else if (window.location.href.indexOf("?compay=true") > -1) {
    /*
     *
     *
     */
      //set the text of #bac-title to "Processing Payment"
      $("#bac-title").text("Processing Payment...");
      $("#com-payment-receipt").submit();
      //remove it from the url instantly but don't reload the page
      history.pushState(
        null,
        null,
        window.location.href.replace("?compay=true", "")
      );
      //find the sessionStorage of formData and remove it
      sessionStorage.removeItem("formData");
    }
    /*
     *
     *
     */
    // else if (window.location.href.indexOf("?combook=true") > -1) {
    //     //set the text of #bac-title to "Processing Payment"
    //     $("#bac-title").text("Confirming Booking...");
    //     $("#com-booking-receipt").submit();
    //     //remove it from the url instantly but don't reload the page
    //     history.pushState(null, null, window.location.href.replace("?combook=true", ""));
    //     //find the sessionStorage of formData and remove it
    //     sessionStorage.removeItem("formData");
    // }
  }, 500);
});
