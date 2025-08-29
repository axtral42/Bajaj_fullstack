const express = require("express");
const cors = require("cors");
const { z } = require("zod");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  try {
    const rootResponse = {
      message:
        "VIT Full Stack API with Zod Validation by Ansh Sharma 22BCE1338 - Use POST /bfhl to process data",
      endpoints: {
        "POST /bfhl": "Process array data with validation",
        "GET /bfhl": "Use POST request to send data",
      },
    };
    res.status(200).json(rootResponse);
  } catch (error) {
    console.error("Error in root route:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(PORT);
