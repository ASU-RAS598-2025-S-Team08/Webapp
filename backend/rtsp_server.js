// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Serve static HLS content from MediaMTX (via proxy or direct)
app.use('/stream', express.static('C:/Users/halon/Documents/ASU/RAS-598/FinalProject/rtsp-server/hls/mystream'));

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
