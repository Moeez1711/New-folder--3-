const express = require('express');
const app = express();

app.use(express.json());
 
// Import routes
const authRoutes = require('./routes/authRoutes');
app.use(authRoutes); 
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
  