import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function Home() {
    const [currentFolder, setFolder] = useState('');
    const CREATE_FOLDER = 'CREATE_FOLDER'
    const SELECT_FOLDER = 'SELECT_FOLDER'

    const user = sessionStorage.getItem('Auth Token') ? sessionStorage.getItem('User').replace(/"/g, '') : '';

    let navigate = useNavigate();

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
        if (authToken) {
            navigate('/home')
        }

        if (!authToken) {
            navigate('/login')
        }
    }, [])

    let folders = [
        {
            "folder_name": "Work",
            "Tasks": [
                {
                    "task_name": "Task 1",
                    "Description": "A task",
                    "due_date": "12-01-2022"
                },
                {
                    "task_name": "Task 2",
                    "Description": "Another task",
                    "due_date": "11-01-2022"
                },
                {
                    "task_name": "Task 3",
                    "Description": "Don't forget to read this task",
                    "due_date": "10-01-2022"
                },
                {
                    "task_name": "Task 4",
                    "Description": "Last task",
                    "due_date": "09-01-2022"
                },
                {
                    "task_name": "Task 2",
                    "Description": "Another task",
                    "due_date": "11-01-2022"
                },
                {
                    "task_name": "Task 3",
                    "Description": "Don't forget to read this task",
                    "due_date": "10-01-2022"
                },
                {
                    "task_name": "Task 4",
                    "Description": "Last task",
                    "due_date": "09-01-2022"
                },
                {
                    "task_name": "Task 2",
                    "Description": "Another task",
                    "due_date": "11-01-2022"
                },
                {
                    "task_name": "Task 3",
                    "Description": "Don't forget to read this task",
                    "due_date": "10-01-2022"
                },
                {
                    "task_name": "Task 4",
                    "Description": "Last task",
                    "due_date": "09-01-2022"
                },
                {
                    "task_name": "Task 2",
                    "Description": "Another task",
                    "due_date": "11-01-2022"
                },
                {
                    "task_name": "Task 3",
                    "Description": "Don't forget to read this task",
                    "due_date": "10-01-2022"
                },
                {
                    "task_name": "Task 4",
                    "Description": "Last task",
                    "due_date": "09-01-2022"
                },
                {
                    "task_name": "Task 2",
                    "Description": "Another task",
                    "due_date": "11-01-2022"
                },
                {
                    "task_name": "Task 3",
                    "Description": "Don't forget to read this task",
                    "due_date": "10-01-2022"
                },
                {
                    "task_name": "Task 4",
                    "Description": "Last task",
                    "due_date": "09-01-2022"
                }
            ]
        },
        {
            "folder_name": "Personal",
            "Tasks": [
                {
                    "task_name": "Task 2",
                    "Description": "A task",
                    "due_date": "11-01-2022"
                }
            ]
        }
    ]

    const getTasks = (currentFolderName, folders) => {
        let tasks = [];
        let filteredList = folders.filter( (folder) => folder.folder_name == currentFolder);
        if(filteredList.length > 0){
            let currentFolder = filteredList[0];
            tasks = currentFolder.Tasks.map( (task, idx) => 
                <ListItem key={idx}>
                    <ListItemButton>
                        <AssignmentIcon color='success'sx={{fontSize: 40}}/>
                        <ListItemText fontSize='large' primary={task.task_name + ': ' + task.Description} secondary={'Due ' + task.due_date}/>
                    </ListItemButton>
                </ListItem>
            )
        }
        return tasks;
    }

    const selectFolder = (e) => {
        setFolder(e.currentTarget.innerText)
    }

    const createFolder = () => {
        console.log('Creating Folder')
        //Add creation functionality
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
                    {folders.map( (folder, idx) =>   
                    <ListItem key={idx} >
                        <ListItemButton divider={true} onClick={ (e) => {handleClick(e, SELECT_FOLDER)}}>
                            <ListItemAvatar >
                                <Avatar >
                                    <FolderOpenOutlinedIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={folder.folder_name}/>
                        </ListItemButton>
                    </ListItem>)}
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
                                {currentFolder == '' ? 'Select a folder' : currentFolder}
                </ListSubheader>
                <List 
                    sx={{
                        overflow: 'auto',
                        height: '70vh',
                        }}
                >
                    {getTasks(currentFolder, folders)}
                </List>
            </Paper>
            </div>
{/*
            <div id='session-details'>
                <b>Logged in as:<br/> {user}</b><br/>{' '}<br/>
                <Button variant='text' id='logout' color='error' title='Log out' handleAction={handleLogout}/>
            </div> */}
        </div>
    )
}