import { Poster } from '../model/posterModel.js';
import cloudinary from '../middlewares/cloudinaryConfig.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to upload image to Cloudinary
const uploadImage = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || null);
      }
    ).end(fileBuffer); // End the stream with the file buffer
  });
};


export const addPoster = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Poster image is required" });
      }
  
      const imageUrl = await uploadImage(req.file.buffer);
  
      // Create a new poster document
      const newPoster = new Poster({
        title: req.body.title,
        image: imageUrl,
        startDate: req.body.startDate,
        endDate: req.body.endDate
      });
  
      // Save the poster to the database
      const savedPoster = await newPoster.save();
  
      // Respond with success
      return res.status(200).json({ 
        message: "Poster added successfully", 
        poster: savedPoster 
      });
    } catch (error) {
      console.error("Error adding poster:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const findPosters = async (req, res) => {
    try {
      // Find all posters that are not marked as deleted
      const posters = await Poster.find({ isDeleted: false }).sort({ createdAt: -1 });
  
      // Check if any posters are found
      if (posters.length === 0) {
        return res.status(404).json({ message: "No posters found" });
      }
  
      // Respond with the list of posters
      return res.status(200).json({ posters });
    } catch (error) {
      console.error("Error fetching posters:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  