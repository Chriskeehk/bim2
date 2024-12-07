const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(express.json({ limit: '50mb' }));

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
});

// Serve static files from the app directory
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'dist')));

// Explicitly define routes
app.route('/save-camera-position')
    .options((req, res) => {
        res.sendStatus(200);
    })
    .post(async (req, res) => {
        try {
            const positions = req.body;
            const filePath = path.join(__dirname, 'app/data/camera_positions.json');
            
            console.log('Received request to save positions');
            await fs.writeFile(filePath, JSON.stringify(positions, null, 4));
            console.log('Camera positions saved successfully');
            
            res.json({ success: true });
        } catch (error) {
            console.error('Error saving camera positions:', error);
            res.status(500).json({ error: 'Failed to save camera positions' });
        }
    });

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`POST endpoint available at http://localhost:${port}/save-camera-position`);
}); 