import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the puckswap directory
app.use(express.static('puckswap'));

// Serve static files from the parent directory for imports
app.use('/src', express.static('src'));
app.use('/build', express.static('build'));

// Enable CORS for ES modules
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`PuckSwap UI is running at http://localhost:${PORT}`);
    console.log(`\nTo create a pool, use: npm run setup-pool`);
    console.log(`To open the UI, visit: http://localhost:${PORT}`);
}); 