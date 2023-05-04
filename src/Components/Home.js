import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, addFolder, addTask, deleteTask } from "./Firebase";
import { getAuth } from "firebase/auth";
// import "./Home.css";
import Button from "./Common/Button";
import ContextMenu from "./Common/ContextMenu";
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
  Popper,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";

export default function Home() {
  const [currentFolder, setFolder] = useState();
  const [currentTask, setCurrentTask] = useState();
  const [userData, setData] = useState();
  const [isLoaded, setLoaded] = useState(true);
  const [taskIsOpen, setTaskIsOpen] = useState(false);
  const [editEnabled, setEditEnabled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newFolder, setNewFolder] = useState(null);
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);
  const [contextMenuAnchor, setContextMenuAnchor] = useState(null);
  const anchorRef = React.useRef(null);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  const handleOpen = (task) => {
    setCurrentTask(task);
    setTaskIsOpen(true);
  };
  const handleClose = () => {
    setTaskIsOpen(false);
    setEditEnabled(false);
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
      getUserData(setData, setLoaded);
    }

    if (!authToken) {
      navigate("/login");
    }
  }, []);

  const getFolders = () => {
    if (userData) {
      let folders = userData.folders ? userData.folders : {};
      return Object.keys(folders).map((folder, idx) => (
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

  const handleRightClick = useCallback(
    (e) => {
      e.preventDefault();
      const target = e.target;
      const taskId = target.offsetParent.id;
      console.log(taskId);
      setContextMenuAnchor(target);
      setCurrentTask(taskId);
      setContextMenuIsOpen(true);
    },
    [setContextMenuAnchor, setCurrentTask, setContextMenuIsOpen]
  );

  const editTask = useCallback(() => {
    setEditEnabled(true);
    setTaskIsOpen(true);
    setContextMenuIsOpen(false);
  }, [setTaskIsOpen]);

  const handleDeleteTask = useCallback(() => {
    deleteTask(currentFolder, currentTask);
    setContextMenuIsOpen(false);
  }, [currentTask, currentFolder]);

  const getTasks = () => {
    if (userData && currentFolder) {
      let folder = userData.folders[currentFolder];
      return Object.keys(folder).map((task, idx) => (
        <ListItem key={idx}>
          <ListItemButton
            id={task}
            onClick={selectTask}
            onContextMenu={handleRightClick}
            ref={contextMenuAnchor}
          >
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
          {/* <Popper
            open={contextMenuIsOpen}
            anchorEl={contextMenuAnchor}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          > */}
          <ContextMenu
            open={contextMenuIsOpen}
            taskId={task}
            handleClose={() => setContextMenuIsOpen(false)}
            handleEdit={editTask}
            handleDelete={handleDeleteTask}
            anchorEl={contextMenuAnchor}
          />
          {/* </Popper> */}
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
          edit={editEnabled}
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
    try {
      addFolder(Object.keys(userData.folders), newFolder);
    } catch {
      addFolder(null, newFolder);
    }
    setAnchorEl(null);
  };

  const createTask = () => {
    setLoaded(true);
    let timeStamp = Date.now();
    addTask(currentFolder, timeStamp);
    setEditEnabled(true);
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoaded}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <AppBar className="header" user={user} />
      <div className="md:grid md:grid-cols-[1fr_3fr] m-8 space-x-8 ">
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
    </div>
  );
}
