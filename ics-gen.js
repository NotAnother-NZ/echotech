$(document).ready(function () {
  if ($("[data-ics-link-gen=true]").length > 0) {
    $("[data-ics-link-gen=true]").on("click", function (event) {
      event.preventDefault();

      let hiddenContent = $(this)
        .closest(".calendar-card")
        .find(".calendar-content.hide")
        .text();

      let parts = hiddenContent.split(";");

      let title = "Echo Community E-waste Collection Day";
      let address = parts[1].trim();
      let date = new Date(parts[2].trim());
      // Add a day to the date
      date.setDate(date.getDate() + 1);
      let isoDate = date.toISOString();
      let dateFormatted = isoDate.slice(0, 10).replace(/-/g, "");
      let timings = parts[4].trim();
      let mapLink = parts[3].trim();

      // Split timings into start and end times
      let [startTime, endTime] = timings.split(" — ").map((time) => {
        // Convert time to 24-hour format
        let [hour, minutePart] = time.split(":");
        let minute = minutePart.slice(0, 2);
        let period = minutePart.slice(2);

        hour = +hour;
        if (period === "PM" && hour < 12) hour += 12;
        if (period === "AM" && hour === 12) hour -= 12;

        // Return time in HHmmss format
        return `${hour.toString().padStart(2, "0")}${minute}00`;
      });

      // Append times to date
      let startDate = dateFormatted + "T" + startTime;
      let endDate = dateFormatted + "T" + endTime;

      let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Echo//E-days//EN//druh.in
BEGIN:VEVENT
UID:${generateUID()}@echotech.co.nz
DTSTAMP:${
        new Date()
          .toISOString()
          .replace(/-/g, "")
          .replace(/:/g, "")
          .split(".")[0]
      }Z
DTSTART;TZID=Pacific/Auckland:${startDate}
DTEND;TZID=Pacific/Auckland:${endDate}
SUMMARY:${title}
DESCRIPTION:Address: ${address}\\nTimings: ${timings}
LOCATION:${address}
URL:${mapLink}
ORGANIZER;CN=Echo:mailto:info@echotech.co.nz
END:VEVENT
END:VCALENDAR`;

      let downloadLink = document.createElement("a");
      downloadLink.href =
        "data:text/calendar;charset=utf-8," + encodeURIComponent(icsContent);
      downloadLink.download = "Echo Community E-waste Collection Day.ics";
      downloadLink.click();
    });
  }
});

function generateUID() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}
