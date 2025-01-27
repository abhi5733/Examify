import React, { useEffect, useState } from 'react';
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
  Flex,
} from '@chakra-ui/react';


import DisplayMcq from './DisplayMcq';
import bgImg from "../assets/bgImg.webp"
import { useSelector } from 'react-redux';
import LoginSignup from './LoginSignup';


// Configure the worker
GlobalWorkerOptions.workerSrc =  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js" ;
// "/node_modules/pdfjs-dist/build/pdf.worker.mjs"

// "./assets/pdf.worker.mjs"
//  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
// /node_modules/pdfjs-dist/build/pdf.worker.mjs
function UploadContent() {
  const [file, setFile] = useState(null);
  const [previewText, setPreviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mcqs, setMcqs] = useState([]);
  const toast = useToast();
  const [show, setShow] = useState(false) // to display mcq component
  const Login = useSelector((store) => store.login)

  useEffect(() => {

    if (mcqs?.length > 0) {
      setShow(true)
      console.log("show")
    }

  }, [mcqs])


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
      const response = await axios.post(`${import.meta.env.VITE_URL}/generate-mcqs`, { text: file });

      if (response.status === 200) {

        setMcqs(response.data.mcqs);
        toast({ title: 'MCQs generated successfully.', status: 'success',  position: "top",
          duration: 2000,
          isClosable: true,});
        console.log(response, "response")
        const mcqs = response.data.mcqs;
        console.log(mcqs, "mcqs")
        if (mcqs?.length > 0) {
          // Set the generated MCQs in the state
          setMcqs(mcqs);
          // setShow(true)

        }


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

    <Box h={"90vh"} w={"100vw"} bgImage={bgImg} bgSize={"cover"} bgRepeat="no-repeat" bgPosition="center" >
      {/* Display the generated MCQs */}
      {/* <DisplayMcq mcqs={mcqs} setShow={setShow} /> */}
      <Heading p={"20px"} color={"white"} fontSize={["15px", "20px", "30px", "40px"]} textAlign={"center"}  > Welcome to Examify , MCQ generator app</Heading>

      {(mcqs?.length > 0 && show) ? <DisplayMcq data={mcqs} setShow={setShow} setData={setMcqs} /> : !Login ? <LoginSignup /> :

        <Box textAlign={"center"} borderRadius={"10px"} w={["90%", "70%", "50%", "50%"]} m={"auto"}
          mt={"10px"} p={"10px"} bgColor={"whiteAlpha.800"} className="upload-notes-container">
          <Heading fontSize={"20px"} mt={"10px"}>Upload Your Exam Notes ( Pdf , Jpg ,Png , Docs Only )</Heading>

          <Input disabled={!!file} type="file" border={"1px solid black"} w={["51%", "150px", "200px", "200px"]}
            mt={"20px"} accept=".doc,.docx,.pdf,.txt,.jpg,.png" onChange={handleFileChange} />


          {previewText && (
            <Box display={["none", "none", "block", "block"]} className="file-preview">
              <h4>Preview of the uploaded notes:</h4>
              <p>{previewText}</p>
            </Box>
          )}

          <Flex justifyContent={"center"}>

            <Button ml={["", "10px", "20px", "20px"]} mt={["10px", "", "", ""]} w={["50%", "150px", "200px", "200px"]} bgColor={"pink"}
              onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Generating MCQs...' : 'Generate MCQs'}
            </Button >

            <Button display={file ? "block" : "none"} ml={["", "10px", "20px", "20px"]} mt={["10px", "", "", ""]}
              w={["50%", "150px", "200px", "200px"]} bgColor={"pink"} onClick={() => (setFile(null), setPreviewText(""))} disabled={isLoading}>
              Reset
            </Button >
          </Flex>

          {error && <Text className="error">{error}</Text>}


        </Box >}


    </Box>
  );
}

export default UploadContent;
