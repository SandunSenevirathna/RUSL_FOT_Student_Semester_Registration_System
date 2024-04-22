// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./dbConfig"); // Import the database configuration

const server = express();
// Increase payload size limit (e.g., 50 MB)
server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
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
  const query = "SELECT * FROM `batch`";
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
  const query = "SELECT * FROM `department`";
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
        db.query(
          updateQuery,
          [department_name, department_code],
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error("Error updating department:", updateErr);
              return res.status(500).send("Internal Server Error");
            }
            console.log(`Successfully updated department: ${department_name}`);
            res.status(200).send("Department updated successfully");
          }
        );
      } else {
        // If the department does not exist, perform an insert
        const insertQuery =
          "INSERT INTO `department`(`department_code`, `department_name`) VALUES (?, ?)";
        db.query(
          insertQuery,
          [department_code, department_name],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error("Error inserting department:", insertErr);
              return res.status(500).send("Internal Server Error");
            }
            console.log(`Successfully inserted department: ${department_name}`);
            res.status(200).send("Department inserted successfully");
          }
        );
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
      console.log(
        `Successfully deleted department with code: ${department_code}`
      );
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
  const query = "SELECT * FROM `subject` WHERE 1";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching subject:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("subject fetched successfully");
    res.status(200).json(result);
  });
});

server.get("/api/subject/selectFromSemester/:semester", async (req, res) => {
  const { semester } = req.params;

  try {
    // Fetch subjects for the specified semester from the database
    const query =
      "SELECT `subject_code`, `subject_name`, `credit`, `compulsory_department`, `optional_department` FROM `subject` WHERE `semester` = ?";
    db.query(query, [semester], (err, result) => {
      if (err) {
        console.error("Error fetching subjects for semester:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      console.log(semester);

      console.log("Subjects fetched successfully");
      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

server.get(
  "/api/subject/selectFromSemesterAndDepartment/:semester&:department",
  async (req, res) => {
    const { semester, department } = req.params;

    console.log(semester, department);

    try {
      // Fetch subjects for the specified semester and department from the database
      const query =
        "SELECT subject_code, subject_name, credit " +
        "FROM subject " +
        "WHERE semester = ? " +
        "AND (compulsory_department LIKE ? OR optional_department LIKE ?)";

      db.query(
        query,
        [semester, `%${department}%`, `%${department}%`],
        (err, result) => {
          if (err) {
            console.error(
              "Error fetching subjects for semester and department:",
              err
            );
            return res.status(500).json({ error: "Internal server error" });
          }
          console.log(semester, department);

          console.log(
            "Subjects fetched successfully (select from semester & department)"
          );
          console.log(result);
          res.status(200).json(result);
        }
      );
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

server.get("/api/students/fetchByRegistrationAndSubject", async (req, res) => {
  const { registrationNumber, subject_code, semester } = req.query;
  console.log(registrationNumber, subject_code, semester);

  try {
    // Fetch students based on registration number, subject name, and semester
    const query = `
      SELECT s.student_registration_number, s.student_index_number, s.student_name
      FROM student s
      INNER JOIN registered_semester_data rsd ON s.student_registration_number = rsd.student_registration_number
      WHERE rsd.student_registration_number LIKE ? AND rsd.subject_code = ? AND rsd.semester = ?
    `;

    db.query(
      query,
      [`%${registrationNumber}%`, subject_code, semester],
      (err, result) => {
        if (err) {
          console.error("Error fetching student data:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        console.log("Student data fetched successfully");
        console.log(result);
        res.status(200).json(result);
      }
    );
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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

  const compulsoryDepartmentsString = compulsoryDepartments.join(",");
  const optionalDepartmentsString = optionalDepartments.join(",");

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

//------------------- Student  -----------------------------------

server.get("/api/student/all", (req, res) => {
  // Fetch all batches from the batch table
  const query = "SELECT * FROM `student` WHERE 1";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching student:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("subject fetched successfully");
    res.status(200).json(result);
  });
});

// Add this route to handle subject insertion or update
server.post("/api/student/upsert", (req, res) => {
  const {
    registrationNumber,
    indexNumber,
    name,
    selectedBatch,
    selectedDepartment,
    address,
    email,
    tpNumber,
  } = req.body;

  // Check if the subject with the given subjectCode already exists
  const checkQuery =
    "SELECT * FROM `student` WHERE `student_registration_number` = ? AND `student_index_number` = ? ";
  db.query(
    checkQuery,
    [registrationNumber, indexNumber],
    (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking subject existence:", checkErr);
        return res.status(500).send("Internal Server Error");
      }

      if (checkResult.length > 0) {
        // If the subject exists, perform an update
        const updateQuery = `
        UPDATE student
        SET student_name = ?, batch = ?, department = ?, address = ?, email = ?, tp_number = ?
        WHERE student_registration_number = ? AND student_index_number = ?
      `;
        db.query(
          updateQuery,
          [
            name,
            selectedBatch,
            selectedDepartment,
            address,
            email,
            tpNumber,
            registrationNumber,
            indexNumber,
          ],
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error("Error updating student:", updateErr);
              return res.status(500).send("Internal Server Error");
            }
            console.log(`Successfully updated student: ${registrationNumber}`);
            res.status(200).send("Student updated successfully");
          }
        );
      } else {
        // If the subject does not exist, perform an insert
        const insertQuery = `
        INSERT INTO student(student_registration_number, student_index_number, student_name, batch, department, address, email, tp_number)
        VALUEs (?, ?, ?, ?, ?, ?, ?, ?)
      `;
        db.query(
          insertQuery,
          [
            registrationNumber,
            indexNumber,
            name,
            selectedBatch,
            selectedDepartment,
            address,
            email,
            tpNumber,
          ],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error("Error inserting student:", insertErr);
              return res.status(500).send("Internal Server Error");
            }
            console.log(`Successfully inserted student: ${registrationNumber}`);
            res.status(201).send("Student inserted successfully");
          }
        );
      }
    }
  );
});

server.delete("/api/student/delete", async (req, res) => {
  const { registrationNumber } = req.query;

  try {
    // Check if the registration number is provided
    if (!registrationNumber) {
      return res
        .status(400)
        .send("Registration Number is required for deletion.");
    }

    // Delete the student in the database
    const deleteQuery =
      "DELETE FROM `student` WHERE `student_registration_number` = ?";
    db.query(deleteQuery, [registrationNumber], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error deleting student:", deleteErr);
        return res.status(500).send("Internal Server Error");
      }

      if (deleteResult.affectedRows === 0) {
        // No rows were affected, meaning no student with the provided registration number was found
        return res.status(404).send("Student not found.");
      }

      console.log(
        `Successfully deleted student with registration number: ${registrationNumber}`
      );
      res.status(200).send("Student deleted successfully");
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to fetch student data based on email
server.get("/api/student/selected_student_by_email", (req, res) => {
  const { email } = req.query;
  const query =
    "SELECT student_registration_number, student_index_number, batch, department FROM student WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("Error fetching student data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log(`Back End Loged Student Data ${result}`);
    res.status(200).json(result);
  });
});

// get compulsory_subjects to show semester_registration Data Grdi
server.get("/api/student/semester_registration/all_subjects", (req, res) => {
  const { batch, department } = req.query;
  const query = `
    SELECT subject_code, subject_name, credit, subject_type, semester
    FROM started_semester_registration 
    WHERE batch_name = ? AND department_code = ? 
  `;
  db.query(query, [batch, department], (err, result) => {
    if (err) {
      console.error("Error fetching compulsory subjects:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("Compulsory subjects fetched successfully");
    res.status(200).json(result);
  });
});

server.get(
  "/api/student/semester_registration/check_registered_data",
  (req, res) => {
    const { student_registration_number, semester } = req.query;

    console.log(req.query);

    const query = `
    SELECT COUNT(*) AS count
    FROM registered_semester_data
    WHERE student_registration_number = ? AND semester = ? AND approve = 1
  `;

    db.query(query, [student_registration_number, semester], (err, result) => {
      if (err) {
        console.error("Error checking registered semester data:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const count = result[0].count;
      const hasData = count > 0;

      res.status(200).json({ hasData });
    });
  }
);

//------------------- Lecturer  -----------------------------------

server.get("/api/lecturer/all", (req, res) => {
  // Fetch all batches from the batch table
  const query = "SELECT * FROM `lecturer` WHERE 1";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching lecturer:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("lecturer fetched successfully");
    res.status(200).json(result);
  });
});

server.get("/api/lecturer/selected_lecturer_by_email", (req, res) => {
  const { email } = req.query;

  // Fetch lecturer data based on the email
  const query =
    "SELECT `position`, `department` FROM `lecturer` WHERE `email` = ?";
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("Error fetching lecturer data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("Lecturer data fetched successfully");
    res.status(200).json(result);
  });
});

// Add this route to handle subject insertion or update
server.post("/api/lecturer/upsert", (req, res) => {
  const {
    registrationNumber,
    name,
    position,
    selectedDepartment,
    address,
    email,
    tpNumber,
  } = req.body;

  // Check if the subject with the given subjectCode already exists
  const checkQuery =
    "SELECT * FROM `lecturer` WHERE `lecturer_registration_number` = ? ";
  db.query(checkQuery, [registrationNumber], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking lecturer existence:", checkErr);
      return res.status(500).send("Internal Server Error");
    }

    if (checkResult.length > 0) {
      // If the subject exists, perform an update
      const updateQuery = `
        UPDATE lecturer
        SET lecturer_name = ?, position = ?,  department = ?, address = ?, email = ?, tp_number = ?
        WHERE lecturer_registration_number = ? 
      `;
      db.query(
        updateQuery,
        [
          name,
          position,
          selectedDepartment,
          address,
          email,
          tpNumber,
          registrationNumber,
        ],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating lecturer:", updateErr);
            return res.status(500).send("Internal Server Error");
          }
          console.log(`Successfully updated lecturer: ${registrationNumber}`);
          res.status(200).send("Lecturer updated successfully");
        }
      );
    } else {
      // If the subject does not exist, perform an insert
      const insertQuery = `
        INSERT INTO lecturer(lecturer_registration_number, lecturer_name, position, department, address, email, tp_number)
        VALUEs (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [
          registrationNumber,
          name,
          position,
          selectedDepartment,
          address,
          email,
          tpNumber,
        ],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting lecturer:", insertErr);
            return res.status(500).send("Internal Server Error");
          }
          console.log(`Successfully inserted lecturer: ${registrationNumber}`);
          res.status(201).send("Lecturer inserted successfully");
        }
      );
    }
  });
});

server.delete("/api/lecturer/delete", async (req, res) => {
  const { registrationNumber } = req.query;

  try {
    // Check if the registration number is provided
    if (!registrationNumber) {
      return res
        .status(400)
        .send("Registration Number is required for deletion.");
    }

    // Delete the student in the database
    const deleteQuery =
      "DELETE FROM `lecturer` WHERE `lecturer_registration_number` = ?";
    db.query(deleteQuery, [registrationNumber], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Error deleting lecturer:", deleteErr);
        return res.status(500).send("Internal Server Error");
      }

      if (deleteResult.affectedRows === 0) {
        // No rows were affected, meaning no student with the provided registration number was found
        return res.status(404).send("Lecturer not found.");
      }

      console.log(
        `Successfully deleted lecturer with registration number: ${registrationNumber}`
      );
      res.status(200).send("Lecturer deleted successfully");
    });
  } catch (error) {
    console.error("Error deleting lecturer:", error);
    res.status(500).send("Internal Server Error");
  }
});

//----------------------------- Registration Start Data ---------------------------------

server.post(
  "/api/Registration_Start_Data/started_semester_registration",
  (req, res) => {
    const {
      semester,
      department,
      batch,
      registration_started_date,
      registration_end_date,
      filteredSubjects,
      // Other relevant data you want to receive from the frontend
    } = req.body;

    try {
      // Check if data already exists in the database
      const checkQuery = `
      SELECT COUNT(*) AS count
      FROM started_semester_registration
      WHERE semester = ? AND department_code = ? AND batch_name = ?
    `;
      db.query(
        checkQuery,
        [semester, department, batch],
        (checkErr, checkResult) => {
          if (checkErr) {
            console.error("Error checking existing data:", checkErr);
            return res.status(500).send("Internal Server Error");
          }

          // If data already exists, return an error
          if (checkResult[0].count > 0) {
            return res.status(400).json({
              message:
                "Data already exists for this semester, department, and batch",
            });
          }

          // Prepare the data for bulk insertion
          const bulkInsertData = filteredSubjects.map((subject) => [
            semester,
            department,
            batch,
            subject.subject_code,
            subject.subject_name,
            subject.credit,
            subject.subject_type,
            registration_started_date,
            registration_end_date,
          ]);

          // Construct the bulk insert query
          const bulkInsertQuery = `
        INSERT INTO started_semester_registration 
        (semester, department_code, batch_name, subject_code, subject_name, credit, subject_type, registration_start_date, registration_end_date) 
        VALUES ?
      `;

          // Execute the bulk insert query
          db.query(bulkInsertQuery, [bulkInsertData], (err, result) => {
            if (err) {
              console.error("Error starting registration:", err);
              return res.status(500).send("Internal Server Error");
            }

            console.log("Registration started successfully");
            res
              .status(201)
              .json({ message: "Registration started successfully" });
          });
        }
      );
    } catch (error) {
      console.error("Error handling registration:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

server.get(
  "/api/Registration_Start_Data/list_started_semester_registration",
  (req, res) => {
    try {
      const query = `
      SELECT batch_name, department_code, semester, 
             MIN(registration_start_date) AS registration_start_date, 
             MAX(registration_end_date) AS registration_end_date
      FROM started_semester_registration
      GROUP BY batch_name, department_code, semester;
    `;
      db.query(query, (err, result) => {
        if (err) {
          console.error(
            "Error retrieving started semester registrations:",
            err
          );
          return res.status(500).send("Internal Server Error");
        }

        res.status(200).json(result);
      });
    } catch (error) {
      console.error("Error handling registration:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

server.post(
  "/api/Registration_Start_Data/delete_started_semester_registration",
  (req, res) => {
    try {
      const { batch_name, department_code, semester } = req.body;

      const query = `
      DELETE FROM started_semester_registration
      WHERE batch_name = ? AND department_code = ? AND semester = ?;
    `;

      db.query(
        query,
        [batch_name, department_code, semester],
        (err, result) => {
          if (err) {
            console.error("Error deleting started semester registration:", err);
            return res.status(500).send("Internal Server Error");
          }

          res.status(200).send("Data deleted successfully");
        }
      );
    } catch (error) {
      console.error("Error handling registration deletion:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//------------------------- AR Office Profile Part -------------------------------------

server.post("/api/ar_office_profile/add_profile", (req, res) => {
  try {
    const { profileName, universityEmail, password, position, date, time } =
      req.body;

    // Check if universityEmail already exists in the database
    const checkQuery = `
      SELECT * FROM profile
      WHERE university_email = ?;
    `;

    db.query(checkQuery, [universityEmail], (checkError, checkResults) => {
      if (checkError) {
        console.error(
          "Error checking for existing university email:",
          checkError
        );
        return res.status(500).send("Internal Server Error");
      }

      if (checkResults.length > 0) {
        // If universityEmail already exists, update the corresponding profile data
        const updateQuery = `
          UPDATE profile
          SET profile_name = ?, password = ?, position = ?, last_update_date = ?, last_pdate_time = ?
          WHERE university_email = ?;
        `;

        db.query(
          updateQuery,
          [profileName, password, position, date, time, universityEmail],
          (updateError, updateResult) => {
            if (updateError) {
              console.error("Error updating profile:", updateError);
              return res.status(500).send("Internal Server Error");
            }

            res.status(200).send("Profile updated successfully");
          }
        );
      } else {
        // If universityEmail doesn't exist, insert a new entry with the provided profile data
        const insertQuery = `
          INSERT INTO profile (profile_name, university_email, password, position, last_update_date, last_pdate_time)
          VALUES (?, ?, ?, ?, ?, ?);
        `;

        db.query(
          insertQuery,
          [profileName, universityEmail, password, position, date, time],
          (insertError, insertResult) => {
            if (insertError) {
              console.error("Error adding profile:", insertError);
              return res.status(500).send("Internal Server Error");
            }

            res.status(200).send("Profile added successfully");
          }
        );
      }
    });
  } catch (error) {
    console.error("Error handling profile addition:", error);
    res.status(500).send("Internal Server Error");
  }
});

server.get("/api/ar_office_profile/all_profile_date", (req, res) => {
  // Fetch all batches from the batch table
  const query =
    "SELECT `profile_name`, `university_email`, `position`, `last_update_date`, `last_pdate_time` FROM `profile` WHERE 1";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching batches:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // console.log("Batches fetched successfully");
    res.status(200).json(result);
  });
});

// Endpoint for user login
server.post("/api/login/main_login", (req, res) => {
  const { university_email, password } = req.body;

  // Query to check if the user exists in the database
  const query = `SELECT * FROM profile WHERE university_email = ? AND password = ?`;
  db.query(query, [university_email, password], (err, result) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Check if any rows were returned
    if (result.length === 0) {
      // User not found or invalid credentials
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // User found, send success response
    const { profile_name, university_email, position, profile_photo } =
      result[0];

    res.status(200).json({
      success: true,
      profile_name,
      university_email,
      position,
      profile_photo,
    });
  });
});

server.post("/api/profile/save_profile_photo", (req, res) => {
  const { university_email, cropped_image } = req.body;

  // Update profile photo in the database
  const query =
    "UPDATE `profile` SET `profile_photo`=? WHERE `university_email`=?";
  db.query(query, [cropped_image, university_email], (err, result) => {
    if (err) {
      console.error("Error updating profile photo:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    //console.log(cropped_image);
    // Profile photo updated successfully
    console.log("Profile photo updated successfully");
    res.status(200).json({ message: "Profile photo updated successfully" });
  });
});

server.get("/api/profile/get_profileData", (req, res) => {
  const universityEmail = req.query.universityEmail;
  const position = req.query.position;

  /* console.log(
    `universityEmail = ${universityEmail} and position = ${position}`
  );*/

  let query; // Declare the query variable here

  if (position == "Student") {
    query = `
          SELECT profile.profile_name, profile.profile_photo,
          student.address, student.tp_number, student.student_name
          FROM profile INNER JOIN student ON profile.university_email = student.email WHERE profile.university_email = ${db.escape(
            universityEmail
          )}
      `;
  } else if (position === "Lecturer" || position === "Head of Department") {
    query = `
          SELECT profile.profile_name, profile.profile_photo,
          lecturer.address, lecturer.tp_number, lecturer.lecturer_name
          FROM profile INNER JOIN lecturer ON profile.university_email = lecturer.email WHERE profile.university_email = ${db.escape(
            universityEmail
          )}
      `;
  }

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const responseData = {
      profileName: results[0].profile_name,
      address: results[0].address,
      tpNumber: results[0].tp_number,
      profilePhoto: results[0].profile_photo,
    };

    // Conditionally include lecturer_name based on position
    if (position === "Lecturer" || position === "Head of Department") {
      responseData.lecturerName = results[0].lecturer_name;
    } else {
      responseData.studentName = results[0].student_name;
    }

    res.status(200).json(responseData);
  });
});

server.post("/api/profile/update_profile_data", (req, res) => {
  const {
    university_email,
    profile_name,
    address,
    tp_number,
    password,
    position,
  } = req.body;

  // Validation checks
  if (
    !profile_name ||
    !address ||
    !tp_number ||
    tp_number.length !== 10 ||
    !position
  ) {
    console.error("Profile data is incomplete or invalid.");
    return res
      .status(400)
      .json({ error: "Profile data is incomplete or invalid." });
  }

  // Prepare the SQL query and values for updating profile data
  let profileQuery;
  let profileValues;
  if (password) {
    // If a new password is provided, update the password in the table
    profileQuery = `
      UPDATE profile
      SET profile_name = ?, password = ?
      WHERE university_email = ?
    `;
    profileValues = [profile_name, password, university_email];
  } else {
    // If no new password is provided, keep the old password in the table
    profileQuery = `
      UPDATE profile
      SET profile_name = ?
      WHERE university_email = ?
    `;
    profileValues = [profile_name, university_email];
  }

  // Prepare the SQL query and values for updating student or lecturer data based on position
  let updateQuery;
  let updateValues;
  if (position === "Student") {
    updateQuery = `
      UPDATE student
      SET address = ?, tp_number = ?
      WHERE email = ?
    `;
  } else if (position === "Lecturer" || position === "Head of Department") {
    updateQuery = `
      UPDATE lecturer
      SET address = ?, tp_number = ?
      WHERE email = ?
    `;
  } else {
    console.error("Invalid position:", position);
    return res.status(400).json({ error: "Invalid position" });
  }
  updateValues = [address, tp_number, university_email];

  // Perform database transactions
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Update profile data
    db.query(profileQuery, profileValues, (err, profileResult) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error updating profile data:", err);
          res.status(500).json({ error: "Internal server error" });
        });
      }

      // Update student or lecturer data
      db.query(updateQuery, updateValues, (err, updateResult) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error updating", position, "data:", err);
            res.status(500).json({ error: "Internal server error" });
          });
        }

        // Commit transaction if all updates succeed
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error committing transaction:", err);
              res.status(500).json({ error: "Internal server error" });
            });
          }

          console.log("Profile and", position, "data updated successfully");
          res
            .status(200)
            .json({ message: "Profile and data updated successfully" });
        });
      });
    });
  });
});

//-------------------------------- registered_semester_data Table
server.post("/api/registered_semester_data/submit_data", async (req, res) => {
  try {
    // Log the request body
    console.log("Request Body:", req.body);

    // Extract data from the request body
    const {
      student_registration_number,
      subjects,
      semester,
      department,
      date,
    } = req.body;

    // Check if a record with the same student_registration_number and semester already exists
    const checkQuery = `
      SELECT * FROM registered_semester_data
      WHERE student_registration_number = ? AND semester = ?
    `;

    db.query(
      checkQuery,
      [student_registration_number, semester],
      async (err, rows) => {
        if (err) {
          console.error("Error checking for existing record:", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        // If a record exists, delete it
        if (rows.length > 0) {
          const deleteQuery = `
          DELETE FROM registered_semester_data
          WHERE student_registration_number = ? AND semester = ?
        `;

          db.query(
            deleteQuery,
            [student_registration_number, semester],
            async (err, result) => {
              if (err) {
                console.error("Error deleting existing record:", err);
                res.status(500).json({ error: "Internal server error" });
                return;
              }

              console.log("Existing record deleted successfully");

              // Insert new records for each subject
              await insertNewRecords(
                student_registration_number,
                subjects,
                semester,
                department,
                date,
                res
              );
            }
          );
        } else {
          // Insert new records for each subject
          await insertNewRecords(
            student_registration_number,
            subjects,
            semester,
            department,
            date,
            res
          );
        }
      }
    );
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error submitting data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function insertNewRecords(
  student_registration_number,
  subjects,
  semester,
  department,
  date,
  res
) {
  const insertQuery = `
    INSERT INTO registered_semester_data 
    (student_registration_number, subject_code, subject_name, semester,department, date) 
    VALUES (?, ?, ?, ?, ?,?)
  `;

  // Loop through each subject and execute the insert query
  for (const subject of subjects) {
    await new Promise((resolve, reject) => {
      db.query(
        insertQuery,
        [
          student_registration_number,
          subject.code,
          subject.name,
          semester,
          department,
          date,
        ],
        (err, result) => {
          if (err) {
            console.error("Error inserting record:", err);
            reject(err);
          } else {
            console.log("Record inserted successfully");
            resolve(result);
          }
        }
      );
    });
  }

  // Respond with success message
  res.status(200).json({ message: "Data submitted successfully" });
}

// Endpoint to fetch registered subjects on previous semesters
server.get(
  "/api/student/semester_registration/all_subjects_registered_previous_semesters",
  (req, res) => {
    const { student_registration_number } = req.query;
    const sql =
      "SELECT `subject_code`,`subject_name`, `semester`, `date`, `approve`, comment FROM `registered_semester_data` WHERE `student_registration_number` = ?";

    db.query(sql, [student_registration_number], (err, results) => {
      if (err) {
        console.error("Error fetching subjects:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        const subjectCodes = results.map(result => result.subject_code);
        let numberArray = []; // Initialize numberArray as an empty array
        let sum = 0;
      
        subjectCodes.forEach(subjectCode => {
          const numbers = subjectCode.match(/\d+/g); // Extract numbers using a regular expression
          if (numbers) {
            numberArray.push(...numbers); // Push extracted numbers into numberArray
          }
        });
      
        for (let i = 0; i < numberArray.length; i++) {
          sum += parseInt(numberArray[i][1]); // Add the second character of each number to the sum
        }
      
        // Include the sum in the response JSON object
        const responseObject = {
          results: results,
          sum: sum
        };
      
        res.json(responseObject);
      }
      
    });
  }
);

// Endpoint to fetch subject names and credits based on subject codes
server.get(
  "/api/student/semester_registration/all_subjects_registered_previous_semesters/subject_names",
  (req, res) => {
    const subjectCodes = req.query.subjectCodes.split(","); // Split subject codes from query parameter

    console.log(subjectCodes);
    const sql =
      "SELECT `subject_name`, `credit` FROM `subject` WHERE `subject_code` IN (?)";

    db.query(sql, [subjectCodes], (err, results) => {
      if (err) {
        console.error("Error fetching subject names:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json(results);
        console.log(results);
      }
    });
  }
);

//----------------------- Approve ---------------
// Assuming you have already configured your express app and connected to the database

// Endpoint to fetch registration data based on department
server.get("/api/api/lecturerData/list_data_for_approve", async (req, res) => {
  try {
    const department = req.query.department;
    console.log("Department:", req.query.department);

    const query = `
      SELECT DISTINCT  rs.student_registration_number, s.student_index_number, rs.semester, rs.comment
      FROM registered_semester_data rs
      JOIN student s ON rs.student_registration_number = s.student_registration_number
      WHERE rs.department = ?  AND rs.approve = 0;
    `;
    // Assuming db is your database connection
    db.query(query, [department], (err, result) => {
      if (err) {
        console.error("Error retrieving registration data:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Error handling registration:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to fetch student data and profile photo using registration number
server.get("/api/approve/view_more/getstudentData", async (req, res) => {
  try {
    const registrationNumber = req.query.registrationNumber;
    const query = `
      SELECT s.student_name, s.batch, s.email, p.profile_photo
      FROM student s
      LEFT JOIN profile p ON s.email = p.university_email
      WHERE s.student_registration_number = ?;
    `;
    // Assuming db is your database connection
    db.query(query, [registrationNumber], (err, result) => {
      if (err) {
        console.error("Error retrieving student details:", err);
        return res.status(500).send("Internal Server Error");
      }

      if (result.length > 0) {
        const studentData = result[0];
        const profilePhoto = studentData.profile_photo;
        // Check if profile photo exists
        if (profilePhoto) {
          // Send profile photo data as base64 string
          const base64Image = profilePhoto.split(",")[1];
          res.status(200).json({ ...studentData, profile_photo: base64Image });
        } else {
          res.status(200).json(studentData); // No profile photo available
        }
      } else {
        res.status(404).send("Student not found"); // No student data found
      }
    });
  } catch (error) {
    console.error("Error handling student details:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to fetch subject data based on student registration number
server.get("/api/approve/view_more/getSubjectData", async (req, res) => {
  try {
    const registrationNumber = req.query.registrationNumber;
    const query = `
      SELECT  subject_code, subject_name
      FROM registered_semester_data
      WHERE student_registration_number = ? AND approve = 0;
    `;
    // Assuming db is your database connection
    db.query(query, [registrationNumber], (err, result) => {
      if (err) {
        console.error("Error retrieving subject data:", err);
        return res.status(500).send("Internal Server Error");
      }

      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Error handling subject data:", error);
    res.status(500).send("Internal Server Error");
  }
});

server.post("/api/approve/view_more/approveRegistration", async (req, res) => {
  try {
    const { registrationNumber } = req.body;
    const query = `
      UPDATE registered_semester_data
      SET approve = 1
      WHERE student_registration_number = ?;
    `;
    // Assuming db is your database connection
    db.query(query, [registrationNumber], (err, result) => {
      if (err) {
        console.error("Error updating registration:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).send("Registration approved successfully.");
    });
  } catch (error) {
    console.error("Error handling registration approval:", error);
    res.status(500).send("Internal Server Error");
  }
});

server.post("/api/approve/view_more/rejectRegistration", async (req, res) => {
  try {
    const { registrationNumber, comment, semester } = req.body;
    const query = `
      UPDATE registered_semester_data
      SET approve = 0, comment= ?
      WHERE student_registration_number = ? AND semester= ?;
    `;
    // Assuming db is your database connection
    db.query(query, [comment, registrationNumber, semester], (err, result) => {
      if (err) {
        console.error("Error updating registration:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).send("Registration approved successfully.");
    });
  } catch (error) {
    console.error("Error handling registration approval:", error);
    res.status(500).send("Internal Server Error");
  }
});

server.post("/api/approve/view_more/logApproval", async (req, res) => {
  try {
    const {
      registrationNumber,
      semester,
      lecUniEmail,
      approvalType,
      comment,
      date,
    } = req.body;

    const query = `
      INSERT INTO approved_log (student_registration_number, semester, lecturer_email, approval_type, comment, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [registrationNumber, semester, lecUniEmail, approvalType, comment, date],
      (err, result) => {
        if (err) {
          console.error("Error logging approval:", err);
          return res.status(500).send("Internal Server Error");
        }
        res.status(200).send("Approval logged successfully.");
      }
    );
  } catch (error) {
    console.error("Error logging approval:", error);
    res.status(500).send("Internal Server Error");
  }
});
