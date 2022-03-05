import * as React from 'react';
import { useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from './Button';
import './Form.css'
import $ from 'jquery';

export default function BasicTextFields({ title, setPassword, setEmail, handleAction, redirect }) {
    let imageClass = (title == 'Login' ? 'sign-in' : 'register');
    
    const handleKeyDown = (e) => {
        if(e.keyCode == 13){
            //Login
            $( 'Button' ).first().trigger( "click" )
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
        <div id='frame'>        
            <Box
                id="form"
                className={imageClass}
            >
                <Box
                    sx={{
                        backgroundColor: 'white',
                        opacity: .92,
                        padding: '15px',
                        borderRadius: '2px'
                    }}
                >
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
                        <h2>
                            {title == 'Login' ? 'Sign-In' : 'Welcome!'}
                        </h2>
                        <TextField
                            id="email" 
                            label="Email" 
                            variant="outlined" 
                            onChange={(e) => setEmail(e.target.value)}    
                            margin="dense"
                            autoComplete="email"

                        />
                        <TextField 
                            id="password" 
                            label="Password" 
                            variant="outlined" 
                            margin="dense"
                            onChange={(e) => setPassword(e.target.value)}
                            type='password'

                        />
                    </Box>

                    <Button id='submit' title={title == 'Login' ? title : "Sign Up"}  handleAction={handleAction}/>
                    <div>
                        {signUp}
                    </div>
                </Box>
            </Box>
        </div>
        
    );
}