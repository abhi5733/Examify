import { Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const DisplayMcq = ({ data, setShow, setData }) => {


  const [index, setIndex] = useState(0)
  const [result, setResult] = useState(false)
  const [scores, setScores] = useState(0)
  const toast = useToast()

  // To update the answer selected in array
  const handleAnswerClick = (e) => {
    console.log(e.target.dataset.value)
    const value = e.target.dataset.value
    setData((prevData) => {
      const updateData = [...prevData];
      updateData[index] = { ...updateData[index], myAnswer: value };
      return updateData;
    })

    console.log(data)

  }

  // Displaying and calculating result

  const showResult = () => {

    const score = data.reduce((acc, curr) => {
      if (curr.answer == curr.myAnswer) {
        return acc + 1
      }
      return acc;
    }, 0)

    console.log(score);
    setScores(score)
    setResult(true);
  }

  // Save Mcq function 

  const saveMcq = async () => {

    try {
      const response = await axios.post("http://localhost:7300/protected/saveMcq", data, // The request body
        {
          headers: {
            Authorization: localStorage.getItem("tokens"),
          },
        })

      toast({
        description: "Mcq saved sucessfully",
        status: 'success',
        position: "top",
        duration: 2000,
        isClosable: true,
      }) ;
      setShow((prev)=>!prev) ;
      console.log(response) ;

    } catch (err) {

      console.log(err) ;

      toast({
        description: err?.response?.data?.msg,
        status: 'error',
        position: "top",
        duration: 2000,
        isClosable: true,
      })

    }
  }


  return (
    <Box m={"auto"} mt={"10px"} borderRadius={"10px"} p={"10px"} bgColor={"whiteAlpha.800"} w={["90%", "90%", "50%", "50%"]}  >
      {result ? <Box >
        <Heading fontSize={"lg"}>Results</Heading>
        <Text mt={"10px"} fontSize={"lg"} >Your Score : {scores}</Text>
        <Flex justifyContent={"space-between"}  mt={"10px"}> <Button bgColor={"pink"} onClick={() => setResult(false)} >Go Back</Button>  <Button  bgColor={"pink"} onClick={saveMcq} >Save</Button>   </Flex>
      </Box> : <Box fontSize={"20px"} >
        <Heading mt={"10px"} fontSize={"lg"}>Generated MCQs:</Heading>

        <Text mt={"10px"} key={index}>{data[index].question}</Text>
        <Flex flexDirection={["column", "column", "row", "row"]} onClick={handleAnswerClick} mt={"10px"}  >
          <Box w={["100%", "100%", "50%", "50%"]}  >
            <Text w={"90%"} p={["2px 10px", "2px 10px", "2px 10px", "2px 10px"]} bgColor={data[index]?.myAnswer == data[index].options[0] ? "blue" : "white"}
              color={data[index]?.myAnswer == data[index].options[0] ? "white" : ""} borderRadius={"50px"}
              data-value={data[index].options[0]} >A : {data[index].options[0]}</Text>
            <Text w={"90%"} p={"2px 10px"} mt={"20px"} bgColor={data[index]?.myAnswer == data[index].options[1] ? "blue" : "white"}
              color={data[index]?.myAnswer == data[index].options[1] ? "white" : ""} borderRadius={"50px"}
              data-value={data[index].options[1]}>B : {data[index].options[1]}</Text>
          </Box>
          <Box mt={["20px", "20px", "0px", "0px"]} w={["100%", "100%", "50%", "50%"]}  >
            <Text w={"90%"} p={"2px 10px"} bgColor={data[index]?.myAnswer == data[index].options[2] ? "blue" : "white"}
              color={data[index]?.myAnswer == data[index].options[2] ? "white" : ""} borderRadius={"50px"}
              data-value={data[index].options[2]}>C : {data[index].options[2]}</Text>
            <Text w={"90%"} p={"2px 10px"} mt={"20px"} bgColor={data[index]?.myAnswer == data[index].options[3] ? "blue" : "white"}
              color={data[index]?.myAnswer == data[index].options[3] ? "white" : ""} borderRadius={"50px"}
              data-value={data[index].options[3]}>D : {data[index].options[3]}</Text>
          </Box>
        </Flex>

        <Flex mt={"20px"} justifyContent={"space-between"} > <Button onClick={() => setShow(false)} bgColor={"pink"} >Back To Home</Button>
          <Button bgColor={"pink"} isDisabled={index === 0} onClick={() => setIndex(prev => prev - 1)} >Prev</Button>
          <Button bgColor={"pink"} onClick={() => { index == data.length - 1 ? showResult() : setIndex(prev => prev + 1) }} >{index == data.length - 1 ? "Show Result" : "Next"}</Button>
        </Flex>

      </Box>}

    </Box>
  )
}

export default DisplayMcq