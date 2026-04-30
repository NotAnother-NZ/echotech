Webflow.push(function () {
  $("#bac-main-review-form").submit(function () {
    return false;
  });
});

$(document).ready(function () {
  if ($("#bac-form-wrapper-review").length) {
    $("#payment-status-wrapper").hide();
    if (
      !sessionStorage.getItem("formData") ||
      sessionStorage.getItem("formData") === ""
    ) {
      window.location.href = "/book-a-collection";
    } else {
      var formData = JSON.parse(sessionStorage.getItem("formData"));
      let formDataObj = formData.reduce((acc, item) => {
        acc[item.name] = item.value;
        return acc;
      }, {});

      function setTotalEstimatedWeightField(
        formSelector,
        fieldId,
        weightValue
      ) {
        let $field = $("#" + fieldId);
        if (!$field.length) {
          $(formSelector).append(
            '<input type="hidden" id="' +
              fieldId +
              '" name="Total Estimated Weight">'
          );
          $field = $("#" + fieldId);
        }
        $field.val(weightValue);
      }

      if (formDataObj["Collection-Type"] === "Residential") {
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
        $("#review-contact-details").html(reviewContactDetails);
        $("#review-address").text(formDataObj["Address"]);
        $("#review-post-code").text(formDataObj["Post-Code"]);
        $("#review-date1").text(formDataObj["Preferred-Day-1"]);
        $("#review-date2").text(formDataObj["Preferred-Day-2"]);
        $("#review-date3").text(formDataObj["Preferred-Day-3"]);

        var itemSummaryWrapper = $(".item-summary-wrapper-proxy").clone();
        $(".item-summary-wrapper-proxy").remove();
        var orderDetails = formDataObj["Selected-Items"]
          .split("\n")
          .map(function (item) {
            return item.split(", ");
          });

        for (var i = 0; i < orderDetails.length; i++) {
          var clonedItemSummaryWrapper = itemSummaryWrapper.clone();
          clonedItemSummaryWrapper.find(".body2").each(function (index) {
            if (index < orderDetails[i].length) {
              $(this).text(orderDetails[i][index]);
            }
          });
          clonedItemSummaryWrapper.insertBefore("#item-summary-wrapper-des");
        }

        var reviewSubtotal = formDataObj["Total-Price-in-cents"];
        $("#review-subtotal").text("$" + (reviewSubtotal / 100).toFixed(2));
        var reviewShipping = formDataObj["Shipping-Cost-in-cents"];
        $("#review-shipping").text("$" + (reviewShipping / 100).toFixed(2));
        var reviewTotal = formDataObj["Total-Cost-in-cents"];
        $("#review-grand-total").text("$" + (reviewTotal / 100).toFixed(2));

        $("#item-summary-wrapper-des").hide();
        $("#payment-wrapper").show();
        $("#bac-submit").hide();
        $("#bac-pay").show();

        let stripeName =
          formDataObj["First-Name"] + " " + formDataObj["Surname"];
        let stripeEmail = formDataObj["Email-Address"];
        let stripePhone = formDataObj["Phone-Number"];
        let stripeMetadata = formDataObj["Collection-Instruction"];

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
            let quantity = parseInt(parts[2]);
            return acc + quantity;
          }, 0);

        let totalEstimatedWeight =
          formDataObj["Total-Estimated-Weight"] ||
          formDataObj["Total-Weight"] ||
          formDataObj["total-weight"] ||
          "Not provided";

        setTotalEstimatedWeightField(
          "#res-payment-receipt",
          "res-pay-total-estimated-weight",
          totalEstimatedWeight
        );

        $("#res-pay-total-items").val(totalItems);
        $("#res-pay-items").val(formDataObj["Selected-Items"]);
        $("#res-pay-subtotal").val("$" + (reviewSubtotal / 100).toFixed(2));
        $("#res-pay-shipping").val("$" + (reviewShipping / 100).toFixed(2));
        $("#res-pay-grandtotal").val("$" + (reviewTotal / 100).toFixed(2));

        var stripe = Stripe("pk_live_vmX8g8tMYxOg9nqmrSUuObnd00MZEw25GX");
        var elements = stripe.elements();
        var cardElement = elements.create("card");
        cardElement.mount("#card-element");

        $("#bac-pay").click(function () {
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
              console.error(result.error.message);
              alert("Payment failed: " + result.error.message);
              $("#bac-pay").text("Complete payment");
              $("#bac-title").text("Complete Your Payment");
              $("#bac-pay").css("background-color", "var(--swatches--sky)");
              $("#bac-pay .title7").css("color", "var(--swatches--white)");
              $("#payment-status-wrapper").show();
              $("#payment-status").text(
                "Payment failed: " + result.error.message
              );
            } else {
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
                  window.location.href = stripeSuccessUrl;
                },
                error: function (jqXHR) {
                  var errorMessage =
                    jqXHR.responseJSON && jqXHR.responseJSON.error
                      ? jqXHR.responseJSON.error.message
                      : "An unexpected error occurred. Please try again.";
                  console.error("Payment failed: ", errorMessage);
                  alert("Payment failed: " + errorMessage);
                  $("#bac-pay").text("Complete payment");
                  $("#bac-title").text("Complete Your Payment");
                  $("#bac-pay").css("background-color", "var(--swatches--sky)");
                  $("#bac-pay .title7").css("color", "var(--swatches--white)");
                  $("#payment-status-wrapper").show();
                  $("#payment-status").text("Payment failed: " + errorMessage);
                },
              });
            }
          });
        });
      } else {
        if (formDataObj["Data-Erasure-Needed"] === "No") {
          $("#bac-para").text(
            "Please confirm your booking and contact details below, and weÃ¢â‚¬â„¢ll be in touch to discuss options and pricing for your booking."
          );

          let reviewContactDetails =
            formDataObj["Contact-First-Name"] +
            " " +
            formDataObj["Contact-Surname"] +
            "<br>" +
            formDataObj["Contact-Email-Address"] +
            "<br>" +
            formDataObj["Contact-Phone"];
          $("#review-contact-details").html(reviewContactDetails);
          $("#review-address").text(formDataObj["Address"]);
          $("#review-post-code").text(formDataObj["Post-Code"]);
          $("#review-date1").text(formDataObj["Preferred-Day-1"]);
          $("#review-date2").text(formDataObj["Preferred-Day-2"]);
          $("#review-date3").text(formDataObj["Preferred-Day-3"]);

          var itemSummaryWrapper = $(".item-summary-wrapper-proxy").clone();
          $(".item-summary-wrapper-proxy").remove();
          var orderDetails = formDataObj["Selected-Items"]
            .split("\n")
            .map(function (item) {
              return item.split(", ");
            });

          for (var i = 0; i < orderDetails.length; i++) {
            var clonedItemSummaryWrapper = itemSummaryWrapper.clone();
            clonedItemSummaryWrapper.find(".body2").each(function (index) {
              if (index < orderDetails[i].length) {
                $(this).text(
                  index === 1 || index === 3 ? "TBC" : orderDetails[i][index]
                );
              }
            });
            clonedItemSummaryWrapper.insertBefore("#item-summary-wrapper-des");
          }

          $("#review-subtotal").text("TBC");
          $("#review-shipping").text("TBC");
          $("#review-grand-total").text("TBC");

          $("#item-summary-wrapper-des").hide();
          $("#payment-wrapper").hide();
          $("#bac-submit").show();
          $("#bac-pay").hide();

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
              let quantity = parseInt(parts[2]);
              return acc + quantity;
            }, 0);

          let totalEstimatedWeight =
            formDataObj["Total-Estimated-Weight"] ||
            formDataObj["Total-Weight"] ||
            formDataObj["total-weight"] ||
            "Not provided";

          setTotalEstimatedWeightField(
            "#com-payment-receipt",
            "com-pay-total-estimated-weight",
            totalEstimatedWeight
          );

          $("#com-pay-total-items").val(totalItems);

          // Updated items to exclude prices
          let formattedItems = formDataObj["Selected-Items"]
            .split("\n")
            .map((item) => {
              let parts = item.split(", ");
              return parts[0] + ", " + parts[2];
            })
            .join("\n");

          $("#com-pay-items").val(formattedItems);

          $("#com-pay-subtotal").val("TBC");
          $("#com-pay-shipping").val("TBC");
          $("#com-pay-grandtotal").val("TBC");

          $("#bac-submit").click(function () {
            $("#bac-submit").text("Confirming Booking...");
            $("#bac-title").text("Confirming Booking...");
            $("#com-payment-receipt").submit();
            sessionStorage.removeItem("formData");
          });
        } else {
          $("#bac-para").text(
            "You have selected our data erasure services. As the pricing for this service is POA, please confirm your booking and contact details below, and weÃ¢â‚¬â„¢ll be in touch to discuss options and pricing for your booking."
          );

          let reviewContactDetails =
            formDataObj["Contact-First-Name"] +
            " " +
            formDataObj["Contact-Surname"] +
            "<br>" +
            formDataObj["Contact-Email-Address"] +
            "<br>" +
            formDataObj["Contact-Phone"];
          $("#review-contact-details").html(reviewContactDetails);
          $("#review-address").text(formDataObj["Address"]);
          $("#review-post-code").text(formDataObj["Post-Code"]);
          $("#review-date1").text(formDataObj["Preferred-Day-1"]);
          $("#review-date2").text(formDataObj["Preferred-Day-2"]);
          $("#review-date3").text(formDataObj["Preferred-Day-3"]);

          var itemSummaryWrapper = $(".item-summary-wrapper-proxy").clone();
          $(".item-summary-wrapper-proxy").remove();
          var orderDetails = formDataObj["Selected-Items"]
            .split("\n")
            .map(function (item) {
              return item.split(", ");
            });

          for (var i = 0; i < orderDetails.length; i++) {
            var clonedItemSummaryWrapper = itemSummaryWrapper.clone();
            clonedItemSummaryWrapper.find(".body2").each(function (index) {
              if (index < orderDetails[i].length) {
                if (
                  formDataObj["Collection-Type"] === "Commercial" &&
                  (index === 1 || index === 3)
                ) {
                  $(this).text("TBC");
                } else {
                  $(this).text(orderDetails[i][index]);
                }
              }
            });
            clonedItemSummaryWrapper.insertBefore("#item-summary-wrapper-des");
          }

          $("#review-subtotal").text("TBC");
          $("#review-shipping").text("TBC");
          $("#review-grand-total").text("TBC");

          $("#item-summary-wrapper-des").show();
          $("#payment-wrapper").hide();
          $("#bac-submit").show();
          $("#bac-pay").hide();

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
              let quantity = parseInt(parts[2]);
              return acc + quantity;
            }, 0);

          let totalEstimatedWeight =
            formDataObj["Total-Estimated-Weight"] ||
            formDataObj["Total-Weight"] ||
            formDataObj["total-weight"] ||
            "Not provided";

          setTotalEstimatedWeightField(
            "#com-booking-receipt",
            "com-book-total-estimated-weight",
            totalEstimatedWeight
          );

          $("#com-book-total-items").val(totalItems);

          // Updated items to exclude prices
          let formattedItems = formDataObj["Selected-Items"]
            .split("\n")
            .map((item) => {
              let parts = item.split(", ");
              return parts[0] + ", " + parts[2];
            })
            .join("\n");

          $("#com-book-items").val(formattedItems);

          $("#com-book-subtotal").val("TBC");
          $("#com-book-shipping").val("TBC");
          $("#com-book-grandtotal").val("TBC");

          $("#bac-submit").click(function () {
            $("#bac-submit").text("Confirming Booking...");
            $("#bac-title").text("Confirming Booking...");
            $("#com-booking-receipt").submit();
            sessionStorage.removeItem("formData");
          });
        }
      }
    }

    setInterval(function () {
      if (window.location.href.indexOf("?respay=true") > -1) {
        $("#bac-title").text("Processing Payment...");
        $("#res-payment-receipt").submit();
        history.pushState(
          null,
          null,
          window.location.href.replace("?respay=true", "")
        );
        sessionStorage.removeItem("formData");
      } else if (window.location.href.indexOf("?compay=true") > -1) {
        $("#bac-title").text("Processing Payment...");
        $("#com-payment-receipt").submit();
        history.pushState(
          null,
          null,
          window.location.href.replace("?compay=true", "")
        );
        sessionStorage.removeItem("formData");
      }
    }, 500);
  }
});
