import cloudinary from '../middlewares/cloudinaryConfig.js';
import Author from '../model/authorModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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