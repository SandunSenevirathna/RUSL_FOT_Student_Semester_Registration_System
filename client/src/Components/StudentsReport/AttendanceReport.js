import React, { useRef, useEffect } from "react";
import ReactToPrint from "react-to-print";
import styled from "styled-components";

const ReportContainer = styled.div`
  width: 210mm; /* A4 width */
  height: 297mm; /* A4 height */
  margin: 0 auto;
  font-family: Arial, sans-serif;
  position: relative;
  padding: 20px;
  color: black;
`;

const Watermark = styled.div`
  /* Your watermark styles */
`;

const Section = styled.div`
  margin-bottom: -5px;
`;

const SectionHeader = styled.h2`
  font-weight: bold;
  font-size: 30px;
`;

const SectionContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LeftContent = styled.div`
  flex: 1;
`;

const RightContent = styled.div`
  flex: 1;
  text-align: right;
`;

const Line = styled.hr`
  border: 1px solid #dadada;
  width: 100%;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border-radius: 5px;
  overflow: hidden;
`;

const TableCell = styled.td`
  padding: 5px;
  border: 1px solid #cfcfcf;
  text-align: ${(props) => (props.alignLeft ? "left" : "right")};
`;

const SmallHighlightedCell = styled(TableCell)`
  text-align: left;
  width: 45%;
  font-weight: bold;
  background: #ddd;
`;

const MainHighlightedCell = styled(TableCell)`
  text-align: center;
  font-weight: bold;
  background: #ddd;
`;

const AttendanceReport = ({ reportData, shouldPrint }) => {
  const reportContentRef = useRef();
  const reportPrintRef = useRef();

  useEffect(() => {
    if (shouldPrint) {
      reportPrintRef.current.handlePrint();
    }
  }, [shouldPrint]);

  return (
    <ReportContainer ref={reportContentRef}>
      <Watermark />

      <Section>
        <SectionContent>
          <LeftContent>
            <SectionHeader>Signatures Sheet</SectionHeader>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Faculty of Technology
            </p>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Rajarata University of Sri Lanka
            </p>

            <p
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                marginTop: "20px",
              }}
            >
              Lecturer Name:
              .............................................................
            </p>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                marginTop: "10px",
              }}
            >
              Lecture Hall Name:
              .............................................................
            </p>
          </LeftContent>
          <RightContent>
            <Table>
              <tbody>
                <tr>
                  <SmallHighlightedCell>Subject Name:</SmallHighlightedCell>
                  <TableCell>{reportData.subject_name}</TableCell>
                </tr>
                <tr>
                  <SmallHighlightedCell>Subject Code:</SmallHighlightedCell>
                  <TableCell>{reportData.subject_code}</TableCell>
                </tr>
                <tr>
                  <SmallHighlightedCell>Department:</SmallHighlightedCell>
                  <TableCell>{reportData.department}</TableCell>
                </tr>
                <tr>
                  <SmallHighlightedCell>Batch:</SmallHighlightedCell>
                  <TableCell>{reportData.batch}</TableCell>
                </tr>
                <tr>
                  <SmallHighlightedCell>Date:</SmallHighlightedCell>
                  <TableCell>{/* Blank space for date */}</TableCell>
                </tr>
              </tbody>
            </Table>
          </RightContent>
        </SectionContent>
      </Section>

      <Line />

      <Section className="table-section">
        <Table>
          <thead>
            <tr>
              <MainHighlightedCell>Student Registration</MainHighlightedCell>
              <MainHighlightedCell>Student Name</MainHighlightedCell>
              <MainHighlightedCell>Signature</MainHighlightedCell>
            </tr>
          </thead>
          <tbody>
            {reportData.students.map((student, index) => (
              <tr key={index}>
                <TableCell style={{ width: "30%", textAlign: "left" }}>
                  {student.student_registration_number}
                </TableCell>
                <TableCell>{student.student_name}</TableCell>
                <TableCell>{/* Add signature field */}</TableCell>
              </tr>
            ))}
            <tr>
              <TableCell
                colSpan="3"
                style={{ textAlign: "left", fontWeight: "bold" }}
              >
                Total Registered Students: {reportData.students.length}
              </TableCell>
            </tr>
          </tbody>
        </Table>
      </Section>

      {shouldPrint && (
        <ReactToPrint
          trigger={() => <button style={{ display: "none" }}>Print</button>}
          content={() => reportContentRef.current}
          documentTitle="Report"
          copyStyles
          pageStyle={`
            @page {
              size: A4;
              margin: 10mm; /* Adjust margin as needed */
              margin-bottom: 5mm; /* Add a 5mm bottom margin */
              margin-top:6mm; /* Remove top margin */
              @top-center {
                content: ""; /* Clear content at top-center to remove the header */
              }
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .page-break {
                page-break-before: always;
              }
              /* Hide the URL in the bottom left corner */
              @page :left {
                margin-left: 10mm; /* Adjust the left margin as needed */
                content: ""; /* Clear the content in the left margin */
              }
            }
          `}
          onBeforePrint={() => {
            // Add page breaks before each table data section
            const tableSections = document.querySelectorAll(".table-section");
            tableSections.forEach((section, index) => {
              if (index > 0) {
                const pageBreak = document.createElement("div");
                pageBreak.className = "page-break";
                section.before(pageBreak);
              }
            });

            // Add page numbers
            const pageNumbers = document.querySelectorAll(".page-number");
            pageNumbers.forEach((pageNumber, index) => {
              pageNumber.textContent = `Page ${index + 1}`;
            });
          }}
          ref={reportPrintRef}
        />
      )}
    </ReportContainer>
  );
};

export default AttendanceReport;
