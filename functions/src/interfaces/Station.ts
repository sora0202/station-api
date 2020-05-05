export default interface Station {
  station_cd: number;
  station_g_cd: number;
  station_name: string;
  station_name_k: string;
  station_name_r: string;
  line_cd: number;
  pref_cd: number;
  post: string;
  add: string;
  lon: number;
  lat: number;
  open_ymd: string;
  close_ymd: string;
  e_status: string;
  e_sort: string;
}
