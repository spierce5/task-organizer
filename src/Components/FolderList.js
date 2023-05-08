import React, { useEffect, useState, useCallback } from "react";
import { deleteFolder } from "./Firebase";
import ContextMenu from "./Common/ContextMenu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  ListItemAvatar,
  Button,
  Typography,
} from "@mui/material";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

export default function FolderList({
  folders,
  handleClick,
  SELECT_FOLDER,
  currentFolder,
  setCurrentFolder,
}) {
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);
  const [contextMenuAnchor, setContextMenuAnchor] = useState(null);

  const toastId = React.useRef(null);

  const dismissToast = () => {
    toast.dismiss(toastId.current);
  };

  // TODO implement contexst menu for folders
  const handleRightClick = useCallback(
    (e) => {
      e.preventDefault();
      const target = e.currentTarget;
      const folder = target.id;
      setContextMenuAnchor(target);
      setContextMenuIsOpen(true);
      setCurrentFolder(folder);
    },
    [setContextMenuAnchor, setContextMenuIsOpen, setCurrentFolder]
  );

  const handleDelete = useCallback(() => {
    console.log(currentFolder);
    deleteFolder(currentFolder).then(() => {
      setCurrentFolder(null);
    });
    dismissToast();
  }, [currentFolder, setCurrentFolder]);

  const confirmDelete = useCallback(() => {
    //TODO: add confirm delete box so user is aware all tasks will be deleted
    // deleteFolder(currentFolder);
    setContextMenuIsOpen(false);
    dismissToast();
    toast(
      <div className="w-full h-max">
        <Typography variant="h6" color="red">
          Folder and all tasks will be deleted. Would you like to continue?
        </Typography>
        <Button onClick={handleDelete}>Confirm</Button>
        <Button onClick={dismissToast}>Cancel</Button>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
      }
    );
  }, [handleDelete]);

  return (
    folders &&
    Object.keys(folders).map((folder, idx) => (
      <ListItem key={idx} className="w-full">
        <ListItemButton
          id={folder}
          divider={true}
          onClick={(e) => {
            handleClick(e, SELECT_FOLDER);
          }}
          onContextMenu={handleRightClick}
          className="w-full"
        >
          <ListItemAvatar>
            <Avatar>
              <FolderOpenOutlinedIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={folder} />
        </ListItemButton>
        <ContextMenu
          type="folder"
          open={contextMenuIsOpen}
          handleClose={() => setContextMenuIsOpen(false)}
          handleEdit={() => console.log("edit folder")}
          handleDelete={confirmDelete}
          anchorEl={contextMenuAnchor}
        />
      </ListItem>
    ))
  );
}
