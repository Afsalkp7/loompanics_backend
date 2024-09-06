import { Contact } from "../model/contactusModel";
import { handleMessageFromCustomer } from "../utils/mailOptions";

export const addMessage = async (req, res) => {
  try {
    // Extracting data from the request body
    const { name, email, subject, review } = req.body;
    const userId = req.user; // Assuming the user ID is extracted from authenticated middleware

    // Basic validation of input data (could also use more advanced validation like Joi or Yup)
    if (!name || !email || !subject || !review) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Sending email
    try {
      await handleMessageFromCustomer(email, subject, review);
    } catch (error) {
      console.error("Error sending email:", error.message);
      return res.status(500).json({ error: "Failed to send email. Please try again later." });
    }

    // Creating and saving the message in the database
    const contact = new Contact({
      userName: name,
      email,
      subject,
      message: review,
      userId: userId,
    });

    try {
      await contact.save();
      res.status(201).json({ message: "Message sent successfully!", contact });
    } catch (error) {
      console.error("Error saving contact:", error.message);
      res.status(500).json({ error: "Failed to save message. Please try again later." });
    }
  } catch (error) {
    console.error("Unexpected server error:", error.message);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
};
