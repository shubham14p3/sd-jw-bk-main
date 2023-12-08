// // emailController.js
// const { fetchLatestEmail } = require('../config/emailReceiver'); // Import your email fetch function

// async function getEmailDetails(req, res, next) {
//   try {
//     // Call the function to fetch email details
//     const emailDetails = await fetchLatestEmail();

//     // Return the email details in the response
//     res.status(200).json({
//       success: true,
//       data: emailDetails,
//     });
//   } catch (error) {
//     // Handle any errors
//     console.error('Error fetching email details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//       error: error.message,
//     });
//   }
// }

// module.exports = { getEmailDetails };

// emailController.js
const { fetchLatestEmail } = require("../config/emailReceiver");

async function getEmailDetails(req, res, next) {
  try {
    // Call the function to fetch email details
    const emailDetails = await fetchLatestEmail();
    // Extract relevant information from the email details
    const { header, body, attributes } = emailDetails;

    // Extract specific fields directly from the header
    const { from, to, subject, date } = header;

    // Structure the response in the desired format
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

    // Return the formatted response
    res.status(200).json(formattedResponse);
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
