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
      [folderName]: {
        [Date.now()]: {
          short_description: "New Task",
        },
      },
    });
  } else {
    toast.error("Folder name is already in use");
  }
};

export const addTask = (folder, timeStamp) => {
  let currentUser = sessionStorage.getItem("Uid");
  let db = getDatabase();

  let reference = ref(db, "users/" + currentUser + "/folders/" + folder + "/");

  update(reference, {
    [timeStamp]: {
      short_description: "",
    },
  });
};

export const updateTask = async (folder, id, task) => {
  let currentUser = sessionStorage.getItem("Uid");
  let db = getDatabase();

  let reference = ref(db, "users/" + currentUser + "/folders/" + folder + "/");

  await update(reference, {
    [id]: task,
  });
};
