import { Poster } from "../model/posterModel.js";

export const findPosters = async (req,res) => {
    try {
        
        // Fetch all categories from the database
        const posters = await Poster.find({ isDeleted: false }).sort({ createdAt: -1 });
    
        // Send the fetched categories as a response
        res.status(200).json(posters);
      } catch (error) {
        console.error('Error fetching posters:', error);
        res.status(500).json({ error: 'Failed to fetch posters' });
      }
}