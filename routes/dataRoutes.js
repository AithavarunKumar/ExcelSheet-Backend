const express = require("express");
const router = express.Router();

// Example route, you can add other routes as needed
router.get("/example", (req, res) => {
  res.send("Example route");
});

// Export the router for use in app.js
module.exports = router;
