import express from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Station from "./interfaces/Station";
// import Station from "./interfaces/Station";

// APIサーバURLベース
// https://us-central1-stations-api-sora0202.cloudfunctions.net/api

// TODO: データから全件数を取得するようにする。
// const LINE_COUNT = 617;

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();
const db: admin.database.Database = admin.database();

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

export const httpQueryTest = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");

  res.send(req.params);
});

router.get("/stations", async (req: express.Request, res: express.Response) => {
  const ref: admin.database.Reference = db.ref("stations");

  try {
    const data = await ref.once("value");
    const stations: { [s: string]: Station } = data.val();

    res.status(200).send(stations);

    if (stations) {
      res.status(200).send(stations);
    } else {
      res.status(404).send({ msg: "Not Found" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.use(router);

export const api = functions.https.onRequest(app);
