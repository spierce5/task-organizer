import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData, addFolder, addTask, deleteTask } from "./Firebase";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./Home.css";
import Button from "./Common/Button";
import AppBar from "./Common/AppBar";
import TaskBox from "./TaskBox";
import TaskList from "./TaskList";
import FolderList from "./FolderList";
import {
  List,
  ListSubheader,
  Paper,
  Backdrop,
  CircularProgress,
  IconButton,
  Tooltip,
  Popover,
  TextField,
  Box,
  Stack,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";

export default function Home() {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoaded, setLoaded] = useState(true);
  const [taskIsOpen, setCurrentTaskIsOpen] = useState(false);
  const [editEnabled, setEditEnabled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newFolder, setNewFolder] = useState(null);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  const handleOpen = (task) => {
    setCurrentTask(task);
    setCurrentTaskIsOpen(true);
  };
  const handleClose = () => {
    setCurrentTaskIsOpen(false);
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
      getUserData(setUserData, setLoaded);
    }

    if (!authToken) {
      navigate("/login");
    }
  }, [setUserData, setLoaded, navigate]);

  const editTask = useCallback(() => {
    if (currentTask) {
      setEditEnabled(true);
      setCurrentTaskIsOpen(true);
    } else {
      toast.error("No task selected");
    }
  }, [currentTask, setCurrentTaskIsOpen]);

  const handleDeleteTask = useCallback(() => {
    if (currentTask) {
      if (Object.keys(userData.folders[currentFolder]).length === 1) {
        setCurrentFolder(null);
      }
      deleteTask(currentFolder, currentTask);
    } else {
      toast.error("No task selected");
    }
  }, [userData, currentTask, currentFolder, setCurrentFolder]);

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
    setCurrentFolder(e.currentTarget.innerText);
  };

  const selectTask = useCallback((e) => {
    handleOpen(e.currentTarget.id);
  }, []);

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
    addTask(currentFolder).then((taskId) => {
      setEditEnabled(true);
      handleOpen(taskId);
    });
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
            <List>
              <FolderList
                folders={
                  userData &&
                  userData.hasOwnProperty("folders") &&
                  userData.folders
                }
                handleClick={handleClick}
                SELECT_FOLDER={SELECT_FOLDER}
                currentFolder={currentFolder || null}
                setCurrentFolder={setCurrentFolder}
              />
            </List>
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
              <TaskList
                folder={
                  userData &&
                  userData.hasOwnProperty("folders") &&
                  userData.folders.hasOwnProperty(currentFolder)
                    ? userData.folders[currentFolder]
                    : null
                }
                selectTask={selectTask}
                setCurrentTask={setCurrentTask}
                editTask={editTask}
                handleDeleteTask={handleDeleteTask}
              />
            </List>
          </Paper>
          {getTaskDetails()}
        </div>
      </div>
    </div>
  );
}
