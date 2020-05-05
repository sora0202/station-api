import express from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// TODO: データから全件数を取得するようにする。
// const LINE_COUNT = 617;

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// TODO: Expressっぽくかけるかも?
// https://firebase.google.com/docs/functions/http-events?hl=ja

admin.initializeApp();
// const db = admin.database();

const app: express.Express = express();
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");
    next();
  }
);

const router: express.Router = express.Router();

router.get("/helloWorld", (req: express.Request, res: express.Response) => {
  res.status(200).send("Hello from Firebase!");
});

app.use(router);

export const api = functions.https.onRequest(app);
