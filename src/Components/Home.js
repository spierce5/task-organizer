import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserData, addFolder } from './Firebase';
import Button from './Common/Button';
import AppBar from './Common/AppBar';
import './Home.css';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Paper from '@mui/material/Paper';
import { getAuth } from 'firebase/auth'


export default function Home() {
    const [currentFolder, setFolder] = useState();
    const [userData, setData] = useState();
    const CREATE_FOLDER = 'CREATE_FOLDER'
    const SELECT_FOLDER = 'SELECT_FOLDER'

    const user = sessionStorage.getItem('Auth Token') ? sessionStorage.getItem('User').replace(/"/g, '') : '';

    let navigate = useNavigate();

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
        if (authToken) {
            navigate('/home')
            getAuth()
            getUserData(setData)
            
        }

        if (!authToken) {
            navigate('/login')
        }
    }, [])


    const getFolders = () => {
        if(userData){
            return Object.keys(userData.folders).map( (folder, idx) =>   
                            <ListItem key={idx} >
                                <ListItemButton divider={true} onClick={ (e) => {handleClick(e, SELECT_FOLDER)}}>
                                    <ListItemAvatar >
                                        <Avatar >
                                            <FolderOpenOutlinedIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={folder}/>
                                </ListItemButton>
                            </ListItem>)
        }
    }

    const getTasks = () => {
        if(userData && currentFolder){
            let folder = userData.folders[currentFolder];
            return Object.keys(folder).map( (task, idx) => 
                <ListItem key={idx}>
                    <ListItemButton>
                        <AssignmentIcon color='success'sx={{fontSize: 40}}/>
                        <ListItemText fontSize='large' primary={task + ': ' + folder[task].Short_Description} secondary={folder[task].Due_Date ? 'Due: ' + folder[task].Due_Date : 'No due date'}/>
                    </ListItemButton>
                </ListItem>
            )
        }

    }

    const selectFolder = (e) => {
        setFolder(e.currentTarget.innerText)
    }

    const createFolder = () => {
        console.log('Creating Folder')
        //Add creation functionality
        addFolder(Object.keys(userData.folders),'Web Design')
    }

    const handleClick = (e, ID) => {
        switch(ID) {
            case CREATE_FOLDER:
                createFolder(e);
                break;
            case SELECT_FOLDER:
                selectFolder(e)
            default: 
                break;
        }
    }

    return (
        <div className='main'>
            <AppBar className='header' user={user}/>
            <div id='folder-container'> 
            <Paper elevation={8}>
                <ListSubheader component="div" id="nested-list-subheader">
                        Folders
                </ListSubheader>
                <List>
                    {getFolders()}
                    <ListItem   
                        onClick={ (e) => {handleClick(e, CREATE_FOLDER)}}
                        key='9999' 
                        sx={{ 
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                            '&:active': {
                                backgroundColor: 'transparent',
                            }
                        }}
                    >
                        <ListItemButton 
                            disableRipple={true} 
                            sx={{  
                                '&:hover': {
                                backgroundColor: 'transparent',
                                }
                            }}
                        >
                            <ListItemAvatar >
                                <Avatar 
                                    title='Create New Folder' 
                                    sx={{
                                        '&:hover': {
                                            color: 'gray',
                                            border: '2px solid gray',
                                            backgroundColor: 'white',
                                        }
                                    }}
                                >
                                    <CreateNewFolderOutlinedIcon />
                                </Avatar>
                            </ListItemAvatar>
                        </ListItemButton>
                    </ListItem>
                </List>         
            </Paper>
            </div>
            <div id='task-container'>
            <Paper elevation={12}>
                <ListSubheader component="div" id="nested-list-subheader" >
                                {currentFolder ? currentFolder : 'Select a folder'}
                </ListSubheader>
                <List 
                    sx={{
                        overflow: 'auto',
                        height: '70vh',
                        }}
                >
                    {getTasks()}
                </List>
            </Paper>
            </div>
        </div>
    )
}