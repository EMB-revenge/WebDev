import express from 'express';
import cors from 'cors';
import path from 'path';
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for users
const users = [];

const isValidEmail = (value) => {
    const str = String(value || '').toLowerCase().trim();
    const atIndex = str.indexOf('@');
    if (atIndex <= 0) return false; // must have something before '@'
    const dotIndex = str.indexOf('.', atIndex + 1);
    if (dotIndex <= atIndex + 1) return false; // must have '.' after '@' with at least one char in between
    if (dotIndex >= str.length - 1) return false; // must have something after '.'
    return true;
};

const isStrongPassword = (value) => {
    const s = String(value || '');
    if (s.length < 8) return false;
    let hasUpper = false, hasLower = false, hasDigit = false;
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch >= 'A' && ch <= 'Z') hasUpper = true;
        else if (ch >= 'a' && ch <= 'z') hasLower = true;
        else if (ch >= '0' && ch <= '9') hasDigit = true;
    }
    return hasUpper && hasLower && hasDigit;
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

// Serve the main page
app.get('/', (res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Serve login page
app.get('/login', (res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
});

// Signup endpoint
app.post('/api/signup', (req, res) => {
    const { firstname, lastname, email, birthdate, password, repassword } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    
    // Basic validation
    if (!firstname || !lastname || !email || !birthdate || !password || !repassword) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please fill up all fields' 
        });
    }

    if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    if (!isStrongPassword(password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters and include upper, lower, and a number'
        });
    }

    if (password !== repassword) {
        return res.status(400).json({ 
            success: false, 
            message: 'Passwords do not match' 
        });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === normalizedEmail);
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
        email: normalizedEmail,
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
    const normalizedEmail = String(email || '').trim().toLowerCase();
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }

    if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }
    
    // Find user
    const user = users.find(u => u.email === normalizedEmail && u.password === password);
    
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
// Serve signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'signup.html'));
});
