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

  let reference2 = ref(db, "users/" + currentUser + "/folders/");

  if (!folders.includes(folderName)) {
    update(reference2, {
      [folderName]: getDefaultTask(),
    });
  } else {
    toast.error("Folder name is already in use");
  }
};

export const addTask = (folder, timeStamp) => {
  let currentUser = sessionStorage.getItem("Uid");
  let db = getDatabase();

  let reference = ref(db, "users/" + currentUser + "/folders/" + folder + "/");

  update(reference, getDefaultTask());
};

const getDefaultTask = () => {
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
    [Date.now()]: {
      short_description: "",
      priority: "Medium",
      due_date: year + "-" + month + "-" + day,
    },
  };
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
