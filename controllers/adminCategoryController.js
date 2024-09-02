import { Category } from '../model/categoryModel.js'; // Adjust the path based on your folder structure

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validation
    if (!name || !description) {
      return res.status(400).json({ message: 'Category name and description are required' });
    }

    // Create a new category
    const newCategory = new Category({
        categoryName : name,
      description,
    });

    // Save the category to the database
    await newCategory.save();

    // Respond with the created category
    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Failed to add category', error: error.message });
  }
};

export const findCategories = async (req,res) => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find({});
    
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

export const deleteCategory = async (req,res) => {
    const { id } = req.params; // Assuming the category ID is passed as a URL parameter

  try {
    // Check if the category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete the category
    await Category.findByIdAndDelete(id);

    // Send a success response
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'An error occurred while deleting the category' });
  }
}