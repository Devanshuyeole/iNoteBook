const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');

connectToMongo();
const app = express();

app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`iNotebook backend listening on port ${PORT}`);
    console.log(`Server running at http://localhost:${PORT}`);
});
