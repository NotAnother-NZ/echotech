$(document).ready(function () {
  // Check if any element with the attribute data-attachment-link is available
  if ($("[data-attachment-link='true']").length) {
    // Go through all the elements with the attribute data-attachment-link
    $("[data-attachment-link='true']").each(function () {
      // Get the link href
      var link = $(this).attr("href");
      var $attachmentType = $(this).find("[data-attachment-type='true']");
      var $attachmentSize = $(this).find("[data-attachment-size='true']");

      var shouldFetchSize =
        $attachmentSize.text().trim().toLowerCase() === "auto";
      var shouldFetchType =
        $attachmentType.text().trim().toLowerCase() === "auto";

      if (shouldFetchSize || shouldFetchType) {
        // Fetch the file metadata
        fetch(link)
          .then((response) => {
            if (response.ok) {
              // Get the response as a Blob
              return response.blob().then((blob) => {
                if (shouldFetchSize) {
                  // Get the file size from the Blob size
                  var fileSize = blob.size;

                  // Convert the file size to a readable format (KB, MB, etc.)
                  var fileSizeText =
                    fileSize < 1024 * 1024
                      ? (fileSize / 1024).toFixed(2) + " KB"
                      : (fileSize / (1024 * 1024)).toFixed(2) + " MB";

                  // Update the attachment size in the HTML
                  $attachmentSize.text(fileSizeText);

                  // Print the file size to the console
                  console.log("File size:", fileSizeText);
                }

                if (shouldFetchType) {
                  // Determine the file type from the Blob MIME type
                  var fileType = blob.type.split("/").pop().toUpperCase();

                  // Update the attachment type in the HTML
                  $attachmentType.text(fileType);

                  // Print the file type to the console
                  console.log("File type:", fileType);
                }
              });
            } else {
              console.error("Failed to fetch file metadata for URL:", link);
              if (shouldFetchSize) $attachmentSize.text("Failed to fetch size");
              if (shouldFetchType) $attachmentType.text("Unknown type");
            }
          })
          .catch((error) => {
            console.error("Error fetching file metadata for URL:", link, error);
            if (shouldFetchSize) $attachmentSize.text("Error fetching size");
            if (shouldFetchType) $attachmentType.text("Unknown type");
          });
      }
    });
  }
});
