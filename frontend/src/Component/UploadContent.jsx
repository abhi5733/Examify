import React, { useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import axios from 'axios';
import Tesseract from 'tesseract.js';
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  Spinner,
  useToast,
} from '@chakra-ui/react';

// Configure the worker
GlobalWorkerOptions.workerSrc = `/node_modules/pdfjs-dist/build/pdf.worker.mjs`;

function UploadContent() {
  const [file, setFile] = useState(null);
  const [previewText, setPreviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mcqs, setMcqs] = useState([]);
  const toast = useToast();

  const apiKey = import.meta.env.VITE_API_KEY; // Fetch the API Key from .env

  // Extract text from PDF
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
      setFile(text); // Store extracted text
    } catch (err) {
      setError('Failed to extract text from the PDF.');
    }
  };

  // Handle file selection and extraction
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();

    if (!uploadedFile) {
      setError('No file uploaded.');
      return;
    }

    setError('');
    const reader = new FileReader();

    if (fileExtension === 'pdf') {
      reader.onload = (e) => {
        const pdfData = new Uint8Array(e.target.result);
        extractTextFromPDF(pdfData);
      };
      reader.readAsArrayBuffer(uploadedFile);
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const mammoth = await import('mammoth');
        mammoth
          .extractRawText({ arrayBuffer })
          .then((result) => {
            setPreviewText(result.value.slice(0, 1000));
            setFile(result.value);
          })
          .catch(() => setError('Failed to extract text from Word document.'));
      };
      reader.readAsArrayBuffer(uploadedFile);
    } else if (fileExtension === 'txt') {
      reader.onload = (e) => {
        const text = e.target.result;
        setPreviewText(text.slice(0, 1000));
        setFile(text);
      };
      reader.readAsText(uploadedFile);
    } else if (fileExtension === 'jpg' || fileExtension === 'png') {
      reader.onload = (e) => {
        const imageData = e.target.result;
        Tesseract.recognize(imageData, 'eng')
          .then(({ data: { text } }) => {
            setPreviewText(text.slice(0, 1000));
            setFile(text);
          })
          .catch(() => setError('Failed to extract text from image.'));
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setError('Unsupported file type. Please upload a PDF, Word document, text, or image file.');
    }
  };

  // Submit to generate MCQs
  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a file first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:7300/generate-mcqs', { text: file });

      if (response.status === 200) {
        setMcqs(response.data.mcqs);
        toast({ title: 'MCQs generated successfully.', status: 'success', duration: 3000 });
      } else {
        setError('Failed to generate MCQs.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating MCQs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="60%" m="auto" p={6} bg="gray.100" borderRadius="md" boxShadow="md">
      <Heading textAlign="center" mb={4}>
        Upload Notes and Generate MCQs
      </Heading>
      <VStack spacing={4}>
        <Input type="file" accept=".doc,.docx,.pdf,.txt,.jpg,.png" onChange={handleFileChange} />
        {previewText && (
          <Box p={4} bg="white" borderRadius="md" border="1px solid gray" w="full" maxH="200px" overflow="auto">
            <Text fontSize="sm" color="gray.700">
              {previewText}
            </Text>
          </Box>
        )}
        {isLoading ? (
          <Spinner />
        ) : (
          <Button onClick={handleSubmit} colorScheme="blue" w="full">
            Generate MCQs
          </Button>
        )}
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
      {mcqs.length > 0 && (
        <Box mt={6}>
          <Heading size="md">Generated MCQs:</Heading>
          <VStack mt={4} spacing={3}>
            {mcqs.map((mcq, index) => (
              <Box key={index} p={4} bg="white" borderRadius="md" boxShadow="sm" w="full">
                <Text fontWeight="bold">
                  {index + 1}. {mcq.question}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
}

export default UploadContent;
