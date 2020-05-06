import * as admin from "firebase-admin";
import Line from "./interfaces/Line";

// TODO: データから全件数を取得するようにする。
const LINE_COUNT: number = 617;

export class LineFunctions {
  constructor(private db: admin.database.Database) {}
  /**
   * fetchLine
   */
  public async fetchLine(line_cd: number) {
    console.log("fetchLine start");
    const query: string = "lines/" + line_cd;
    const ref: admin.database.Reference = this.db.ref(query);

    try {
      const data: admin.database.DataSnapshot = await ref.once("value");
      const line: Line = data.val();
      console.log("fetchLine end");

      return line;
    } catch (error) {
      throw error;
    }
  }

  /**
   * fetchRandomLines
   */
  public async fetchRandomLines(count: number) {
    console.log("fetchRandomLines start");
    const index: number = Math.floor(Math.random() * LINE_COUNT + 1);
    const query: admin.database.Query = this.db
      .ref("lines")
      .orderByChild("index")
      .startAt(index)
      .limitToFirst(count);

    try {
      const data: admin.database.DataSnapshot = await query.once("value");
      const lines: { [s: string]: Line } = data.val();
      console.log("fetchRandomLines end");

      return lines;
    } catch (error) {
      throw error;
    }
  }
}
