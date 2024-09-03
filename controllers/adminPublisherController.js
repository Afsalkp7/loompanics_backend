import { Publisher } from '../model/publisherModel.js'; // Adjust the path based on your folder structure

export const addPublisher = async (req, res) => {
  try {
    const { publisherName, publisherAddress , publisherUrl } = req.body;
    
    // Validation
    if (!publisherName || !publisherAddress || !publisherUrl) {
      return res.status(400).json({ message: 'publisher name,address and url are required' });
    }

    // Create a new category
    const newPublisher = new Publisher({
        publisherName, 
        publisherAddress,
        publisherUrl
    });

    // Save the category to the database
    await newPublisher.save();

    // Respond with the created category
    res.status(201).json({ message: 'Category added successfully', publisher: newPublisher});
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Failed to add category', error: error.message });
  }
};

export const findPublishers = async (req,res) => {
    try {
        // Fetch all categories from the database
        const publishers = await Publisher.find({ isDeleted: false });
    
        // Send the fetched categories as a response
        res.status(200).json(publishers);
      } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
      }
}

export const findSinglePublishers = async (req,res) => {
    const { id } = req.params; // Extract the category ID from the URL parameters

  try {
    // Find the category by ID
    const publisher = await Publisher.findById(id);

    // Check if the category exists
    if (!publisher) {
      return res.status(404).json({ message: 'publisher not found' });
    }

    // Send the found category as a response
    res.status(200).json(publisher);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch the category' });
  }
}

export const updateSinglePublishers = async (req,res) => {
    const { id } = req.params; // Extract the category ID from the request parameters
  const { publisherName, publisherAddress , publisherUrl } = req.body; // Extract updated data from the request body

  try {
    // Find the category by ID and update it with the new data
    const updatedPublisher = await Publisher.findByIdAndUpdate(
      id,
      { publisherName, publisherAddress , publisherUrl },
      { new: true, runValidators: true } // Options to return the updated document and run schema validators
    );

    // Check if the category was found and updated
    if (!updatedPublisher) {
      return res.status(404).json({ message: 'Publisher not found' });
    }

    // Return the updated category details
    res.status(200).json(updatedPublisher);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
}

export const deletePublisher = async (req, res) => {
    const { id } = req.params; // Assuming the category ID is passed as a URL parameter
  
    try {
      // Check if the category exists and is not already deleted
      const publisher = await Publisher.findById(id);
      if (!publisher || publisher.isDeleted) {
        return res.status(404).json({ message: 'publisher not found or already deleted' });
      }
  
      // Perform a soft delete by updating the isDeleted and deletedAt fields
      publisher.isDeleted = true;
      publisher.deletedAt = new Date();
  
      // Save the updated category
      await publisher.save();
  
      // Send a success response
      res.status(200).json({ message: 'Category deleted successfully (soft delete)' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'An error occurred while deleting the category' });
    }
  };
  