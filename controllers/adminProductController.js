import mongoose from 'mongoose';
import { Books } from '../model/booksModel.js';
import { Publisher } from '../model/publisherModel.js'; // Adjust the path to your Publisher model
import { Category } from '../model/categoryModel.js'; // Adjust the path to your Category model
import { Author } from '../model/authorModel.js'; // Adjust the path to your Author model
import cloudinary from '../middlewares/cloudinaryConfig.js';

export const addProduct = async (req, res) => {
    try {
        // Extract image files from the request
        const { files } = req;

        // Function to upload a file to Cloudinary
        const uploadImage = async (file) => {
            if (!file) return '';
            const result = await cloudinary.v2.uploader.upload(file.path);
            return result.secure_url;
        };

        // Upload images to Cloudinary
        const primaryImageUrl = await uploadImage(files['primaryImage'] ? files['primaryImage'][0] : null);
        const secondaryImageUrl = await uploadImage(files['secondaryImage'] ? files['secondaryImage'][0] : null);
        const thirdImageUrl = await uploadImage(files['thirdImage'] ? files['thirdImage'][0] : null);

        // Destructure all required fields from the request body
        const { 
          title, 
          description, 
          authorId, 
          categoryId, 
          publisherId, 
          publicationDate, 
          edition, 
          genres, 
          otherDetails, 
          originalPrice, 
          discount, 
          awards,
          pagesNumber,            // Newly added field
          copyType,         // Newly added field
          language          // Newly added field
        } = req.body;

        // Create a new book entry with the new fields
        const newBook = new Books({
          title,
          primaryImageUrl,
          secondaryImageUrl,
          thirdImageUrl,
          authorId,
          description,
          categoryId,
          publisherId,
          publicationDate,
          edition,
          genres,
          otherDetails,
          originalPrice,
          discount,
          awards: JSON.parse(awards),
          pages: pagesNumber,            
          copyType,         
          language          
        });

        // Save the book to the database
        await newBook.save();

        // Update Publisher, Category, and Author with the new book ID
        await Publisher.findByIdAndUpdate(publisherId, {
          $push: { books: newBook._id }
        });

        await Category.findByIdAndUpdate(categoryId, {
          $push: { books: newBook._id }
        });

        await Author.findByIdAndUpdate(authorId, {
          $push: { books: newBook._id }
        });

        res.status(201).json({ message: 'Product added successfully', product: newBook });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const findProducts = async (req, res) => {
    try {
        // Fetch all users from the database
        const products = await Books.find(); // You can add filters or projections if needed
    
        // Check if users were found
        if (!products || products.length === 0) {
          return res.status(404).json({ msg: 'No users found' });
        }
    
        // Send the list of users as a response
        res.status(200).json(products);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ msg: 'Server error. Unable to fetch users.' });
      }
  }