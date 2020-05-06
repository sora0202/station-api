import Station from "./Station";
import Line from "./Line";

export interface Choice {
  station_cd: number;
  choice: Line[];
}

export interface Quiz {
  question: Station;
  choice: Choice;
}
