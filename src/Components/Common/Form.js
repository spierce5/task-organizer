import * as React from 'react';
import { useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from './Button';
import './Form.css'
import $ from 'jquery';

export default function BasicTextFields({ title, setPassword, setEmail, handleAction, redirect }) {
    const handleKeyDown = (e) => {
        if(e.keyCode == 13){
            //Login
        }
      };
    
      React.useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
    
        // cleanup this component
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

    let signUp;
    if(title == 'Login'){
        signUp = <div><p>Don't have an account? <Button title='Sign Up' variant='text' handleAction={redirect}/></p></div> 
    }
    else if(title == 'Register'){
        signUp = <div><p>Already have an account? <Button title='Sign In' variant='text' handleAction={redirect}/></p></div> 
    }
    
    return (
        <div id='form'>
            <div id='login'>
                <div className="heading-container">
                    <h3>
                        {title == 'Login' ? 'Sign-In' : 'Welcome!'}
                    </h3>
                </div>

                <Box
                    component="form"
                    sx={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContents: 'center',
                        fontWeight: 'bold',
                        padding: '15px',
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        id="email" 
                        label="Email" 
                        variant="standard" 
                        onChange={(e) => setEmail(e.target.value)}    
                    />
                    <TextField 
                        id="password" 
                        label="Password" 
                        variant="standard" 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Box>

                <Button title={title == 'Login' ? title : "Sign Up"}  handleAction={handleAction}/>
                <div>
                    {signUp}
                </div>
            </div>
        </div>
    );
}