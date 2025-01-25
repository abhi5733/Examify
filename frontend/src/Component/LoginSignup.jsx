import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, Divider, useToast, Flex } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { LoginFunction } from '../redux/action'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginSignup = () => {

  const [toggle, setToggle] = useState(false)

  const [state, setState] = useState({})
  const dispatch = useDispatch()

  const clientID = import.meta.env.VITE_ClientID

  const toast = useToast()
  // handle Form Change

  const handleChange = (e) => {


    const { value, name } = e.target
    setState(prev => ({ ...prev, [name]: value }))

  }

  // handle User Submit

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    console.log(state)
    if (!toggle) {
      console.log(1)
      // handle Sign up function
      try {
        const user = await axios.post("http://localhost:7300/user/register", state)
        console.log(user, "user")
        toast({
          description: "Sign Up successfull",
          status: 'success',
          position: "top",
          duration: 2000,
          isClosable: true,
        })
        setToggle((prev) => !prev)
      } catch (err) {
        console.log(err)
        toast({
          description: err.response.data.msg,
          status: 'error',
          position: "top",
          duration: 2000,
          isClosable: true,
        })
      }

    } else {
      //  handle login function

      try {
        const user = await axios.post("http://localhost:7300/user/login", state)
        console.log(user, "user")
        localStorage.setItem("tokens", user.data.tokens)
        dispatch(LoginFunction())
        setState({})
        toast({
          description: user.data.msg,
          status: 'success',
          position: "top",
          duration: 2000,
          isClosable: true,
        })

      } catch (err) {
        toast({
          description: err.response.data.msg,
          status: 'error',
          position: "top",
          duration: 2000,
          isClosable: true,
        })
        console.log(err)
      }
    }
  }


  return (
    <Box w={["90%", "70%", "50%", "50%"]} bgColor={"whiteAlpha.800"} m={"auto"}>
      {/* Login Box */}
      {toggle ? <Box w={"80%"} m={"auto"} p={"10px"} >


        <form onSubmit={handleUserSubmit}>
          <FormControl isRequired>
            <Heading fontSize={"xl"}>Login Form</Heading>

            <FormLabel mt={5}>Email</FormLabel>
            <Input border={"1px solid black"} type="email" name="email" onChange={handleChange} value={state.email} />

            <FormLabel mt={5}>Password</FormLabel>
            <Input border={"1px solid black"} type="Password" name="password" onChange={handleChange} value={state.password} />

            <Button
              color={"white"}
              _hover={{ bgColor: "pink" }}
              bgColor={"pink.400"}
              type="submit"
              mt={5}
            >
              Login
            </Button>
            <Divider my={4} borderColor="black" />
            <Box mt={"10px"} border={"1px solid black"}  >
              <GoogleOAuthProvider clientId={clientID}>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    // Send the token to your backend
                    const token = credentialResponse.credential;
                    axios
                      .post('http://localhost:7300/user/login', { token })
                      .then((response) => {
                        localStorage.setItem("tokens", response.data.tokens)
                        dispatch(LoginFunction())
                        toast({
                          description: response.data.msg,
                          status: 'success',
                          position: "top",
                          duration: 2000,
                          isClosable: true,
                        })
                        console.log('User logged in:', response.data); // Handle successful login
                      })
                      .catch((error) => {
                        toast({
                          description: error.response.data.msg,
                          status: 'error',
                          position: "top",
                          duration: 2000,
                          isClosable: true,
                        })
                        console.error('Error during Google login:', error.response?.data || error.message); // Handle errors
                      });
                  }}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                />
              </GoogleOAuthProvider>
            </Box>
          </FormControl>
        </form>
        <Divider my={4} borderColor="black" />
        <Button mt={"10px"} color={"white"}
          _hover={{ bgColor: "pink" }}
          bgColor={"pink.400"} onClick={() => setToggle((prev) => !prev)} >SignUp First</Button>

      </Box> :
        // Signup Box
        <Box w={"80%"} m={"auto"} p={"10px"}>

          <form onSubmit={handleUserSubmit}>
            <FormControl isRequired>
              <Heading fontSize={"xl"}>Signup form</Heading>

              <FormLabel mt={5}>Name</FormLabel>
              <Input border={"1px solid black"} type="text" name="name" onChange={handleChange} value={state.name} />

              <FormLabel mt={5}>Email Address</FormLabel>
              <Input border={"1px solid black"} type="email" name="email" onChange={handleChange} value={state.email} />

              <FormLabel mt={5}>Password</FormLabel>
              <Input border={"1px solid black"} type="password" name="password" onChange={handleChange} value={state.password} />

              <Button
                color={"white"}
                _hover={{ bgColor: "pink" }}
                bgColor={"pink.400"}
                type="submit"
                mt={5}
              >
                Signup
              </Button>
            </FormControl>
          </form>
          <Divider my={4} borderColor="black" />

          <Flex justifyContent={"space-between"} mt={"10px"} >  <Button color={"white"}
            _hover={{ bgColor: "pink" }}
            bgColor={"pink.400"} onClick={() => setToggle((prev) => !prev)} >Login</Button>
            <Button color={"white"}
              _hover={{ bgColor: "pink" }}
              bgColor={"pink.400"} ml={"10px"} onClick={() => dispatch(LoginFunction())} >Anonymous Login</Button>
          </Flex>
        </Box>}



    </Box>
  )
}

export default LoginSignup