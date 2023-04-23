import "./TaskBox.css";
import React, { useEffect, useState, useCallback } from "react";
import { updateTask } from "./Firebase";
// import Button from "./Common/Button";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Stack,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

export default function TaskBox({
  isOpen,
  task,
  folder,
  id,
  close,
  edit = false,
}) {
  const priorities = ["High", "Medium", "Low"];
  const [editing, setEditing] = useState(edit);
  const [currentTask, setCurrentTask] = useState(task);

  const handleEdit = useCallback(() => {
    setEditing(true);
  }, [setEditing]);

  const handleChange = useCallback(
    (e) => {
      const target = e.target;
      const name = target.name;
      const type = target.type;
      const value = target.value;
      let updatedTask = { ...currentTask };
      if (type === "checkbox") {
        updatedTask[name] = target.checked;
      } else {
        updatedTask[name] = value;
      }

      setCurrentTask(updatedTask);
    },
    [currentTask, setCurrentTask]
  );

  const handleSelect = useCallback(
    (e) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      let updatedTask = { ...currentTask };
      updatedTask[name] = value;
      setCurrentTask(updatedTask);
    },
    [currentTask, setCurrentTask]
  );

  const handleSave = useCallback(
    (e) => {
      console.log(currentTask);
      updateTask(folder, id, currentTask).then(() => {
        setEditing(false);
      });
    },
    [currentTask, setEditing]
  );

  return (
    <Modal
      open={isOpen}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        id="task-grid"
        className=""
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "35vw",
          height: "60vh",
          bgcolor: "background.paper",
          opacity: 0.95,
          //border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* <Typography id="modal-modal-title" variant="h4" component="h2">
                    {task.short_description}
                </Typography> */}
        <TextField
          id="modal-modal-title"
          name="short_description"
          maxRows={1}
          variant="standard"
          value={currentTask.short_description}
          onChange={handleChange}
          disabled={!editing}
          className="name"
          inputProps={{
            style: {
              fontSize: 40,
              fontWeight: "bold",
            },
          }}
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#3d3d3d",
            },
            marginBottom: "5px",
          }}
        />
        <Stack direction="column" spacing={2}>
          <FormGroup className="form" row="true">
            <TextField
              id="filled-multiline-flexible"
              name="priority"
              select
              label="Priority"
              maxRows={1}
              value={currentTask.priority}
              onChange={handleSelect}
              disabled={!editing}
              variant="filled"
              className="task-field short-field priority"
              sx={{
                margin: "0 10px 0 0",
                minWidth: "100px",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#3d3d3d",
                },
              }}
            >
              {priorities.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="filled-multiline-flexible"
              name="due_date"
              label="Due Date"
              maxRows={1}
              value={currentTask.due_date}
              onChange={handleChange}
              disabled={!editing}
              variant="filled"
              className="task-field short-field due-date"
              sx={{
                margin: "0 10px 0 0",
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#3d3d3d",
                },
              }}
            />
          </FormGroup>
          <TextField
            id="filled-multiline-flexible"
            name="long_description"
            label="Description"
            maxRows={9}
            minRows={9}
            value={currentTask.long_description}
            onChange={handleChange}
            disabled={!editing}
            variant="filled"
            multiline
            className={"task-field long-field"}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#3d3d3d",
              },
            }}
          />
          <Stack className="stack" direction="row">
            <Tooltip title="Edit" placement="bottom-end">
              <IconButton name="edit" onClick={handleEdit} disabled={editing}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Close"
              placement="bottom-end"
              className="MuiTooltip-tooltip"
            >
              <IconButton size="small" onClick={close}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack
            direction="row"
            sx={{ width: "100%", justifyContent: "space-between" }}
          >
            <FormControlLabel
              name="complete"
              className="complete"
              control={
                <Checkbox
                  checked={currentTask.complete}
                  disabled={!editing}
                  onChange={handleChange}
                  color="success"
                />
              }
              label="Complete"
            />
            {editing && (
              //   <IconButton className="save" onClick={() => setEditing(false)}>
              //     <SaveOutlinedIcon fontSize="large" />
              //     Save
              //   </IconButton>
              <Button
                name="save"
                className="save"
                variant="outlined"
                onClick={handleSave}
                startIcon={<SaveOutlinedIcon />}
              >
                Save
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
