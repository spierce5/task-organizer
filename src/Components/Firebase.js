import { db } from '../firebase-config';
import { ref, set, onValue, get, child } from 'firebase/database'
import React, { useEffect, useState } from 'react'

export default function firebase(){
    const dbRef = ref(db);
    
    const currentUser = sessionStorage.getItem('Uid');
    console.log(currentUser);
    const data =    get(child(dbRef, "users/" + currentUser )).then((snapshot) => {
                        if (snapshot.exists()) {
                            let snap = snapshot.val();
                            let email = snap.email;
                            let fn = snap.first_name;
                            let ln = snap.last_name;
                            let folders = snap.folders;
                            console.log(folders);
                            console.log('Email: ' + email + '\nName: ' + fn + ' ' + ln + '\n' + 'Folders: ');
                            Object.keys(folders).forEach(folder => {
                                console.log(folder);
                                Object.keys(folders[folder]).forEach(task => console.log(task + ': ' + folders[folder][task].Short_Description))
                            })
                            
                        } else {
                        console.log("No data available");
                        }
                    }).catch((error) => {
                        console.error(error);
                    });

    return (
        <div>{/*data*/}</div>
    )
}

export const getFolders = () => {
    const currentUser = '';
    const dbRef = ref(db);
    const data = get(child(dbRef, 'users/'+ currentUser)).then((snapshot) => {
        if(snapshot.exists()){
            let snap = snapshot.val();
            let folders = [snap.folders];
            
        }
    })
}