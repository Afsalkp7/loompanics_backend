import mongoose from 'mongoose';
import { Books } from '../model/booksModel.js';

export const userFindProducts = async (req, res) => {
    try {
      const products = await Books.find().populate('categoryId',"categoryName books").populate("authorId","firstName lastName books"); 
  
      if (!products || products.length === 0) {
        return res.status(404).json({ message: 'No products found' });
      }
      
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Server error. Unable to fetch products.' });
    }
  };
  
  export const userFindSingleProduct = async (req, res) => {
    const { _id } = req.params;
    try {
      const product = await Books.findById(_id)
        .populate({
          path: 'authorId',
          populate: {
            path: 'books',
          },
        })
        .populate({
            path:'categoryId',
            populate:{
                path:'books',
            },
        })
        .populate('publisherId');
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error('Error finding product:', error);
      res.status(500).json({ message: 'Error finding product', error: error.message });
    }
  };
  