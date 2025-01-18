import React, { useState } from 'react';
import { getDocument , GlobalWorkerOptions } from 'pdfjs-dist';
//  import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs';

// Configure the worker
GlobalWorkerOptions.workerSrc = `/node_modules/pdfjs-dist/build/pdf.worker.mjs`;
// GlobalWorkerOptions.workerSrc = pdfWorker

function UploadContent() {
  const [file, setFile] = useState(null);
  const [previewText, setPreviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mcqs, setMcqs] = useState([]);

  // Extract text from PDF using pdfjs-dist
  const extractTextFromPDF = async (pdfData) => {

    try {
      const pdfDoc = await getDocument({ data: pdfData }).promise;
    
      let text = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(' ');
        text += pageText + '\n';
      }
      setPreviewText(text.slice(0, 1000)); // Preview first 1000 characters
      setFile(text); // Store the extracted text
      console.log("text",text)
    } catch (err) {
      setError('Failed to extract text from the PDF.');
      console.error('PDF parsing error:', err);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setError('');
      const reader = new FileReader();
      reader.onload = (e) => {
        const pdfData = new Uint8Array(e.target.result);
        extractTextFromPDF(pdfData);
      };
      reader.readAsArrayBuffer(uploadedFile);
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  // Handle submission
  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call for generating MCQs
      const response = await axios.post('/api/upload-notes', { text: file });
      setIsLoading(false);
      setMcqs(response.data.mcqs); // Assuming the API returns MCQs
    } catch (err) {
      setIsLoading(false);
      setError('An error occurred while processing the notes.');
    }
  };

  return (
    <div className="upload-notes-container">
      <h2>Upload Your Exam Notes (PDF Only)</h2>

      {/* File upload input */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />

      {/* Preview of the file */}
      {previewText && (
        <div className="file-preview">
          <h4>Preview of the uploaded notes:</h4>
          <p>{previewText}</p>
        </div>
      )}

      {/* Submit button */}
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Generating MCQs...' : 'Generate MCQs'}
      </button>

      {/* Display error message */}
      {error && <div className="error">{error}</div>}

      {/* Display the generated MCQs */}
      {mcqs.length > 0 && (
        <div className="mcq-preview">
          <h3>Generated MCQs:</h3>
          <ul>
            {mcqs.map((mcq, index) => (
              <li key={index}>{mcq}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UploadContent;
