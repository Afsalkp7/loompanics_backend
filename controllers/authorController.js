import cloudinary from '../middlewares/cloudinaryConfig.js';
import { Author } from '../model/authorModel.js';

// Function to upload image to Cloudinary
const uploadImage = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || null);
      }
    ).end(fileBuffer);
  });
};

export const addAuthor = async (req, res) => {
  try {
    const { firstName, lastName, born, died, penName, occupation, notableWorks, awards } = req.body;

    // Handle image upload
    let image = null;
    if (req.file) {
      image = await uploadImage(req.file.buffer); // Use buffer instead of file path
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
    const authors = await Author.find(); // Fetch all authors from the database

    if (!authors || authors.length === 0) {
      return res.status(404).json({ msg: 'No authors found' });
    }

    res.status(200).json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ msg: 'Server error. Unable to fetch authors.' });
  }
};

export const findSingleAuthor = async (req, res) => {
  const { id } = req.params; // Extract the author ID from request parameters
  try {
    const author = await Author.findById(id).populate("books");

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (error) {
    console.error('Error finding author:', error);
    res.status(500).json({ message: 'Error finding author', error: error.message });
  }
};

export const authorUpdateStatus = async (req, res) => {
  try {
    const authorId = req.params.id;
    const { firstName, lastName, born, died, penName, occupation, notableWorks, awards } = req.body;

    const existingAuthor = await Author.findById(authorId);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    let imageUrl = existingAuthor.image;

    if (req.file) {
      const result = await uploadImage(req.file.buffer); // Use buffer instead of file path
      imageUrl = result;
      
      // Optionally, delete the old image from Cloudinary
      const publicId = existingAuthor.image.split('/').pop().split('.')[0];
      await cloudinary.v2.uploader.destroy(`authors/${publicId}`);
    }

    const notableWorksArray = notableWorks
      ? typeof notableWorks === 'string'
        ? notableWorks.split(',').map((work) => work.trim())
        : Array.isArray(notableWorks)
        ? notableWorks
        : existingAuthor.notableWorks
      : existingAuthor.notableWorks;

    const awardsArray = awards
      ? typeof awards === 'string'
        ? JSON.parse(awards)
        : Array.isArray(awards)
        ? awards
        : existingAuthor.awards
      : existingAuthor.awards;

    const updatedAuthor = await Author.findByIdAndUpdate(
      authorId,
      {
        firstName: firstName || existingAuthor.firstName,
        lastName: lastName || existingAuthor.lastName,
        born: born || existingAuthor.born,
        died: died || existingAuthor.died,
        penName: penName || existingAuthor.penName,
        occupation: occupation || existingAuthor.occupation,
        notableWorks: notableWorksArray,
        awards: awardsArray,
        image: imageUrl,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Failed to update author' });
    }

    res.status(200).json({
      message: 'Author updated successfully',
      author: updatedAuthor,
    });
  } catch (error) {
    console.error('Error updating author:', error.message);
    res.status(500).json({ message: 'Failed to update author', error: error.message });
  }
};

export const deleteAuthor = async (req, res) => {
  const { id } = req.params;

  try {
    const author = await Author.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.status(200).json({ message: 'Author deleted successfully', author });
  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({ message: 'Failed to delete author', error: error.message });
  }
};
