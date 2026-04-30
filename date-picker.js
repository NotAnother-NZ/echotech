// Function to check if a given date is a weekend
function isWeekend(date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

// Function to disable today and every date before today
function disableToday(date) {
  var today = new Date();
  var isDisabled = date <= today;

  if (isDisabled) {
    console.log("Date:", date.toLocaleDateString(), "Reason: Today");
  }

  return isDisabled;
}

// Function to disable the next two working days from today
function disableNext2WorkingDays(date) {
  // Get today's date
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start counting from tomorrow if the date is today
  if (date.getTime() === today.getTime()) {
    today.setDate(today.getDate() + 1);
  }

  // Count the next two working days
  var workingDays = 0;
  var disabledDates = [];
  while (workingDays < 2) {
    today.setDate(today.getDate() + 1);
    // If the day is not a weekend, increment the workingDays counter
    if (!isWeekend(today)) {
      workingDays++;
      disabledDates.push(new Date(today)); // Push a new Date object to avoid reference issues
    }
  }

  // Log disabled dates and reasons
  disabledDates.forEach(function (disabledDate) {
    console.log(
      "Date:",
      disabledDate.toLocaleDateString(),
      "Reason: Next 2 working days"
    );
  });

  // Disable the date if it is one of the next two working days
  return disabledDates.some(function (disabledDate) {
    return date.getTime() === disabledDate.getTime();
  });
}

$(document).ready(function () {
  if ($("#bac-form-wrapper").length || $("#bac-form-wrapper-new").length) {
    var disabledCMSDates = [];
    $(".disabled-dates").each(function () {
      var disabledDate = new Date($(this).text());
      disabledCMSDates.push(disabledDate);
      console.log(
        "Date:",
        disabledDate.toLocaleDateString(),
        "Reason: Custom date disabled"
      );
    });

    var selectedDatesDay1 = [];
    var selectedDatesDay2 = [];
    var selectedDatesDay3 = [];

    var day1Picker = flatpickr("#day1", {
      enableTime: false,
      dateFormat: "d/m/Y",
      minDate: "today",
      disable: [isWeekend, disableToday, disableNext2WorkingDays],
      static: true,
    });

    var day2Picker = flatpickr("#day2", {
      enableTime: false,
      dateFormat: "d/m/Y",
      minDate: "today",
      disable: [isWeekend, disableToday, disableNext2WorkingDays],
      static: true,
    });

    var day3Picker = flatpickr("#day3", {
      enableTime: false,
      dateFormat: "d/m/Y",
      minDate: "today",
      disable: [isWeekend, disableToday, disableNext2WorkingDays],
      static: true,
    });

    $("#day1").prop("required", true);
    $("#day2").prop("required", true);
    $("#day3").prop("required", true);

    var disableDates = function () {
      var allSelectedDates = [].concat(
        selectedDatesDay1,
        selectedDatesDay2,
        selectedDatesDay3
      );

      var disableOptions = [isWeekend, disableToday, disableNext2WorkingDays];
      Array.prototype.push.apply(disableOptions, allSelectedDates);
      Array.prototype.push.apply(disableOptions, disabledCMSDates);

      day1Picker.set("disable", disableOptions);
      day2Picker.set("disable", disableOptions);
      day3Picker.set("disable", disableOptions);
    };

    disableDates();

    day1Picker.config.onChange.push(function (selectedDates) {
      selectedDatesDay1 = selectedDates;
      disableDates();
    });

    day2Picker.config.onChange.push(function (selectedDates) {
      selectedDatesDay2 = selectedDates;
      disableDates();
    });

    day3Picker.config.onChange.push(function (selectedDates) {
      selectedDatesDay3 = selectedDates;
      disableDates();
    });
  }
});
