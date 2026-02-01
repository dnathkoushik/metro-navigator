const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

// Connect to database (will vary based on ENV)
connectDB().then(async () => {
    try {
        const adminExists = await User.findOne({ type: 'admin' });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                name: 'Admin',
                email: 'admin@example.com',
                password: hashedPassword,
                type: 'admin'
            });
            console.log('Default admin user created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
});

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
