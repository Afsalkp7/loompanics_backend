import { Category } from '../model/categoryModel.js';

export const findCategories = async (req,res) => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find({ isDeleted: false });
     // Filter categories to include only those where books length > 0
     const filteredCategories = categories.filter(category => 
      Array.isArray(category.books) && category.books.length > 0
    );
        // Send the fetched categories as a response
        res.status(200).json(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
      }
}

export const findSingleCategories = async (req,res) => {
    const { id } = req.params; // Extract the category ID from the URL parameters

  try {
    // Find the category by ID
    const category = await Category.findById(id).populate("books");
    
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
