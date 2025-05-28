const express = require('express');
const connectDB = require('./config/db');
const Wildfire = require('./models/Wildfire');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes

// Get all wildfires (with optional filtering)
app.get('/api/wildfires', async (req, res) => {
  try {
    const { status, region, minAcres, maxAcres, cause, gridX, gridY } = req.query;
    
    // Build query object based on filters
    const query = {};
    
    if (status) query.status = status;
    if (region) query['location.region'] = region;
    if (cause) query.cause = cause;
    
    // Grid cell filter
    if (gridX !== undefined) query['location.gridCell.x'] = Number(gridX);
    if (gridY !== undefined) query['location.gridCell.y'] = Number(gridY);
    
    // Size filter
    if (minAcres || maxAcres) {
      query['size.acres'] = {};
      if (minAcres) query['size.acres'].$gte = Number(minAcres);
      if (maxAcres) query['size.acres'].$lte = Number(maxAcres);
    }
    
    const wildfires = await Wildfire.find(query).sort({ updatedAt: -1 });
    res.json(wildfires);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get wildfires by grid cell range
app.get('/api/wildfires/grid/:region', async (req, res) => {

// Get a specific wildfire by ID
app.get('/api/wildfires/:id', async (req, res) => {
  try {
    const wildfire = await Wildfire.findOne({ id: req.params.id });
    
    if (!wildfire) {
      return res.status(404).json({ message: 'Wildfire not found' });
    }
    
    res.json(wildfire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
  try {
    const { region } = req.params;
    const { minX, maxX, minY, maxY } = req.query;
    
    if (!region || !minX || !maxX || !minY || !maxY) {
      return res.status(400).json({ 
        message: 'Missing parameters. Required: region, minX, maxX, minY, maxY' 
      });
    }
    
    const query = {
      'location.region': region,
      'location.gridCell.x': { $gte: Number(minX), $lte: Number(maxX) },
      'location.gridCell.y': { $gte: Number(minY), $lte: Number(maxY) }
    };
    
    const wildfires = await Wildfire.find(query).sort({ updatedAt: -1 });
    
    res.json({
      region,
      gridRange: {
        x: { min: Number(minX), max: Number(maxX) },
        y: { min: Number(minY), max: Number(maxY) }
      },
      count: wildfires.length,
      wildfires
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get wildfire stream (simulates real-time updates)
app.get('/api/wildfire-stream', async (req, res) => {
  try {
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Send initial data
    const wildfires = await Wildfire.find().sort({ updatedAt: -1 }).limit(10);
    res.write(`data: ${JSON.stringify(wildfires)}\n\n`);
    
    // Function to update a random wildfire
    const updateRandomWildfire = async () => {
      try {
        // Get random wildfire
        const count = await Wildfire.countDocuments();
        const random = Math.floor(Math.random() * count);
        const wildfire = await Wildfire.findOne().skip(random);
        
        if (!wildfire) return;
        
        // Update random properties
        const updates = {};
        
        // Randomly choose which properties to update
        const updateChoices = Math.floor(Math.random() * 4) + 1; // 1-4 updates
        
        for (let i = 0; i < updateChoices; i++) {
          const choice = Math.floor(Math.random() * 5); // 0-4 update types
          
          switch(choice) {
            case 0: // Update status
              if (wildfire.status === 'active') {
                // Active fires might become contained
                if (Math.random() > 0.7) {
                  updates.status = 'contained';
                  updates['size.containmentPercentage'] = Math.floor(Math.random() * 30) + 70; // 70-99%
                } else {
                  // Or just update containment percentage
                  updates['size.containmentPercentage'] = Math.min(
                    69, 
                    wildfire.size.containmentPercentage + Math.floor(Math.random() * 15)
                  );
                }
              } else if (wildfire.status === 'contained') {
                // Contained fires might be extinguished
                if (Math.random() > 0.6) {
                  updates.status = 'extinguished';
                  updates['size.containmentPercentage'] = 100;
                } else {
                  // Or improve containment
                  updates['size.containmentPercentage'] = Math.min(
                    99, 
                    wildfire.size.containmentPercentage + Math.floor(Math.random() * 10)
                  );
                }
              }
              break;
              
            case 1: // Update size
              if (wildfire.status === 'active') {
                // Active fires can grow
                updates['size.acres'] = wildfire.size.acres + Math.floor(Math.random() * 1000) + 1;
              }
              break;
              
            case 2: // Update conditions
              updates.conditions = {
                ...wildfire.conditions,
                windSpeed: Math.floor(Math.random() * 50),
                temperature: Math.floor(Math.random() * 50) + 60,
                humidity: Math.floor(Math.random() * 90) + 5,
              };
              break;
              
            case 3: // Update resources
              updates.resources = {
                ...wildfire.resources,
                personnelCount: Math.floor(Math.random() * 5000) + 10,
                aircraftCount: Math.floor(Math.random() * 30),
                vehiclesCount: Math.floor(Math.random() * 200) + 5
              };
              break;
              
            case 4: // Add evacuation order
              if (!updates.evacuationOrders) {
                updates.$push = {
                  evacuationOrders: {
                    area: `${Math.random().toString(36).substring(7)} Area`,
                    status: ['mandatory', 'warning', 'lifted'][Math.floor(Math.random() * 3)],
                    issuedAt: new Date()
                  }
                };
              }
              break;
          }
        }
        
        // Always update the updatedAt timestamp
        updates.updatedAt = new Date();
        
        // Apply updates
        const updatedWildfire = await Wildfire.findByIdAndUpdate(
          wildfire._id,
          updates.$push ? { ...updates, ...updates.$push } : updates,
          { new: true }
        );
        
        return updatedWildfire;
      } catch (error) {
        console.error('Error updating wildfire:', error);
        return null;
      }
    };
    
    // Periodically send updates (every 5 seconds)
    const interval = setInterval(async () => {
      const updatedWildfire = await updateRandomWildfire();
      
      if (updatedWildfire) {
        res.write(`data: ${JSON.stringify([updatedWildfire])}\n\n`);
      }
    }, 5000);
    
    // Clean up on close
    res.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 