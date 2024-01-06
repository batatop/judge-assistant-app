import { url } from "../../constants";
import { db } from "../../firebase";

export function getCases(uid) {
    return new Promise((resolve, reject) => {
        const casesRef = db.ref(`${url}/cases/${uid}`);
        casesRef.once("value", (snapshot) => {
            const data = snapshot.val();
            resolve(data)
        }, (error) => {
            reject(error);
        })
    })
}