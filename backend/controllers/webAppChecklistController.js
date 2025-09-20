const WebAppChecklist = require('../models/WebAppChecklist');

// Get checklist for a specific target
const getChecklistByTarget = async (req, res) => {
  try {
    const { target } = req.params;
    
    if (!target) {
      return res.status(400).json({ error: 'Target parameter is required' });
    }

    const checklist = await WebAppChecklist.findOne({ target: target.trim() });
    
    if (!checklist) {
      // Return empty checklist structure if none exists
      return res.json({
        target: target.trim(),
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    res.json(checklist);
  } catch (error) {
    console.error('Error fetching checklist:', error);
    res.status(500).json({ error: 'Failed to fetch checklist' });
  }
};

// Save or update checklist for a target
const saveChecklist = async (req, res) => {
  try {
    const { target, items } = req.body;

    if (!target || !items) {
      return res.status(400).json({ 
        error: 'Target and items are required' 
      });
    }

    // Validate items structure
    if (!Array.isArray(items)) {
      return res.status(400).json({ 
        error: 'Items must be an array' 
      });
    }

    // Find existing checklist or create new one
    let checklist = await WebAppChecklist.findOne({ target: target.trim() });

    if (checklist) {
      // Update existing checklist
      checklist.items = items;
      checklist.updatedAt = new Date();
    } else {
      // Create new checklist
      checklist = new WebAppChecklist({
        target: target.trim(),
        items: items
      });
    }

    await checklist.save();

    res.json({
      message: 'Checklist saved successfully',
      checklist
    });
  } catch (error) {
    console.error('Error saving checklist:', error);
    res.status(500).json({ error: 'Failed to save checklist' });
  }
};

// Update a specific item in the checklist
const updateChecklistItem = async (req, res) => {
  try {
    const { target } = req.params;
    const { itemId, checked, notes } = req.body;

    if (!target || itemId === undefined) {
      return res.status(400).json({ 
        error: 'Target and itemId are required' 
      });
    }

    let checklist = await WebAppChecklist.findOne({ target: target.trim() });

    if (!checklist) {
      // Create new checklist if it doesn't exist
      checklist = new WebAppChecklist({
        target: target.trim(),
        items: []
      });
    }

    // Find existing item or create new one
    const existingItemIndex = checklist.items.findIndex(item => item.itemId === itemId);

    if (existingItemIndex !== -1) {
      // Update existing item
      if (checked !== undefined) checklist.items[existingItemIndex].checked = checked;
      if (notes !== undefined) checklist.items[existingItemIndex].notes = notes;
    } else {
      // Add new item
      checklist.items.push({
        itemId,
        checked: checked || false,
        notes: notes || ''
      });
    }

    checklist.updatedAt = new Date();
    await checklist.save();

    res.json({
      message: 'Checklist item updated successfully',
      checklist
    });
  } catch (error) {
    console.error('Error updating checklist item:', error);
    res.status(500).json({ error: 'Failed to update checklist item' });
  }
};

// Get all checklists (for overview)
const getAllChecklists = async (req, res) => {
  try {
    const checklists = await WebAppChecklist.find()
      .sort({ updatedAt: -1 })
      .select('target items.itemId items.checked createdAt updatedAt');

    // Calculate progress for each checklist
    const checklistsWithProgress = checklists.map(checklist => {
      const totalItems = checklist.items.length;
      const completedItems = checklist.items.filter(item => item.checked).length;
      const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      return {
        ...checklist.toObject(),
        progress,
        totalItems,
        completedItems
      };
    });

    res.json(checklistsWithProgress);
  } catch (error) {
    console.error('Error fetching all checklists:', error);
    res.status(500).json({ error: 'Failed to fetch checklists' });
  }
};

// Delete checklist for a target
const deleteChecklist = async (req, res) => {
  try {
    const { target } = req.params;

    if (!target) {
      return res.status(400).json({ error: 'Target parameter is required' });
    }

    const deletedChecklist = await WebAppChecklist.findOneAndDelete({ 
      target: target.trim() 
    });

    if (!deletedChecklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    res.json({ message: 'Checklist deleted successfully' });
  } catch (error) {
    console.error('Error deleting checklist:', error);
    res.status(500).json({ error: 'Failed to delete checklist' });
  }
};

module.exports = {
  getChecklistByTarget,
  saveChecklist,
  updateChecklistItem,
  getAllChecklists,
  deleteChecklist
};