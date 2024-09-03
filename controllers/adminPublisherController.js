import { Publisher } from '../model/publisherModel.js';
import cloudinary from '../middlewares/cloudinaryConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Controller to add a publisher
export const addPublisher = async (req, res) => {
  try {
    const { publisherName, publisherAddress, publisherUrl } = req.body;

    let image = null;
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      image = await uploadImage(filePath);

      // Delete the file after upload
      fs.unlinkSync(filePath);
    }

    // Validation
    if (!publisherName || !publisherAddress || !publisherUrl) {
      return res.status(400).json({ message: 'Publisher name, address, and URL are required' });
    }

    // Create a new publisher
    const newPublisher = new Publisher({
      publisherName,
      publisherAddress,
      publisherUrl,
      publisherLogo: image,
    });

    // Save the publisher to the database
    await newPublisher.save();

    // Respond with the created publisher
    res.status(201).json({ message: 'Publisher added successfully', publisher: newPublisher });
  } catch (error) {
    console.error('Error adding publisher:', error);
    res.status(500).json({ message: 'Failed to add publisher', error: error.message });
  }
};

// Other CRUD operations for publishers
export const findPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find({ isDeleted: false });
    res.status(200).json(publishers);
  } catch (error) {
    console.error('Error fetching publishers:', error);
    res.status(500).json({ error: 'Failed to fetch publishers' });
  }
};

export const findSinglePublishers = async (req, res) => {
  const { id } = req.params;
  try {
    const publisher = await Publisher.findById(id);
    if (!publisher) {
      return res.status(404).json({ message: 'Publisher not found' });
    }
    res.status(200).json(publisher);
  } catch (error) {
    console.error('Error fetching publisher:', error);
    res.status(500).json({ error: 'Failed to fetch the publisher' });
  }
};

export const updateSinglePublishers = async (req, res) => {
  const { id } = req.params;
  const { publisherName, publisherAddress, publisherUrl } = req.body;
  try {
    let image = null;
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      image = await uploadImage(filePath);
      fs.unlinkSync(filePath);
    }

    const updateData = {
      publisherName,
      publisherAddress,
      publisherUrl,
      ...(image && { publisherLogo: image }), // Only update logo if a new image was uploaded
    };

    const updatedPublisher = await Publisher.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPublisher) {
      return res.status(404).json({ message: 'Publisher not found' });
    }

    res.status(200).json(updatedPublisher);
  } catch (error) {
    console.error('Error updating publisher:', error);
    res.status(500).json({ message: 'Failed to update publisher', error: error.message });
  }
};

export const deletePublisher = async (req, res) => {
  const { id } = req.params;
  try {
    const publisher = await Publisher.findById(id);
    if (!publisher || publisher.isDeleted) {
      return res.status(404).json({ message: 'Publisher not found or already deleted' });
    }

    publisher.isDeleted = true;
    publisher.deletedAt = new Date();

    await publisher.save();

    res.status(200).json({ message: 'Publisher deleted successfully (soft delete)' });
  } catch (error) {
    console.error('Error deleting publisher:', error);
    res.status(500).json({ message: 'An error occurred while deleting the publisher' });
  }
};
