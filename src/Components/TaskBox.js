import './TaskBox.css';
import React, { useEffect, useState } from 'react'
import Button from './Common/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';


export default function TaskBox({ isOpen, task, close, edit=false }) {
    const EDIT = 'EDIT';
    const SAVE = 'SAVE';
    const priorities = ['High', 'Medium', 'Low'];
    const [editing, setEditing] = useState(edit)

    const handleClick = (ID) => {
        switch(ID){
            case SAVE:
            case EDIT:
                setEditing(!editing);
                break;
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box 
                id='task-grid'
                className='task-grid'
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '35vw',
                    height: '60vh',
                    bgcolor: 'background.paper',
                    opacity: .95,
                    //border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                {/* <Typography id="modal-modal-title" variant="h4" component="h2">
                    {task.short_description}
                </Typography> */}
                <TextField
                    id='modal-modal-title'
                    maxRows={1}
                    variant='standard'
                    defaultValue={task.short_description}
                    disabled={!editing}
                    inputProps={{
                        style: {
                            fontSize: 40,
                            fontWeight: 'bold'
                        }
                    }}
                    sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#3d3d3d",
                        },
                    }}
                />
                <FormGroup className='form' row='true'>
                    <TextField
                        id="filled-multiline-flexible"
                        select
                        label="Priority"
                        maxRows={1}
                        default={task.priority}
                        disabled={!editing}
                        variant="filled"
                        className='task-field short-field priority'
                        sx={{
                            margin:'0 10px 0 0',
                             minWidth: '100px',
                             "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#3d3d3d",
                            },
                        }}
                    >
                        {priorities.map( (option) =>  (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                            )
                        )}
                    </TextField>
                    <TextField
                        id="filled-multiline-flexible"
                        label="Due Date"
                        maxRows={4}
                        default={task.due_date}
                        disabled={!editing}
                        variant="filled"
                        className='task-field short-field due-date'
                        sx={{
                            margin:'0 10px 0 0',
                            "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#3d3d3d",
                            },
                        }}
                    />
                </FormGroup>
                <TextField
                    id="filled-multiline-flexible"
                    label="Description"
                    maxRows={9}
                    default={task.long_description}
                    disabled={!editing}
                    variant="filled"
                    multiline
                    className={'task-field long-field'}
                    sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#3d3d3d",
                        },
                    }}
                />
                <Stack
                    className='stack'
                    direction='row'
                >
                    <Tooltip
                        title='Edit'
                        placement='bottom-end'
                        onClick={() => handleClick(EDIT)}
                    >
                        <IconButton
                            disabled={editing}
                        >
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip 
                        title='Close' 
                        placement='bottom-end'
                        className='MuiTooltip-tooltip'

                    >
                        <IconButton 
                            size='small'
                            onClick={close}
                        >
                            <CloseIcon fontSize='small'/>
                        </IconButton>
                    </Tooltip>
                </Stack>
                <FormControlLabel 
                    className='complete'
                    control={
                        <Checkbox 
                            color='success'
                        />} 
                    label="Complete" />
                {editing &&
                <IconButton
                    className='save'
                    onClick={() => setEditing(false)}
                >
                    <SaveOutlinedIcon
                        fontSize='large'
                    />
                </IconButton>
                }
            </Box>
        </Modal>
    )
}