import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, addFolder, addTask } from "./Firebase";
import { getAuth } from "firebase/auth";
import "./Home.css";
import Button from "./Common/Button";
import AppBar from "./Common/AppBar";
import TaskBox from "./TaskBox";
import {
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Paper,
  Backdrop,
  CircularProgress,
  IconButton,
  Tooltip,
  DialogTitle,
  Dialog,
  Popover,
  TextField,
  Box,
  Stack,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";

export default function Home() {
  const [currentFolder, setFolder] = useState();
  const [currentTask, setTask] = useState();
  const [userData, setUserData] = useState();
  const [isLoaded, setLoaded] = useState(true);
  const [taskIsOpen, setTaskOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newFolder, setNewFolder] = useState(null);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  const handleOpen = (task) => {
    setTask(task);
    setTaskOpen(true);
  };
  const handleClose = () => {
    setTaskOpen(false);
    setNewTaskOpen(false);
  };

  const CREATE_FOLDER = "CREATE_FOLDER";
  const SELECT_FOLDER = "SELECT_FOLDER";

  const user = sessionStorage.getItem("Auth Token")
    ? sessionStorage.getItem("User").replace(/"/g, "")
    : "";

  let navigate = useNavigate();

  useEffect(() => {
    let authToken = sessionStorage.getItem("Auth Token");
    if (authToken) {
      navigate("/home");
      setLoaded(true);
      getAuth();
      getUserData(setUserData, setLoaded);
    }

    if (!authToken) {
      navigate("/login");
    }
  }, [setUserData, setLoaded, navigate]);

  const getBackdrop = () => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoaded}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };

  const getFolders = () => {
    if (userData && userData.folders) {
      return Object.keys(userData.folders).map((folder, idx) => (
        <ListItem key={idx}>
          <ListItemButton
            divider={true}
            onClick={(e) => {
              handleClick(e, SELECT_FOLDER);
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <FolderOpenOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={folder} />
          </ListItemButton>
        </ListItem>
      ));
    }
  };

  const getTasks = () => {
    if (userData && currentFolder) {
      let folder = userData.folders[currentFolder];
      return Object.keys(folder).map((task, idx) => (
        <ListItem key={idx}>
          <ListItemButton id={task} onClick={selectTask}>
            <AssignmentIcon color="success" sx={{ fontSize: 40 }} />
            <ListItemText
              fontSize="large"
              primary={folder[task].short_description}
              secondary={
                folder[task].due_date
                  ? "Due: " + folder[task].due_date
                  : "No due date"
              }
            />
          </ListItemButton>
        </ListItem>
      ));
    }
  };

  const getTaskDetails = () => {
    if (taskIsOpen) {
      return (
        <TaskBox
          isOpen={taskIsOpen}
          close={handleClose}
          task={userData.folders[currentFolder][currentTask]}
          folder={currentFolder}
          id={currentTask}
          edit={newTaskOpen}
        />
      );
    }
  };

  const selectFolder = (e) => {
    setFolder(e.currentTarget.innerText);
  };

  const selectTask = (e) => {
    handleOpen(e.currentTarget.id);
  };

  const createFolder = () => {
    let folders;
    try {
      folders = Object.keys(userData.folders);
    } catch {
      folders = [];
    }
    addFolder(folders, newFolder);
    setAnchorEl(null);
  };

  const createTask = () => {
    setLoaded(true);
    let timeStamp = Date.now();
    addTask(currentFolder, timeStamp);
    setNewTaskOpen(true);
    handleOpen(timeStamp);
  };

  const handleClick = (e, ID) => {
    switch (ID) {
      case CREATE_FOLDER:
        setAnchorEl(e.currentTarget);
        break;
      case SELECT_FOLDER:
        selectFolder(e);
      default:
        break;
    }
  };

  return (
    <div className="main">
      {getBackdrop()}
      <AppBar className="header" user={user} />
      <div id="folder-container">
        <Paper elevation={8}>
          <ListSubheader component="div" id="nested-list-subheader">
            Folders
            <IconButton
              aria-describedby={id}
              onClick={(e) => {
                handleClick(e, CREATE_FOLDER);
              }}
              size="large"
              sx={{
                position: "absolute",
                top: "5px",
                right: "5px",
              }}
            >
              <Tooltip
                title={<h3>Create New Folder</h3>}
                placement="bottom-end"
                arrow="true"
                enterDelay={1}
                enterTouchDelay={1}
              >
                <CreateNewFolderOutlinedIcon />
              </Tooltip>
            </IconButton>
            {/* Popover to enter folder name*/}
            <Popover
              id={id}
              open={openPopover}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box
                sx={{
                  padding: "5px",
                }}
              >
                <Stack direction="column">
                  <TextField
                    label="Folder Name"
                    variant="filled"
                    onChange={(e) => setNewFolder(e.target.value)}
                    sx={{
                      margin: "0 0 5px 0",
                    }}
                  />
                  <Button
                    handleAction={createFolder}
                    title="Create Folder"
                    color="grey"
                  />
                </Stack>
              </Box>
            </Popover>
          </ListSubheader>
          <List>{getFolders()}</List>
        </Paper>
      </div>
      <div id="task-container">
        <Paper elevation={12}>
          <ListSubheader component="div" id="nested-list-subheader">
            {currentFolder ? currentFolder : "Select a folder"}
            {currentFolder && (
              <Tooltip
                title={<h3>Create New Task</h3>}
                placement="bottom-end"
                arrow="true"
                enterDelay={1}
                enterTouchDelay={1}
              >
                <IconButton
                  onClick={createTask}
                  size="large"
                  sx={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                  }}
                >
                  <PlaylistAddIcon />
                </IconButton>
              </Tooltip>
            )}
          </ListSubheader>
          <List
            sx={{
              overflow: "auto",
              height: "70vh",
            }}
          >
            {getTasks()}
          </List>
        </Paper>
        {getTaskDetails()}
      </div>
    </div>
  );
}
