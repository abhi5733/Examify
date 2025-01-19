import React, { useEffect, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import axios from 'axios';
import { Box, Button, Heading, Input, Text } from '@chakra-ui/react';
import DisplayMcq from './DisplayMcq';
import bgImg from "../assets/bgImg.webp"

// Configure the worker
GlobalWorkerOptions.workerSrc = `/node_modules/pdfjs-dist/build/pdf.worker.mjs`;

function UploadContent() {
  const [file, setFile] = useState(null);
  const [previewText, setPreviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mcqs, setMcqs] = useState([]);
const[show,setShow] = useState(false) // to display mcq component

useEffect(()=>{

if(mcqs.length>0){
setShow(true)
console.log("show")
}

},[mcqs])

  const apiKey = import.meta.env.VITE_API_KEY; // Fetch the API Key from .env

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
      console.log("text", text);
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

  // Handle submit for MCQ generation

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      
      const response = await axios.post('http://localhost:7300/generate-mcqs', {
        text: file, // The extracted text from PDF
      });
  
      if (response.status === 200) {
        const mcqs = response.data.mcqs;
        console.log(mcqs,"mcqs")
        if(mcqs.length>0){
            // Set the generated MCQs in the state
            setMcqs(mcqs);
            // setShow(true)
       
        }
      
      } else {
        setError('Error generating MCQs.');
      }
  
      setIsLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setIsLoading(false);
      setError('An error occurred while generating MCQs.');
    }
  } ;
  



  return (
    <Box h={"90vh"} w={"100vw"} bgImage={bgImg}  bgSize={"cover"}   bgRepeat="no-repeat" bgPosition="center" >
     {/* Display the generated MCQs */}
     {/* <DisplayMcq mcqs={mcqs} setShow={setShow} /> */}
     <Heading p={"20px"} color={"white"} textAlign={"center"}  > Welcome to Examify , MCQ generator app</Heading> 

     { (mcqs.length > 0 && show)? <DisplayMcq data={mcqs} setShow={setShow} setData={setMcqs} />:
     
    <Box textAlign={"center"} borderRadius={"10px"} w={"50%"}  m={"auto"} mt={"10px"} p={"10px"} bgColor={"whiteAlpha.800"} className="upload-notes-container">
      <Heading mt={"10px"}>Upload Your Exam Notes (PDF Only)</Heading>


      <Input
      border={"1px solid black"}
      w={"200px"}
      mt={"20px"}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />

      {previewText && (
        <div className="file-preview">
          <h4>Preview of the uploaded notes:</h4>
          <p>{previewText}</p>
        </div>
      )}

   
      <Button ml={"20px"} bgColor={"pink"} onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Generating MCQs...' : 'Generate MCQs'}
      </Button >

     
      {error && <Text className="error">{error}</Text>}

     
    </Box >} 

    </Box>
  );
}

export default UploadContent;
