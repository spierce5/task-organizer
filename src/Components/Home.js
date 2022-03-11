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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// Modal
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export default function Home() {
    const [currentFolder, setFolder] = useState();
    const [userData, setData] = useState();
    const [isLoaded, setLoaded] = useState(true);
    // Modal
    const [taskIsOpen, setTaskOpen] = useState(false);
    const handleOpen = () => {
        setTaskOpen(true);
    }
    const handleClose = () => {
        setTaskOpen(false);
    }

    const CREATE_FOLDER = 'CREATE_FOLDER'
    const SELECT_FOLDER = 'SELECT_FOLDER'

    const user = sessionStorage.getItem('Auth Token') ? sessionStorage.getItem('User').replace(/"/g, '') : '';

    let navigate = useNavigate();

    useEffect(() => {
        let authToken = sessionStorage.getItem('Auth Token')
        if (authToken) {
            navigate('/home')
            setLoaded(true);
            getAuth()
            getUserData(setData, setLoaded)
            
        }

        if (!authToken) {
            navigate('/login')
        }
    }, [])

    const getBackdrop = () => {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoaded}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

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
                    <ListItemButton onClick={selectTask}>
                        <AssignmentIcon color='success'sx={{fontSize: 40}}/>
                        <ListItemText fontSize='large' primary={task + ': ' + folder[task].Short_Description} secondary={folder[task].Due_Date ? 'Due: ' + folder[task].Due_Date : 'No due date'}/>
                    </ListItemButton>
                </ListItem>
            )
        }

    }

    const getTaskDetails = () => {
        return (
            <Modal
                open={taskIsOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    height: 600,
                    bgcolor: 'background.paper',
                    opacity: .9,
                    //border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                    <Button 
                        title='Close Task'
                        handleAction={handleClose}
                    />
                </Box>
            </Modal>
      )
    }

    const selectFolder = (e) => {
        setFolder(e.currentTarget.innerText)
    }

    const selectTask = (e) => {
        handleOpen()
    }

    const createFolder = () => {
        console.log('Creating Folder')
        //Add creation functionality
        addFolder(Object.keys(userData.folders),'Cats 2')
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
            {getBackdrop()}
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
            {getTaskDetails()}
            </div>
        </div>
    )
}