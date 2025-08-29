const express = require("express");
const cors = require("cors");
const { z } = require("zod");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/bfhl", (req, res) => {
  try {
    const response = {
      NOTE: "Kindly send data through POST",
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in GET /bfhl:", error);
    res.status(500).json({
      is_success: false,
      message: "Internal server error",
    });
  }
});

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

app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      is_success: false,
      message: "Invalid JSON format",
    });
  }

  res.status(500).json({
    is_success: false,
    message: "Internal server error",
  });
});

app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    message: "Route not found",
    requested_path: req.path,
    method: req.method,
  });
});

app.listen(PORT);
