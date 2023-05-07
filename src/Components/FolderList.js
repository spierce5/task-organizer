import React, { useEffect, useState, useCallback } from "react";
import { deleteFolder } from "./Firebase";
import ContextMenu from "./Common/ContextMenu";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

export default function TaskList({ folders, handleClick, SELECT_FOLDER }) {
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);
  const [contextMenuAnchor, setContextMenuAnchor] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);

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
    [setContextMenuAnchor, setContextMenuIsOpen]
  );

  const handleDelete = useCallback(() => {
    //TODO: add confirm delete box so user is aware all tasks will be deleted
    deleteFolder(currentFolder);
  }, [currentFolder]);

  return Object.keys(folders).map((folder, idx) => (
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
        handleDelete={handleDelete}
        anchorEl={contextMenuAnchor}
      />
    </ListItem>
  ));
}
