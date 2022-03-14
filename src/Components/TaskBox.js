import './TaskBox.css';
import Button from './Common/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function TaskBox({ isOpen, task, close }) {
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
                    width: '42vw',
                    height: '80vh',
                    bgcolor: 'background.paper',
                    opacity: .9,
                    //border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                <Typography id="modal-modal-title" variant="h4" component="h2">
                    {task.short_description}
                </Typography>
                <TextField
                    id="filled-multiline-flexible"
                    label="Priority"
                    maxRows={1}
                    value={task.priority}
                    variant="filled"
                    className='task-field short-field priority' 
                />
                <TextField
                    id="filled-multiline-flexible"
                    label="Due Date"
                    maxRows={4}
                    value={task.due_date}
                    variant="filled"
                    className='task-field short-field due-date'
                />
                <TextField
                    id="filled-multiline-flexible"
                    label="Description"
                    maxRows={6}
                    value={task.long_description}
                    variant="filled"
                    multiline
                    className={'task-field long-field'}
                />
                <Button 
                    title='Close Task'
                    className='close'
                    handleAction={close}
                />
            </Box>
        </Modal>
    )
}