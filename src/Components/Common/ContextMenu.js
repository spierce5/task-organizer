import React, { useEffect, useState, useCallback } from "react";
import {
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

export default function ContextMenu({
  type,
  open,
  anchorEl,
  handleClose,
  handleEdit,
  handleDelete,
}) {
  const handleEditAction = useCallback(() => {
    handleEdit();
    handleClose();
  }, [handleEdit, handleClose]);

  const handleDeleteAction = useCallback(() => {
    handleDelete();
    handleClose();
  }, [handleDelete, handleClose]);

  const types = {
    folder: {
      items: [
        {
          key: "delete",
          text: "Delete Folder",
          action: handleDeleteAction,
          icon: <DeleteForeverIcon fontSize="small" />,
        },
      ],
    },
    task: {
      items: [
        {
          key: "edit",
          text: "Edit Task",
          action: handleEditAction,
          icon: <EditIcon fontSize="small" />,
        },
        {
          key: "delete",
          text: "Delete Task",
          action: handleDeleteAction,
          icon: <DeleteForeverIcon fontSize="small" />,
        },
      ],
    },
  };

  return (
    <Paper sx={{ width: 320, maxWidth: "100%" }}>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        {types[type].items.map((item) => {
          return (
            <MenuItem key={item.key} onClick={item.action}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Paper>
  );
}
