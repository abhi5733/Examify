import { Box, Flex, Text , Button, Divider } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const MyInfo = () => {

    const[data,setData] = useState([])
    const[display,setDisplay] = useState(false)
    const[index,setIndex] = useState(0)
    const[tempIndex,setTempIndex] = useState(0)
    const[score,setScore] = useState(0)


    useEffect(()=>{
        
      const  getData =  async ()=>{
try{

   const data =  await axios.get(`${import.meta.env.VITE_URL}/protected`,  {
        headers: {
          Authorization: localStorage.getItem("tokens"),
        },
      })
      setData(data.data)
      console.log(data,"data")

}catch(err){

    console.log(err)

}
      }

      getData()
    


    },[])


    const handleDisplayQuiz = (ind)=>{

 const scores = data.results[ind].filter(ele =>ele.answer==ele?.myAnswer ).length   

   setScore(scores)
      setDisplay(true)
       setIndex(ind)
    }


  return (
    <Box mt={"10px"}>
        My Info 
       <Text>{`Name : ${data?.name}`} </Text>
       <Text>{`Email : ${data?.email}`} </Text>
   <Divider my={4} borderColor="black" />
   <Text my={"10px"}  fontSize={"25px"} textAlign={"center"}>My Quiz</Text>
        { data?.results?.length>0 ? <Box p={"10px"}><Flex alignItems={["center" , "center","",""]} flexDirection={["column","column","row","row"]} justifyContent={"space-between"}> {data.results.map((el,ind)=><Box textAlign={"center"} my={["10px","10px","0px","0px"]} py={"10px"} borderRadius={"10px"} bgColor={"gray.200"} key={ind} w={"200px"}  onClick={()=>{!display?( handleDisplayQuiz(ind)):"" }} >{`Quiz ${ind+1}`}</Box>)} </Flex></Box>:<Box>No Quizzes saved Yet</Box>}
    {/* Display Quiz */}
      {display &&  <Box pos={"fixed"} top={"50%"} left={"50%"} transform={"translate(-50%,-50%)"}  m={"auto"} mt={"10px"} borderRadius={"10px"} p={"10px"} boxShadow={"xl"} bgColor={"gray.100"} w={["90%", "90%", "80%", "60%"]}  > 
      <Flex flexDirection={["column", "column", "row", "row"]}  mt={"10px"} justifyContent={"space-between"}> <Text  key={index}>Q  {tempIndex+1} : {data.results[index][tempIndex].question}</Text> <Text fontWeight={"bold"}>Score : {score}</Text>  </Flex>
        <Flex flexDirection={["column", "column", "row", "row"]}  mt={"10px"}  >
               
              <Box w={["100%", "100%", "50%", "50%"]}  >
                <Text w={"90%"} p={["2px 10px", "2px 10px", "2px 10px", "2px 10px"]} bgColor={data.results[index][tempIndex]?.myAnswer == data.results[index][tempIndex].options[0]?data.results[index][tempIndex].options[0]==data.results[index][tempIndex].answer ? "green" : "red" : data.results[index][tempIndex].options[0]==data.results[index][tempIndex].answer ? "yellow": "white"}
                  color={data.results[index][tempIndex]?.myAnswer == data.results[index][tempIndex].options[0] ? "white" : ""} borderRadius={"50px"}
                  data-value={data.results[index][tempIndex].options[0]} >A : {data.results[index][tempIndex].options[0]}</Text>
                <Text w={"90%"} p={"2px 10px"} mt={"20px"} bgColor={data.results[index][tempIndex]?.myAnswer == data.results[index][tempIndex].options[1]?data.results[index][tempIndex].options[1]==data.results[index][tempIndex].answer ? "green" : "red" : data.results[index][tempIndex].options[1]==data.results[index][tempIndex].answer ? "yellow": "white"}
                  color={data.results[index][tempIndex]?.myAnswer == data.results[index][tempIndex].options[1] ? "white" : ""} borderRadius={"50px"}
                  data-value={data.results[index][tempIndex].options[1]}>B : {data.results[index][tempIndex].options[1]}</Text>
              </Box>
              <Box mt={["20px", "20px", "0px", "0px"]} w={["100%", "100%", "50%", "50%"]}  >
                <Text w={"90%"} p={"2px 10px"} bgColor={data.results[index][tempIndex]?.myAnswer == data.results[index][tempIndex].options[2]?data.results[index][tempIndex].options[2]==data.results[index][tempIndex].answer ? "green" : "red" : data.results[index][tempIndex].options[2]==data.results[index][tempIndex].answer ? "yellow": "white"}
                  color={data.results[index][tempIndex]?.myAnswer == data.results[index][tempIndex].options[2] ? "white" : ""} borderRadius={"50px"}
                  data-value={data.results[index][tempIndex].options[2]}>C : {data.results[index][tempIndex].options[2]}</Text>
                <Text w={"90%"} p={"2px 10px"} mt={"20px"} bgColor={data.results[index][tempIndex]?.myAnswer == data.results[index][tempIndex].options[3]?data.results[index][tempIndex].options[3]==data.results[index][tempIndex].answer ? "green" : "red" : data.results[index][tempIndex].options[3]==data.results[index][tempIndex].answer ? "yellow": "white"}
                  color={data.results[index][tempIndex]?.myAnswer == data.results[index][tempIndex].options[3] ? "white" : ""} borderRadius={"50px"}
                  data-value={data.results[index][tempIndex].options[3]}>D : {data.results[index][tempIndex].options[3]}</Text>
              </Box>
            </Flex>

              <Flex mt={"20px"} justifyContent={"space-between"} > <Button onClick={() =>{setDisplay(false) , setTempIndex(0) } } bgColor={"pink"} >Back</Button>
                      <Button bgColor={"pink"} isDisabled={tempIndex === 0} onClick={() => setTempIndex(prev => prev - 1)} >Prev</Button>
                      <Button display={tempIndex == data.results[index].length - 1?"none":""} bgColor={"pink"} onClick={() => { tempIndex == data.results[index].length - 1 ? "" : setTempIndex(prev => prev + 1) }} >{ tempIndex == data.results[index].length - 1 ? "" : "Next" }</Button>
                    </Flex>

                    </Box>
            
            }
    </Box>
  )
}

export default MyInfo