import { Category } from '../model/categoryModel.js'; // Adjust the path based on your folder structure

export const addCategory = async (req, res) => {
  try {
    // Array of categories to be added
    const categories = [
      { categoryName: "Science Fiction", description: "Books exploring futuristic concepts and technology." },
      { categoryName: "Fantasy", description: "Books featuring magical or supernatural elements." },
      { categoryName: "Mystery", description: "Books focused on solving a crime or uncovering secrets." },
      { categoryName: "Thriller", description: "Books with fast-paced, suspenseful plots." },
      { categoryName: "Romance", description: "Books centered around romantic relationships." },
      { categoryName: "Horror", description: "Books designed to scare, unsettle, or thrill the reader." },
      { categoryName: "Historical Fiction", description: "Books set in a particular historical period." },
      { categoryName: "Biography", description: "Books about the lives of real people." },
      { categoryName: "Self-Help", description: "Books that provide advice on personal improvement." },
      { categoryName: "Non-Fiction", description: "Books based on factual information and events." },
      { categoryName: "Adventure", description: "Books with exciting and risky experiences." },
      { categoryName: "Young Adult", description: "Books targeted at teenage readers." },
      { categoryName: "Children’s", description: "Books for young children and early readers." },
      { categoryName: "Graphic Novels", description: "Books told through comic-style illustrations." },
      { categoryName: "Poetry", description: "Books of poems and verse." },
      { categoryName: "Drama", description: "Books featuring conflict and intense emotional themes." },
      { categoryName: "Science", description: "Books focused on scientific subjects and discoveries." },
      { categoryName: "Art", description: "Books about art, design, and creative expression." },
      { categoryName: "Philosophy", description: "Books exploring philosophical topics and ideas." },
      { categoryName: "Cooking", description: "Books with recipes and culinary techniques." }
    ];

    // Map the categories to include required fields like isDeleted, books, and createdAt
    const categoriesToInsert = categories.map(category => ({
      ...category,
      isDeleted: false,
      books: [],
      createdAt: new Date() // Sets the current date and time as a Date object
    }));

    // Insert categories into the database
    const insertedCategories = await Category.insertMany(categoriesToInsert);

    // Respond with the inserted categories
    res.status(201).json({ message: 'Categories added successfully', categories: insertedCategories });
  } catch (error) {
    console.error('Error adding categories:', error);
    res.status(500).json({ message: 'Failed to add categories', error: error.message });
  }
};

export const findCategories = async (req,res) => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find({ isDeleted: false });
    
        // Send the fetched categories as a response
        res.status(200).json(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
      }
}

export const findSingleCategories = async (req,res) => {
    const { id } = req.params; // Extract the category ID from the URL parameters

  try {
    // Find the category by ID
    const category = await Category.findById(id);

    // Check if the category exists
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Send the found category as a response
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch the category' });
  }
}

export const updateSingleCategories = async (req,res) => {
    const { id } = req.params; // Extract the category ID from the request parameters
  const { categoryName, description } = req.body; // Extract updated data from the request body

  try {
    // Find the category by ID and update it with the new data
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName, description },
      { new: true, runValidators: true } // Options to return the updated document and run schema validators
    );

    // Check if the category was found and updated
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Return the updated category details
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
}
export const deleteCategory = async (req, res) => {
    const { id } = req.params; // Assuming the category ID is passed as a URL parameter
  
    try {
      // Check if the category exists and is not already deleted
      const category = await Category.findById(id);
      if (!category || category.isDeleted) {
        return res.status(404).json({ message: 'Category not found or already deleted' });
      }
  
      // Perform a soft delete by updating the isDeleted and deletedAt fields
      category.isDeleted = true;
      category.deletedAt = new Date();
  
      // Save the updated category
      await category.save();
  
      // Send a success response
      res.status(200).json({ message: 'Category deleted successfully (soft delete)' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'An error occurred while deleting the category' });
    }
  };
  