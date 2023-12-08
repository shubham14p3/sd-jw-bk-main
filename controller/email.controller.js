// emailController.js
const { fetchLatestEmail } = require("../config/emailReceiver");

async function getEmailDetails(req, res, next) {
  try {
    // Call the function to fetch email details
    const emailDetailsArray = await fetchLatestEmail();

    // Initialize an array to store formatted email details
    const formattedEmailDetails = [];

    // Process each email in the array
    emailDetailsArray.forEach((emailDetails, index) => {
      const { header, body, attributes } = emailDetails;

      // Extract specific fields directly from the header
      const { from, to, subject, date } = header;

      // Structure the response for each email
      const formattedResponse = {
        success: true,
        data: {
          emailDetails: {
            from,
            to,
            subject,
            date,
            body,
          },
        },
      };

      // Add the formatted response to the array
      formattedEmailDetails.push(formattedResponse);
    });

    // Return the formatted response array
    res.status(200).json(formattedEmailDetails);
  } catch (error) {
    // Handle any errors
    console.error("Error fetching email details:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = { getEmailDetails };
