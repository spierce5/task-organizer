import React, { useEffect, useState, useCallback } from "react";
import ContextMenu from "./Common/ContextMenu";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function TaskList({
  folder,
  selectTask,
  setCurrentTask,
  editTask,
  handleDeleteTask,
}) {
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);
  const [contextMenuAnchor, setContextMenuAnchor] = useState(null);

  const handleRightClick = useCallback(
    (e) => {
      e.preventDefault();
      const target = e.target;
      const taskId = target.offsetParent.id || target.id;
      setContextMenuAnchor(target);
      setCurrentTask(taskId);
      setContextMenuIsOpen(true);
    },
    [setContextMenuAnchor, setCurrentTask, setContextMenuIsOpen]
  );

  return Object.keys(folder).map((task, idx) => (
    <ListItem key={idx} name="list-item" onContextMenu={(e) => console.log(e)}>
      <ListItemButton
        id={task}
        onClick={selectTask}
        onContextMenu={handleRightClick}
        name="list-item-button"
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
      <ContextMenu
        type="task"
        open={contextMenuIsOpen}
        taskId={task}
        handleClose={() => setContextMenuIsOpen(false)}
        handleEdit={editTask}
        handleDelete={handleDeleteTask}
        anchorEl={contextMenuAnchor}
      />
    </ListItem>
  ));
}
