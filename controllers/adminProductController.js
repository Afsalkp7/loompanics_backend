import mongoose from 'mongoose';
import { Books } from '../model/booksModel.js';
import { Publisher } from '../model/publisherModel.js';
import { Category } from '../model/categoryModel.js';
import { Author } from '../model/authorModel.js';
import cloudinary from '../middlewares/cloudinaryConfig.js';

// Helper function to upload an image to Cloudinary
const uploadImage = async (file) => {
  if (!file) return '';
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    ).end(file.buffer);
  });
};

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const { files } = req;

    const primaryImage = files['primaryImage'] ? files['primaryImage'][0] : null;
    const secondaryImage = files['secondaryImage'] ? files['secondaryImage'][0] : null;
    const thirdImage = files['thirdImage'] ? files['thirdImage'][0] : null;

    const primaryImageUrl = await uploadImage(primaryImage);
    const secondaryImageUrl = await uploadImage(secondaryImage);
    const thirdImageUrl = await uploadImage(thirdImage);

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
      pagesNumber,
      copyType,
      language,
    } = req.body;

    // Create a new book entry
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
      language,
    });

    // Save the book to the database
    await newBook.save();

    // Update Publisher, Category, and Author with the new book ID
    await Publisher.findByIdAndUpdate(publisherId, { $push: { books: newBook._id } });
    await Category.findByIdAndUpdate(categoryId, { $push: { books: newBook._id } });
    await Author.findByIdAndUpdate(authorId, { $push: { books: newBook._id } });

    res.status(201).json({ message: 'Product added successfully', product: newBook });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Fetch all products
export const findProducts = async (req, res) => {
  try {
    const products = await Books.find(); // You can add filters or projections if needed

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error. Unable to fetch products.' });
  }
};

// Fetch a single product by ID
export const findSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Books.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error finding product:', error);
    res.status(500).json({ message: 'Error finding product', error: error.message });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { files } = req;

  try {
    // Fetch current product to update
    const product = await Books.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle file uploads and update images if new files are provided
    const primaryImage = files['primaryImage'] ? files['primaryImage'][0] : null;
    const secondaryImage = files['secondaryImage'] ? files['secondaryImage'][0] : null;
    const thirdImage = files['thirdImage'] ? files['thirdImage'][0] : null;

    if (primaryImage) product.primaryImageUrl = await uploadImage(primaryImage);
    if (secondaryImage) product.secondaryImageUrl = await uploadImage(secondaryImage);
    if (thirdImage) product.thirdImageUrl = await uploadImage(thirdImage);

    // Update other fields
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
      pagesNumber,
      copyType,
      language,
    } = req.body;

    product.title = title || product.title;
    product.description = description || product.description;
    product.authorId = authorId || product.authorId;
    product.categoryId = categoryId || product.categoryId;
    product.publisherId = publisherId || product.publisherId;
    product.publicationDate = publicationDate || product.publicationDate;
    product.edition = edition || product.edition;
    product.genres = genres || product.genres;
    product.otherDetails = otherDetails || product.otherDetails;
    product.originalPrice = originalPrice || product.originalPrice;
    product.discount = discount || product.discount;
    product.awards = awards ? JSON.parse(awards) : product.awards;
    product.pages = pagesNumber || product.pages;
    product.copyType = copyType || product.copyType;
    product.language = language || product.language;

    // Save the updated product
    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};
