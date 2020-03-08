import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// TODO: データから全件数を取得するようにする。
const LINE_COUNT = 617;

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();
const db = admin.database();

export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const httpQueryTest = functions.https.onRequest((req, res) => {
    res.send(req.params);
});

export const stations = functions.https.onRequest(async (req, res) => {
    const query = (req.params["0"] === "") ? "stations" : "stations" + req.params["0"];
    const ref = db.ref(query);

    try {
        const data = await ref.once("value");
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(404).send({ msg: "Not Found" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

export const lines = functions.https.onRequest(async (req, res) => {
    const query = (req.params["0"] === "") ? "lines" : "lines" + req.params["0"];
    const ref = db.ref(query);
    const data = await ref.once("value");
    res.send(data);
});

export const companies = functions.https.onRequest(async (req, res) => {
    const query = (req.params["0"] === "") ? "companies" : "companies" + req.params["0"];
    const ref = db.ref(query);
    const data = await ref.once("value");
    res.send(data);
});

export const joins = functions.https.onRequest(async (req, res) => {
    const query = (req.params["0"] === "") ? "joins" : "joins" + req.params["0"];
    const ref = db.ref(query);
    const data = await ref.once("value");
    res.send(data);
});

export const randomLines = functions.https.onRequest(async (req, res) => {
    if (!req.query.count) {
        res.status(400).send({msg: "Count parameter is miss."});
        return;
    }

    const index = Math.floor(Math.random() * LINE_COUNT + 1);
    const ref = db.ref("lines")
        .orderByChild("index")
        .startAt(index)
        .limitToFirst(Number(req.query.count));

    const data = await ref.once("value");
    res.send(data);
});