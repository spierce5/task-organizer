import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserData, addFolder } from './Firebase';
import Button from './Common/Button';
import AppBar from './Common/AppBar';
import TaskBox from './TaskBox';
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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';


export default function Home() {
    const [currentFolder, setFolder] = useState();
    const [currentTask, setTask] = useState();
    const [userData, setData] = useState();
    const [isLoaded, setLoaded] = useState(true);
    const [taskIsOpen, setTaskOpen] = useState(false);
    const [newTask, setNewTask] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [newFolder, setNewFolder] = useState(null);

    const handlePopoverClose = () => {
        setAnchorEl(null);
      };
    
      const openPopover = Boolean(anchorEl);
      const id = openPopover ? 'simple-popover' : undefined;

    const handleOpen = (task) => {
        setTask(task);
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
                    <ListItemButton id={task} onClick={selectTask}>
                        <AssignmentIcon color='success'sx={{fontSize: 40}}/>
                        <ListItemText fontSize='large' primary={folder[task].short_description} secondary={folder[task].due_date ? 'Due: ' + folder[task].due_date : 'No due date'}/>
                    </ListItemButton>
                </ListItem>
            )
        }

    }

    const getTaskDetails = () => {
        if(taskIsOpen){
            return (
                <TaskBox 
                    isOpen={taskIsOpen}
                    close={handleClose}
                    task={userData.folders[currentFolder][currentTask]}
                />
            )
        }
    }

    const selectFolder = (e) => {
        setFolder(e.currentTarget.innerText)
    }

    const selectTask = (e) => {
        handleOpen(e.currentTarget.id)
    }

    const createFolder = () => {
        console.log('Creating Folder: ' + newFolder)
        //Add creation functionality
        addFolder(Object.keys(userData.folders), newFolder)
        setAnchorEl(null)
    }

    const createTask = () => {
        setNewTask(true);
    }

    const handleClick = (e, ID) => {
        switch(ID) {
            case CREATE_FOLDER:
                setAnchorEl(e.currentTarget);
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

                    <IconButton 
                    aria-describedby={id}
                    onClick={ (e) => {handleClick(e, CREATE_FOLDER)}}
                    size='large' 
                    sx={{
                        position:'absolute', 
                        top:'5px', 
                        right:'5px'
                        }}
                    >
                        <Tooltip 
                            title={<h3>Create New Folder</h3>}
                            placement='bottom-end' 
                            arrow='true'
                            enterDelay={1}
                            enterTouchDelay={1}
                        >
                            <CreateNewFolderOutlinedIcon/>
                        
                        </Tooltip>
                    </IconButton>
                        {/* Popover to enter folder name*/}
                        <Popover
                            id={id}
                            open={openPopover}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <Box
                                sx={{
                                    padding: '5px'
                                }}
                            >
                                <Stack
                                    direction='column'
                                >
                                    <TextField
                                        label='Folder Name'
                                        variant='filled'
                                        onChange={(e) => setNewFolder(e.target.value)}
                                        sx={{
                                            margin: '0 0 5px 0'
                                        }}
                                    />
                                    <Button
                                        handleAction={createFolder}
                                        title='Create Folder'
                                        color='grey'
                                    />
                                </Stack>
                            </Box>
                        </Popover>
                </ListSubheader>
                <List>
                    {getFolders()}
                </List>         
            </Paper>
            </div>
            <div id='task-container'>
            <Paper elevation={12}>
                <ListSubheader component="div" id="nested-list-subheader" >
                    {currentFolder ? currentFolder : 'Select a folder'}
                    {currentFolder && <Tooltip 
                        title={<h3>Create New Task</h3>}
                        placement='bottom-end' 
                        arrow='true'
                        enterDelay={1}
                        enterTouchDelay={1}
                    >
                        <IconButton 
                        onClick={createTask}
                        size='large' 
                        sx={{
                            position:'absolute', 
                            top:'5px', 
                            right:'5px'
                            }}
                        >
                            <PlaylistAddIcon/>
                        </IconButton>
                    </Tooltip>}
                    <Dialog
                        open={newTask}
                        onClose={() => {setNewTask(false)}}
                    >
                        <DialogTitle>New Task</DialogTitle>
                    </Dialog>
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