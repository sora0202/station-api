import * as admin from "firebase-admin";
import Station from "./interfaces/Station";

// TODO: データから全件数を取得するようにする。
const STATION_COUNT: number = 10853;

export class StationFunctions {
  constructor(private db: admin.database.Database) {}
  /**
   * fetchRandomStations
   */
  public async fetchRandomStations(count: number) {
    const index: number = Math.floor(Math.random() * STATION_COUNT + 1);
    const query: admin.database.Query = this.db
      .ref("stations")
      .orderByChild("index")
      .startAt(index)
      .limitToFirst(count);

    try {
      const data: admin.database.DataSnapshot = await query.once("value");
      const stations: { [s: string]: Station } = data.val();
      return stations;
    } catch (error) {
      throw error;
    }
  }
}
