import firebase from 'firebase/compat/app';
import { db, storage } from "../../firebase";

export function addCase(uid, name) {
    return new Promise((resolve, reject) => {
        const casesRef = db.ref(`/cases/${uid}`);
        const newCaseRef = casesRef.push();
        newCaseRef.set({
            name,
            caseId: newCaseRef.key,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        })
    })
}

export function deleteCase(uid, caseId) {
    return new Promise((resolve, reject) => {
        const caseRef = db.ref(`/cases/${uid}/${caseId}`);
        caseRef.remove((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        })
    })
}

export function uploadCaseFile(uid, caseId, file) {
    return new Promise((resolve, reject) => {
        const caseDbRef = db.ref(`/cases/${uid}/${caseId}/files`);
        const newFileRef = caseDbRef.push();
        newFileRef.set({
            name: file.name,
            fileId: newFileRef.key
        }, (error) => {
            if (error) {
                reject(error);
            } else {
                const storageRef = storage.ref();
                const caseRef = storageRef.child(`${uid}/${caseId}/${newFileRef.key}`);
                caseRef.put(file).then((snapshot) => {
                    // update firebase database
                    const config = {
                        uid,
                        caseId,
                        fileId: newFileRef.key,
                    }
                    console.log(config);
                    fetch(`/api/addCaseFile`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(config)
                    }).then((response) => {
                        resolve(response);
                    }).catch((error) => {
                        reject(error);
                    })
                }).catch((error) => {
                    reject(error);
                })
            }
        })
    })
}

export function deleteFile(uid, caseId, fileId) {
    return new Promise((resolve, reject) => {
        const caseDbRef = db.ref(`/cases/${uid}/${caseId}/files/${fileId}`);
        caseDbRef.remove((error) => {
            if (error) {
                reject(error);
            } else {
                const storageRef = storage.ref();
                const caseRef = storageRef.child(`${uid}/${caseId}/${fileId}`);
                caseRef.delete().then(() => {
                    resolve();
                }).catch((error) => {
                    reject(error);
                })
            }
        })
    })
}

export function sendMessage(uid, caseId, message) {
    return new Promise((resolve, reject) => {
        const config = {
            uid,
            caseId,
            message
        }

        fetch(`/api/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        }).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        })
    })
}