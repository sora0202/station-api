import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as _ from "lodash";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { StationFunctions } from "./stations";
import { LineFunctions } from "./lines";
import Station from "./interfaces/Station";
import Line from "./interfaces/Line";
import Company from "./interfaces/Company";
import Join from "./interfaces/Join";
import { Choice, Quiz } from "./interfaces/Quiz";
import Answer from "./interfaces/Answer";
import User from "./interfaces/User";

// APIサーバURLベース
// https://us-central1-stations-api-sora0202.cloudfunctions.net/api

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const MESSAGES: { [s: string]: string } = {
  NOT_FOUND: "Not Found",
  MISS_PARAMETER: "Count parameter is miss.",
};

admin.initializeApp();
const db: admin.database.Database = admin.database();
const stationFunctions: StationFunctions = new StationFunctions(db);
const lineFunctions: LineFunctions = new LineFunctions(db);

const app: express.Express = express();
// 全APIでCORS許可
app.use(cors());
// リクエストボディをjsonに変換する
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

    try {
      const stations: {
        [s: string]: Station;
      } = await stationFunctions.fetchRandomStations(Number(req.query.count));

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
    try {
      const line: Line = await lineFunctions.fetchLine(Number(req.params.id));

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

    try {
      const lines: { [s: string]: Line } = await lineFunctions.fetchRandomLines(
        Number(req.query.count)
      );

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

async function fetchChoice(station: Station): Promise<Choice> {
  const CHOICE_COUNT = 4;

  try {
    const answer: Line = await lineFunctions.fetchLine(station.line_cd);
    const randomLines: {
      [s: string]: Line;
    } = await lineFunctions.fetchRandomLines(CHOICE_COUNT - 1);
    const others: Line[] = Object.values(randomLines);

    console.log("others:");
    const choice: Line[] = [answer, ...others];

    return {
      station_cd: station.station_cd,
      choice: _.shuffle(choice),
    } as Choice;
  } catch (error) {
    throw error;
  }
}

router.get("/quiz", async (req: express.Request, res: express.Response) => {
  console.log("GET /quiz");
  if (!req.query.count) {
    console.error("Miss Paramter.");
    res.status(400).send({ msg: MESSAGES.MISS_PARAMETER });
    return;
  }

  try {
    const stations: {
      [s: string]: Station;
    } = await stationFunctions.fetchRandomStations(Number(req.query.count));

    if (!stations) {
      res.status(404).send({ msg: MESSAGES.NOT_FOUND });
      return;
    }

    const promises = _.map(stations, fetchChoice);
    const choices = await Promise.all(promises);

    if (!choices) {
      console.error("Not Found choices.");
      res.status(404).send({ msg: MESSAGES.NOT_FOUND });
      return;
    }

    const quiz: { [s: string]: Quiz } = _.mapValues(stations, (s: Station) => {
      return {
        question: s,
        choice: _.find(choices, (c) => c.station_cd === s.station_cd),
      } as Quiz;
    });

    res.status(200).send(quiz);
    console.error("GET /quiz end");
  } catch (error) {
    console.error("GET /quiz error");
    console.error(error);
    res.status(500).send(error);
  }
});

router.post("/answer", async (req: express.Request, res: express.Response) => {
  console.log("POST /answer");

  if (Object.keys(req.body).length === 0) {
    console.error("POST /answer MISS_PARAMETER");
    res.status(400).send({ msg: MESSAGES.MISS_PARAMETER });
    return;
  }

  const answer: Answer = req.body as Answer;
  const resBody = {} as {
    is_correct: Boolean;
    answer?: Line;
  };

  try {
    if (answer.question.line_cd === answer.answer.line_cd) {
      resBody.is_correct = true;
    } else {
      resBody.is_correct = false;
      resBody.answer = await lineFunctions.fetchLine(answer.question.line_cd);
    }
    res.status(200).send(resBody);
    console.log("POST /answer end");
  } catch (error) {
    console.error("POST /answer error");
    console.error(error);
    res.status(500).send(error);
  }

  try {
    const ref: admin.database.Reference = admin.database().ref("answers");
    ref.push({
      station_cd: answer.question.station_cd,
      line_cd: answer.answer.line_cd,
      is_correct: resBody.is_correct,
    });
  } catch (error) {
    console.error("POST /answer error");
    console.error(error);
  }
});

router.post("/users", async (req: express.Request, res: express.Response) => {
  console.log("POST /users");

  if (Object.keys(req.body).length === 0) {
    console.error("POST /users MISS_PARAMETER");
    res.status(400).send({ msg: MESSAGES.MISS_PARAMETER });
    return;
  }

  const user: User = req.body as User;
});
app.use(router);

export const api = functions.https.onRequest(app);
