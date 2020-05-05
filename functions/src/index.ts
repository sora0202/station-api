import express from "express";
import * as _ from "lodash";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Station from "./interfaces/Station";
import Line from "./interfaces/Line";
import Company from "./interfaces/Company";
import Join from "./interfaces/Join";

// APIサーバURLベース
// https://us-central1-stations-api-sora0202.cloudfunctions.net/api

// TODO: データから全件数を取得するようにする。
const STATION_COUNT: number = 10853;
const LINE_COUNT: number = 617;

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const MESSAGES: { [s: string]: string } = {
  NOT_FOUND: "Not Found",
  MISS_PARAMETER: "Count parameter is miss.",
};

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
    const data: admin.database.DataSnapshot = await ref.once("value");
    const stations: { [s: string]: Station } = data.val();

    if (stations) {
      res.status(200).send(stations);
    } else {
      res.status(404).send({ msg: MESSAGES.NOT_FOUND });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get(
  "/stations/:id",
  async (req: express.Request, res: express.Response) => {
    const query: string = "stations/" + req.params.id;
    const ref: admin.database.Reference = db.ref(query);

    try {
      const data: admin.database.DataSnapshot = await ref.once("value");
      const station: Station = data.val();

      if (station) {
        res.status(200).send(station);
      } else {
        res.status(404).send({ msg: MESSAGES.NOT_FOUND });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.get(
  "/randomStations",
  async (req: express.Request, res: express.Response) => {
    if (!req.query.count) {
      res.status(400).send({ msg: MESSAGES.MISS_PARAMETER });
      return;
    }

    const index: number = Math.floor(Math.random() * STATION_COUNT + 1);
    const query: admin.database.Query = db
      .ref("stations")
      .orderByChild("index")
      .startAt(index)
      .limitToFirst(Number(req.query.count));

    try {
      const data: admin.database.DataSnapshot = await query.once("value");
      const stations: { [s: string]: Station } = data.val();

      if (stations) {
        res.status(200).send(stations);
      } else {
        res.status(404).send({ msg: MESSAGES.NOT_FOUND });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.get("/lines", async (req: express.Request, res: express.Response) => {
  const ref: admin.database.Reference = db.ref("lines");

  try {
    const data: admin.database.DataSnapshot = await ref.once("value");
    const lines: { [s: string]: Line } = data.val();

    if (lines) {
      res.status(200).send(lines);
    } else {
      res.status(404).send({ msg: MESSAGES.NOT_FOUND });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get(
  "/lines/:id",
  async (req: express.Request, res: express.Response) => {
    const query: string = "lines/" + req.params.id;
    const ref: admin.database.Reference = db.ref(query);

    try {
      const data: admin.database.DataSnapshot = await ref.once("value");
      const line: Line = data.val();

      if (line) {
        res.status(200).send(line);
      } else {
        res.status(404).send({ msg: MESSAGES.NOT_FOUND });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.get(
  "/randomLines",
  async (req: express.Request, res: express.Response) => {
    if (!req.query.count) {
      res.status(400).send({ msg: MESSAGES.MISS_PARAMETER });
      return;
    }

    const index: number = Math.floor(Math.random() * LINE_COUNT + 1);
    const query: admin.database.Query = db
      .ref("lines")
      .orderByChild("index")
      .startAt(index)
      .limitToFirst(Number(req.query.count));

    try {
      const data: admin.database.DataSnapshot = await query.once("value");
      const lines: { [s: string]: Line } = data.val();

      if (lines) {
        res.status(200).send(lines);
      } else {
        res.status(404).send({ msg: MESSAGES.NOT_FOUND });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.get(
  "/companies",
  async (req: express.Request, res: express.Response) => {
    const ref: admin.database.Reference = db.ref("companies");

    try {
      const data: admin.database.DataSnapshot = await ref.once("value");
      const companies: { [s: string]: Company } = data.val();

      if (companies) {
        res.status(200).send(companies);
      } else {
        res.status(404).send({ msg: MESSAGES.NOT_FOUND });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

router.get(
  "/companies/:id",
  async (req: express.Request, res: express.Response) => {
    const query: string = "companies/" + req.params.id;
    const ref: admin.database.Reference = db.ref(query);

    try {
      const data: admin.database.DataSnapshot = await ref.once("value");
      const company: Company = data.val();

      if (company) {
        res.status(200).send(company);
      } else {
        res.status(404).send({ msg: MESSAGES.NOT_FOUND });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.get("/joins", async (req: express.Request, res: express.Response) => {
  const ref: admin.database.Reference = db.ref("joins");

  try {
    const data: admin.database.DataSnapshot = await ref.once("value");
    const joins: { [s: string]: Join } = data.val();

    if (joins) {
      res.status(200).send(joins);
    } else {
      res.status(404).send({ msg: MESSAGES.NOT_FOUND });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get(
  "/joins/:id",
  async (req: express.Request, res: express.Response) => {
    const query: string = "joins/" + req.params.id;
    const ref: admin.database.Reference = db.ref(query);

    try {
      const data: admin.database.DataSnapshot = await ref.once("value");
      const join: Join = data.val();

      if (join) {
        res.status(200).send(join);
      } else {
        res.status(404).send({ msg: MESSAGES.NOT_FOUND });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

app.use(router);

export const api = functions.https.onRequest(app);
