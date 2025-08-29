const express = require("express");
const cors = require("cors");
const { z } = require("zod");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DataRequestSchema = z.object({
  data: z
    .array(z.string())
    .min(1, "Data array must contain at least one element"),
});

const DataResponseSchema = z.object({
  is_success: z.boolean(),
  user_id: z.string(),
  email: z.string().email(),
  roll_number: z.string(),
  odd_numbers: z.array(z.string()),
  even_numbers: z.array(z.string()),
  alphabets: z.array(z.string()),
  special_characters: z.array(z.string()),
  sum: z.string(),
  concat_string: z.string(),
});

function isNumber(str) {
  const trimmedStr = str.trim();
  return (
    !isNaN(trimmedStr) && !isNaN(parseFloat(trimmedStr)) && trimmedStr !== ""
  );
}

function isAlphabet(str) {
  return /^[a-zA-Z]+$/.test(str);
}

function isSpecialCharacter(str) {
  return !isNumber(str) && !isAlphabet(str) && str.trim() !== "";
}

function createAlternatingCaps(alphabets) {
  if (alphabets.length === 0) return "";

  let allChars = [];
  alphabets.forEach((item) => {
    for (let char of item) {
      allChars.push(char);
    }
  });

  allChars.reverse();

  let result = "";
  for (let i = 0; i < allChars.length; i++) {
    if (i % 2 === 1) {
      result += allChars[i].toLowerCase();
    } else {
      result += allChars[i].toUpperCase();
    }
  }

  return result;
}

function validateRequest(schema) {
  return (req, res, next) => {
    const validatedData = schema.parse(req.body);
    req.validatedBody = validatedData;
    next();
  };
}
app.post("/bfhl", validateRequest(DataRequestSchema), (req, res) => {
  try {
    const { data } = req.validatedBody;

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    data.forEach((item) => {
      const str = String(item).trim();

      if (str === "") return;

      if (isNumber(str)) {
        const num = parseInt(str);
        if (num % 2 === 0) {
          even_numbers.push(str);
        } else {
          odd_numbers.push(str);
        }
        sum += num;
      } else if (isAlphabet(str)) {
        alphabets.push(str.toUpperCase());
      } else {
        let hasProcessedAsWhole = false;

        if (str.length === 1 && isSpecialCharacter(str)) {
          special_characters.push(str);
          hasProcessedAsWhole = true;
        }

        if (!hasProcessedAsWhole) {
          for (let char of str) {
            if (isNumber(char)) {
              const num = parseInt(char);
              if (num % 2 === 0) {
                even_numbers.push(char);
              } else {
                odd_numbers.push(char);
              }
              sum += num;
            } else if (isAlphabet(char)) {
              alphabets.push(char.toUpperCase());
            } else if (isSpecialCharacter(char)) {
              special_characters.push(char);
            }
          }
        }
      }
    });

    const concat_string = createAlternatingCaps(alphabets);

    const responseData = {
      is_success: true,
      user_id: "ansh_sharma_16072004",
      email: "ansh.sharma2022a@vitstudent.ac.in",
      roll_number: "22BCE1338",
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string,
    };

    const validatedResponse = DataResponseSchema.parse(responseData);

    res.status(200).json(validatedResponse);
  } catch (error) {
    console.error("Error processing request:", error);

    if (error instanceof z.ZodError) {
      return res.status(500).json({
        is_success: false,
        message: "Response validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      is_success: false,
      message: "Internal server error",
    });
  }
});

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
