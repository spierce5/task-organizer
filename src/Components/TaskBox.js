import './TaskBox.css';
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


export default function TaskBox({ isOpen, task, close }) {
    const priorities = ['High', 'Medium', 'Low'];

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
                <Typography id="modal-modal-title" variant="h4" component="h2">
                    {task.short_description}
                </Typography>
                <FormGroup className='form' row='true'>
                    <TextField
                        id="filled-multiline-flexible"
                        select
                        label="Priority"
                        maxRows={1}
                        value={task.priority}
                        variant="filled"
                        className='task-field short-field priority'
                        sx={{margin:'0 10px 0 0', minWidth: '100px'}}
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
                        value={task.due_date}
                        variant="filled"
                        className='task-field short-field due-date'
                        sx={{margin:'0 10px 0 0'}}
                    />
                </FormGroup>
                <TextField
                    id="filled-multiline-flexible"
                    label="Description"
                    maxRows={9}
                    value={task.long_description}
                    variant="filled"
                    multiline
                    className={'task-field long-field'}
                />
                <Tooltip 
                    title='Close' 
                    placement='bottom-end'
                    className='MuiTooltip-tooltip'
                    sx={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px'
                    }}
                >
                    <IconButton 
                        size='small'
                        onClick={close}
                    >
                        <CloseIcon fontSize='small'/>
                    </IconButton>
                </Tooltip>
                <FormControlLabel 
                    className='complete'
                    control={
                        <Checkbox 
                            color='success'
                        />} 
                    label="Complete" />
            </Box>
        </Modal>
    )
}