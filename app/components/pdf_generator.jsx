import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    margin: '10px 0',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    backgroundColor: '#f2f2f2',
    padding: 8,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 8,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 12,
  },
});

// PDF document component that accepts data and generates a PDF
const PdfDocument = ({ userData, modules }) => (
  <Document>
    <Page style={styles.page}>
      <View>
        <Text style={styles.title}>User Module Information</Text>
        <Text style={styles.text}>Name: {userData.firstName} {userData.lastName}</Text>
        <Text style={styles.text}>Email: {userData.email}</Text>

        {/* Modules Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Module Name</Text>
            <Text style={styles.tableColHeader}>Code</Text>
            <Text style={styles.tableColHeader}>Credits</Text>
            <Text style={styles.tableColHeader}>Leader</Text>
          </View>
          {modules.map(module => (
            <View style={styles.tableRow} key={module.id}>
              <Text style={styles.tableCol}>{module.moduleName}</Text>
              <Text style={styles.tableCol}>{module.moduleCode}</Text>
              <Text style={styles.tableCol}>{module.credits}</Text>
              <Text style={styles.tableCol}>{module.moduleLeader}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default PdfDocument;
