import cloudinary from '../middlewares/cloudinaryConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Author } from '../model/authorModel.js';

// Get the directory name from the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to upload image to Cloudinary
const uploadImage = async (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(filePath, (error, result) => {
      if (error) return reject(error);
      resolve(result?.secure_url || null);
    });
  });
};

export const addAuthor = async (req, res) => {
  try {
    const { firstName, lastName, born, died, penName, occupation, notableWorks, awards } = req.body;

    // Handle image upload
    let image = null;
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      image = await uploadImage(filePath);

      // Delete the file after upload
      fs.unlinkSync(filePath);
    }

    const newAuthor = new Author({
      firstName,
      lastName,
      born,
      died,
      penName,
      occupation,
      notableWorks,
      awards,
      image,
    });

    await newAuthor.save();
    res.status(201).json({ msg: 'Author added successfully!' });
  } catch (error) {
    console.error('Error adding author:', error);
    res.status(500).json({ msg: 'Failed to add author. Please try again.' });
  }
};

export const findAuthors = async (req, res) => {
    try {
        // Fetch all users from the database
        const authers = await Author.find(); // You can add filters or projections if needed
    
        // Check if users were found
        if (!authers || authers.length === 0) {
          return res.status(404).json({ msg: 'No users found' });
        }
    
        // Send the list of users as a response
        res.status(200).json(authers);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ msg: 'Server error. Unable to fetch users.' });
      }
  }

  export const findSingleAuthor = async (req, res) => {
    const { id } = req.params; // Extract the user ID from request parameters
    try {
      // Find the user by ID in the database
      const author = await Author.findById(id);
  
      // Check if the user exists
      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }
  
      // Respond with the user data if found
      res.status(200).json(author);
    } catch (error) {
      // Handle errors, such as invalid ID format or database connection issues
      console.error('Error finding user:', error);
      res.status(500).json({ message: 'Error finding user', error: error.message });
    }
  };

  export const authorUpdateStatus = async (req,res) => {
    try {
        const authorId = req.params.id;
        const { firstName, lastName, born, died, penName, occupation, notableWorks, awards } = req.body;
    
        // Find the existing author to retrieve the current Cloudinary URL
        const existingAuthor = await Author.findById(authorId);
        if (!existingAuthor) {
          return res.status(404).json({ message: 'Author not found' });
        }
    
        let imageUrl = existingAuthor.image; // Keep existing image URL by default
    
        // If a new image is uploaded, upload it to Cloudinary
        if (req.file) {
          // Upload new image to Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'authors', // Optional: specify a folder in Cloudinary
          });
    
          // Update the imageUrl with the new Cloudinary URL
          imageUrl = result.secure_url;
    
          // Optionally, delete the old image from Cloudinary
          const publicId = existingAuthor.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`authors/${publicId}`);
        }
    
        // Ensure notableWorks is an array if provided, else keep existing values
        const notableWorksArray = notableWorks
          ? typeof notableWorks === 'string'
            ? notableWorks.split(',').map((work) => work.trim()) // Split by comma and trim spaces
            : Array.isArray(notableWorks)
            ? notableWorks // If already an array, keep as is
            : existingAuthor.notableWorks // Fallback to existing values
          : existingAuthor.notableWorks;
    
        // Parse awards if provided, else keep existing values
        const awardsArray = awards
          ? typeof awards === 'string'
            ? JSON.parse(awards) // Parse stringified JSON
            : Array.isArray(awards)
            ? awards // If already an array, keep as is
            : existingAuthor.awards // Fallback to existing values
          : existingAuthor.awards;
    
        // Update the author with the new data
        const updatedAuthor = await Author.findByIdAndUpdate(
          authorId,
          {
            firstName: firstName || existingAuthor.firstName,
            lastName: lastName || existingAuthor.lastName,
            born: born || existingAuthor.born,
            died: died || existingAuthor.died,
            penName: penName || existingAuthor.penName,
            occupation: occupation || existingAuthor.occupation,
            notableWorks: notableWorksArray, // Use the array of notable works
            awards: awardsArray, // Use the array of awards
            image: imageUrl, // Use the new or existing Cloudinary URL
          },
          { new: true, runValidators: true } // Ensures the schema validations run during the update
        );
    
        if (!updatedAuthor) {
          return res.status(404).json({ message: 'Failed to update author' });
        }
    
        res.status(200).json({
          message: 'Author updated successfully',
          author: updatedAuthor,
        });
      } catch (error) {
        // Detailed error logging to help identify where things might be going wrong
        console.error('Error updating author:', error.message);
        res.status(500).json({ message: 'Failed to update author', error: error.message });
      }
  }

  export const deleteAuthor = async (req,res) =>{
    const { id } = req.params; // Extract author ID from the request parameters

    try {
      // Find the author by ID and update the isDeleted flag or add a deletedAt timestamp
      const author = await Author.findByIdAndUpdate(
        id,
        {
          isDeleted: true, // You can use `deletedAt: new Date()` if you prefer a timestamp
          deletedAt: new Date(), // Optional: adding a timestamp for when the deletion occurred
        },
        { new: true } // Option to return the updated document
      );
  
      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }
  
      res.status(200).json({ message: 'Author deleted successfully', author });
    } catch (error) {
      console.error('Error deleting author:', error);
      res.status(500).json({ message: 'Failed to delete author', error: error.message });
    }
  }