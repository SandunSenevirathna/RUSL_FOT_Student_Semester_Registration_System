// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./dbConfig"); // Import the database configuration

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

// Establish the database connection
db.connect(function (error) {
  if (error) {
    console.log("Error Connecting to DB");
  } else {
    console.log("Successfully Connected to DB");
  }
});

// Start the server
const PORT = 8085;
server.listen(PORT, function check(error) {
  if (error) {
    console.log(err + "Error....!!!!");
  } else {
    console.log(`Server is running on port ${PORT}..!`);
  }
});

// Define a route to get all batches
server.get("/api/batch/all", (req, res) => {
  // Fetch all batches from the batch table
  const query =
    "SELECT `batch_name`, `enrollment_date` FROM `batch` WHERE `available`= 1";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching batches:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

   // console.log("Batches fetched successfully");
    res.status(200).json(result);
  });
});

// Define a route to handle batch insertion
server.post("/api/batch/insert", async (req, res) => {
  try {
    const { batch_name, enrollment_date } = req.body;

    // Validate if required fields are provided
    if (!batch_name || !enrollment_date) {
      return res
        .status(400)
        .json({ error: "Batch name and enrollment date are required" });
    }

    // Insert data into the batch table
    const query =
      "INSERT INTO `batch`(`batch_name`, `enrollment_date`) VALUES (?, ?)";
    db.query(query, [batch_name, enrollment_date], (err, result) => {
      if (err) {
        console.error("Error inserting into batch table:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      console.log(batch_name, " Batch inserted successfully");
      res.status(201).json({ message: "Batch inserted successfully" });
    });
  } catch (error) {
    console.error("Error handling batch insertion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

server.put("/api/batch/deleteBatch", async (req, res) => {
  const { batch_name, available, deleted_date } = req.body;

  try {
    // Update the batch in the database
    const updateQuery =
      "UPDATE `batch` SET `available` = ?, `deleted_date` = ? WHERE `batch_name` = ?";
    db.query(
      updateQuery,
      [available, deleted_date, batch_name],
      (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating batch:", updateErr);
          return res.status(500).send("Internal Server Error");
        }
        console.log(`Successfully updated batch: ${batch_name}`);
        res.status(200).send("Batch deleted successfully");
      }
    );
  } catch (error) {
    console.error("Error deleting batch:", error);
    res.status(500).send("Internal Server Error");
  }
});
