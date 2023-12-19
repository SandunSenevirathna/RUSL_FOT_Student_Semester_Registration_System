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
    "SELECT * FROM `batch`";
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


server.delete("/api/batch/deleteBatch", async (req, res) => {
  const { batch_name } = req.query;

  try {
    // Delete the batch in the database
    const deleteQuery = "DELETE FROM `batch` WHERE `batch_name` = ?";
    db.query(deleteQuery, [batch_name], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error deleting batch:", deleteErr);
        return res.status(500).send("Internal Server Error");
      }
      console.log(`Successfully deleted batch: ${batch_name}`);
      res.status(200).send("Batch deleted successfully");
    });
  } catch (error) {
    console.error("Error deleting batch:", error);
    res.status(500).send("Internal Server Error");
  }
});


//------------------- department -----------------------------------

server.get("/api/departments/all", (req, res) => {
  // Fetch all batches from the batch table
  const query =
    "SELECT * FROM `department`";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching department:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("department fetched successfully");
    res.status(200).json(result);
  });
});

server.post("/api/departments/upsert", async (req, res) => {
  const { department_code, department_name } = req.body;

  try {
    // Check if the department with the given department_code already exists
    const checkQuery = "SELECT * FROM `department` WHERE `department_code` = ?";
    db.query(checkQuery, [department_code], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking department existence:", checkErr);
        return res.status(500).send("Internal Server Error");
      }

      if (checkResult.length > 0) {
        // If the department exists, perform an update
        const updateQuery =
          "UPDATE `department` SET `department_name` = ? WHERE `department_code` = ?";
        db.query(updateQuery, [department_name, department_code], (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating department:", updateErr);
            return res.status(500).send("Internal Server Error");
          }
          console.log(`Successfully updated department: ${department_name}`);
          res.status(200).send("Department updated successfully");
        });
      } else {
        // If the department does not exist, perform an insert
        const insertQuery =
          "INSERT INTO `department`(`department_code`, `department_name`) VALUES (?, ?)";
        db.query(insertQuery, [department_code, department_name], (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting department:", insertErr);
            return res.status(500).send("Internal Server Error");
          }
          console.log(`Successfully inserted department: ${department_name}`);
          res.status(200).send("Department inserted successfully");
        });
      }
    });
  } catch (error) {
    console.error("Error upserting department:", error);
    res.status(500).send("Internal Server Error");
  }
});

server.delete("/api/departments/delete", async (req, res) => {
  const { department_code } = req.query;

  try {
    // Delete the department in the database
    const deleteQuery = "DELETE FROM `department` WHERE `department_code` = ?";
    db.query(deleteQuery, [department_code], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error deleting department:", deleteErr);
        return res.status(500).send("Internal Server Error");
      }
      console.log(`Successfully deleted department with code: ${department_code}`);
      res.status(200).send("Department deleted successfully");
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).send("Internal Server Error");
  }
});



//------------------- Subject  -----------------------------------

server.get("/api/subject/all", (req, res) => {
  // Fetch all batches from the batch table
  const query =
    "SELECT * FROM `subject` WHERE 1";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching subject:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("subject fetched successfully");
    res.status(200).json(result);
  });
});


// Add this route to handle subject insertion or update
server.post("/api/subject/upsert", (req, res) => {
  const {
    subjectCode,
    subjectName,
    credit,
    compulsoryDepartments,
    optionalDepartments,
    semester,
  } = req.body;

  const compulsoryDepartmentsString = compulsoryDepartments.join(',');
  const optionalDepartmentsString = optionalDepartments.join(',');

  // Check if the subject with the given subjectCode already exists
  const checkQuery = "SELECT * FROM `subject` WHERE `subject_code` = ?";
  db.query(checkQuery, [subjectCode], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking subject existence:", checkErr);
      return res.status(500).send("Internal Server Error");
    }

    if (checkResult.length > 0) {
      // If the subject exists, perform an update
      const updateQuery = `
        UPDATE subject
        SET subject_name = ?, credit = ?, compulsory_department = ?, optional_department = ?, semester = ?
        WHERE subject_code = ?
      `;
      db.query(
        updateQuery,
        [
          subjectName,
          credit,
          compulsoryDepartmentsString,
          optionalDepartmentsString,
          semester,
          subjectCode,
        ],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating subject:", updateErr);
            return res.status(500).send("Internal Server Error");
          }
          console.log(`Successfully updated subject: ${subjectCode}`);
          res.status(200).send("Subject updated successfully");
        }
      );
    } else {
      // If the subject does not exist, perform an insert
      const insertQuery = `
        INSERT INTO subject (subject_code, subject_name, credit, compulsory_department, optional_department, semester)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [
          subjectCode,
          subjectName,
          credit,
          compulsoryDepartmentsString,
          optionalDepartmentsString,
          semester,
        ],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting subject:", insertErr);
            return res.status(500).send("Internal Server Error");
          }
          console.log(`Successfully inserted subject: ${subjectCode}`);
          res.status(201).send("Subject inserted successfully");
        }
      );
    }
  });
});


// Add this route to your existing server.js or equivalent file

server.delete("/api/subject/delete", async (req, res) => {
  const { subjectCode } = req.query;

  try {
    // Delete the subject in the database
    const deleteQuery = "DELETE FROM `subject` WHERE `subject_code` = ?";
    db.query(deleteQuery, [subjectCode], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error deleting subject:", deleteErr);
        return res.status(500).send("Internal Server Error");
      }
      console.log(`Successfully deleted subject with code: ${subjectCode}`);
      res.status(200).send("Subject deleted successfully");
    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).send("Internal Server Error");
  }
});
