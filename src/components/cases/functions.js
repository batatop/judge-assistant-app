import { url } from "../../constants";
import { db, storage } from "../../firebase";

export function addCase(uid, name) {
    return new Promise((resolve, reject) => {
        const casesRef = db.ref(`${url}/cases/${uid}`);
        const newCaseRef = casesRef.push();
        newCaseRef.set({
            name,
            caseId: newCaseRef.key
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
        const caseRef = db.ref(`${url}/cases/${uid}/${caseId}`);
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
        const storageRef = storage.ref();
        const caseRef = storageRef.child(`${uid}/${caseId}/${file.name}`);
        caseRef.put(file).then((snapshot) => {
            resolve(snapshot);
        }).catch((error) => {
            reject(error);
        })
    })
}