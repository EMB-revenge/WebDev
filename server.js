import express from 'express';
import cors from 'cors';
import path from 'path';
const app = express();
const PORT = 3000;

// In-memory storage for users
const users = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.cwd()));

// Serve the main page (signup)
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'signup.html'));
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'login.html'));
});

// Signup endpoint
app.post('/api/signup', (req, res) => {
    const { firstname, lastname, email, birthdate, password, repassword } = req.body;
    
    // Basic validation
    if (!firstname || !lastname || !email || !birthdate || !password || !repassword) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please fill up all fields' 
        });
    }
    
    if (password !== repassword) {
        return res.status(400).json({ 
            success: false, 
            message: 'Passwords do not match' 
        });
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ 
            success: false, 
            message: 'User with this email already exists' 
        });
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        firstname,
        lastname,
        email,
        birthdate,
        password
    };
    
    users.push(newUser);
    
    res.json({ 
        success: true, 
        message: 'Registration successful',
        user: { id: newUser.id, firstname, lastname, email, birthdate }
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid email or password' 
        });
    }
    
    res.json({ 
        success: true, 
        message: 'Login successful',
        user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email }
    });
});

// Get all users (for testing purposes)
app.get('/api/users', (req, res) => {
    const safeUsers = users.map(user => ({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        birthdate: user.birthdate
    }));
    res.json(safeUsers);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});