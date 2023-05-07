//import { db } from '../firebase-config';
import {
  ref,
  set,
  update,
  onValue,
  get,
  child,
  getDatabase,
  goOffline,
  remove,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const createUserData = (userInfo) => {
  let db = getDatabase();

  let dbRef = ref(db, "users/");
  update(dbRef, {
    [userInfo.uid]: {
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      email: userInfo.email,
    },
  });
};

export const getUserData = (setUserData, setLoaded) => {
  let currentUser = sessionStorage.getItem("Uid");
  let data = {};

  let db = getDatabase();
  let reference = ref(db, "users/" + currentUser);
  onValue(
    reference,
    (snapshot) => {
      if (snapshot) {
        data = snapshot.val();
        setUserData(data);
        setLoaded(false);
      }
    },
    (error) => console.log("Error: " + error.code)
  );

  return data;
};

export const addFolder = (folders, folderName) => {
  let currentUser = sessionStorage.getItem("Uid");
  let db = getDatabase();
  if (folders.length > 0) {
    let ref1 = ref(db, "users/" + currentUser + "/folders/");

    if (!folders.includes(folderName)) {
      update(ref1, {
        [folderName]: getDefaultTask(getNewTaskId()),
      });
    } else {
      toast.error("Folder name is already in use");
    }
  } else {
    let ref2 = ref(db, "users/" + currentUser);

    update(ref2, {
      folders: {
        [folderName]: getDefaultTask(getNewTaskId()),
      },
    });
  }
};

export const addTask = async (folder, timeStamp) => {
  let currentUser = sessionStorage.getItem("Uid");
  let db = getDatabase();

  let reference = ref(db, "users/" + currentUser + "/folders/" + folder + "/");

  let newTaskId = getNewTaskId();
  return await update(reference, getDefaultTask(newTaskId)).then(() => {
    return newTaskId;
  });
};

const getDefaultTask = (taskId) => {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1).toString()
      : (date.toMonth() + 1).toString();
  const day =
    date.getDate() < 10
      ? "0" + date.getDate().toString()
      : date.getDate().toString();

  return {
    [taskId]: {
      short_description: "",
      priority: "Medium",
      due_date: year + "-" + month + "-" + day,
    },
  };
};

const getNewTaskId = () => {
  return (
    Date.now() * Math.floor(Math.random() * 100) +
    Math.floor(Math.random() * 100)
  );
};

export const updateTask = async (folder, id, task) => {
  let currentUser = sessionStorage.getItem("Uid");
  let db = getDatabase();

  let reference = ref(db, "users/" + currentUser + "/folders/" + folder + "/");

  await update(reference, {
    [id]: task,
  });
};

export const deleteTask = async (folder, id) => {
  let currentUser = sessionStorage.getItem("Uid");
  let db = getDatabase();

  let reference = ref(
    db,
    "users/" + currentUser + "/folders/" + folder + "/" + id
  );
  remove(reference).then(() => console.log("Task " + id + " removed"));
};

export const deleteFolder = async (folder) => {
  let currentUser = sessionStorage.getItem("Uid");
  let db = getDatabase();

  let reference = ref(db, "users/" + currentUser + "/folders/" + folder);
  remove(reference).then(() =>
    toast.success('Folder "' + folder + '" was removed')
  );
};
