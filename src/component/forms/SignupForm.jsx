import React, { useEffect, useState } from 'react';
import './signupForm.css';
import { Avatar, Grid, Paper, TextField, Typography, Button, InputLabel } from '@material-ui/core';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Select from 'react-dropdown-select';
import axios from 'axios';
import { Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import { errorMessages } from '../message/message.js';
import { BASE_URL,ENDPOINTS } from '../Endpoints/endpoints.js';

// Styles for Material-UI components
const paperStyle = { padding: '30px 20px', width: '300px', margin: '20px auto' }
const headerStyle = { margin: '0px' }
const avatarStyle = { backgroundColor: 'green' }
const selectStyle = { margin: '5px 0px' }
const submitButton = { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0px', }

// Options for user type selection dropdown
const options = [
    { value: "researcher",label: "Researcher" },
    { value: "investor", label: "Investor" },
    { value: "institution_staff", label: "Institutuion Staff" },
    { value: "service_provider", label: "Service Provider" },
]
const errorMessageStyle={color:'red'}

// Main component for the signup form
export const SignupForm = () => {
    // State variables initialization
    const initialFormValues  = { firstName: "", lastName: "", username: "", email: "", password: "" ,userType:"",confirmPassword:""}
    const [formValues, setFormValues] = useState(initialFormValues );
    const [formErrors, setFormErrors] = useState({});
    const [selectedValue, setSelectedValue] = useState("");
    const [isSubmit, setIsSubmit] = useState(false);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    //endpoints
    const signupEndpoint = `${BASE_URL}${ENDPOINTS.SIGNUP}`;
    // Function to handle input change
    const handleChange=(e)=>{
        console.log(e.target);
        const {name,value}=e.target;
        setFormValues({...formValues,[name]:value});
        console.log(formValues);
    }
    // Function to handle form submission
    const handleSubmit=(e)=>{
        e.preventDefault();
        setFormErrors(validate(formValues))
        setIsSubmit(true);
    }
     // Function to handle dropdown selection
    const handleSelect=(selectedOptions) => {
        setSelectedValue(selectedOptions.length > 0 ? selectedOptions[0].value : null);
        initialFormValues.userType=selectedOptions[0];
      };
    
      // Effect hook to handle form submission
    useEffect( ()=>{
        console.log(formErrors);
        if(Object.keys(formErrors).length === 0 && isSubmit){
            console.log(formValues,selectedValue);
            let signupData={
                user_type :selectedValue,
                first_name:formValues.firstName,
                last_name:formValues.lastName,
                username:formValues.username,
                email:formValues.email,
                password:formValues.password
            }
            console.log(JSON.stringify(signupData));
            saveData(signupData);
            
            
        }
    },[formErrors])
    // Function to send signup data to the server
    const saveData=async(signupData)=>{
        try {
            const response = await axios.post(signupEndpoint,signupData,{
              headers: {
                'Content-Type': 'application/json'
              }
            });
            handleSuccess(response.data.message);
            console.log('Response data:', response.data);
          } catch (error) {
            setError(error.response.data);
            handleError(error.response.data);
            console.error(error.response.data);
          }
    }
    // Function to validate form input fields
    const validate=(values)=>{
        const errors={};
        const regex=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if(!values.firstName){
            errors.firstName=errorMessages.firstName;
        }
        if(!values.lastName){
            errors.lastName=errorMessages.lastName;
        }
        if(!values.username){
            errors.username=errorMessages.username;
        }
        if(!values.email){
            errors.email=errorMessages.email;
        }else if(!regex.test(values.email)){
            errors.email=errorMessages.invalidEmail;
        }
        if(!values.password){
            errors.password=errorMessages.password;
        }
        if(!values.confirmPassword){
            errors.confirmPassword=errorMessages.confirmPassword;
            
        }
        else if(values.password !==values.confirmPassword){
            errors.passwordNotMatch=errorMessages.passwordMismatch;   
        }
        if(!selectedValue){
            errors.userType=errorMessages.userType;
        }
        return errors;
    }

    // Function to handle success response from the server
    const handleSuccess = (message) => {
        setAlertType('success');
        setAlertMessage(message);
        setShowAlert(true);
      };
    // Function to handle error response from the server
      const handleError = (message) => {
        setAlertType('error');
        setAlertMessage(message);
        setShowAlert(true);
      };
      // Custom Alert component
      function CustomAlert({ type, message }) {
        return (
          <Alert icon={type === 'success' ? <CheckIcon fontSize="inherit" /> : <ErrorIcon fontSize="inherit" />}
                 severity={type}>
            {message}
          </Alert>
        );
      }
      // Rendering the signup form
    return (
        <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><AddCircleIcon></AddCircleIcon></Avatar>
                    <h2 style={headerStyle}>Signup</h2>
                    {showAlert && <CustomAlert type={alertType} message={alertMessage} />}
                    <Typography variant='caption' gutterBottom>Fill this form to create an account!</Typography>
                </Grid>
                <form onSubmit={handleSubmit}>
                    <Grid>
                        <InputLabel >User Type</InputLabel>
                        <Select options={options} style={selectStyle} onChange={handleSelect}></Select>
                        <span style={errorMessageStyle }>{formErrors.userType}</span>
                    </Grid>
                    <TextField fullWidth label='First Name*' name='firstName' value={formValues.firstName} onChange={handleChange}></TextField>
                    <span style={errorMessageStyle }>{formErrors.firstName}</span>
                    <TextField fullWidth label='Last Name*' name='lastName' value={formValues.lastName} onChange={handleChange}></TextField>
                    <span style={errorMessageStyle }>{formErrors.lastName}</span>
                    <TextField fullWidth label='Username*' name='username' value={formValues.username} onChange={handleChange}></TextField>
                    <span style={errorMessageStyle }>{formErrors.username}</span>
                    <TextField fullWidth label='Email*' name='email' value={formValues.email} onChange={handleChange}></TextField>
                    <span style={errorMessageStyle }>{formErrors.email}</span>
                    <TextField fullWidth label='Password*' type='password' name='password' value={formValues.password} onChange={handleChange}></TextField>
                    <span style={errorMessageStyle }>{formErrors.password}</span>
                    <TextField fullWidth label='Confirm Password*' type='password' name='confirmPassword' value={formValues.confirmPassword} onChange={handleChange}></TextField>
                    <span style={errorMessageStyle }>{formErrors.confirmPassword}</span>
                    <span style={errorMessageStyle }>{formErrors.passwordNotMatch}</span>
                    <div style={submitButton}>
                        <Button type='submit' variant='contained' align='center' color='primary'>Sign up</Button>
                    </div>
                </form>
            </Paper>
        </Grid>
    )
}
