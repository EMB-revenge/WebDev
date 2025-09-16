import express from 'express';
const app = express();

// Allow frontend to access our API (CORS)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Store users here
let users = [];

// Fetch data from Random User API once when server starts
async function loadUsers() {
    try {
        const response = await fetch('https://randomuser.me/api/?results=1000');
        const data = await response.json();
        users = data.results;
        console.log(`Loaded ${users.length} users`);
    } catch (error) {
        console.log('Error loading users:', error.message);
    }
}

// Main API endpoint - works like randomuser.me
app.get('/api', (req, res) => {
    const count = parseInt(req.query.results) || 1;
    const selectedUsers = [];
    
    // Pick random users from our stored data
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * users.length);
        selectedUsers.push(users[randomIndex]);
    }
    
    // Return in same format as Random User API
    res.json({
        results: selectedUsers,
        info: {
            results: selectedUsers.length,
            page: 1,
            version: '1.4'
        }
    });
});

// Start server
loadUsers().then(() => {
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
        console.log('API available at http://localhost:3000/api');
    });
});