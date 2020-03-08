import * as csvtojson from 'csvtojson';
import * as fs from "fs";

(async () => {
    let stations, lines, companies, joins, output = {};

    stations = await csvtojson().fromFile("./csv/station20200306free.csv");
    lines = await csvtojson().fromFile("./csv/line20200306free.csv");
    companies = await csvtojson().fromFile("./csv/company20200306.csv");
    joins = await csvtojson().fromFile("./csv/join20200306.csv");

    stations = stations.reduce((acc, station) => {
        acc[station.station_cd] = station;
        return acc;
    }, {});
    lines = lines.reduce((acc, line) => {
        acc[line.line_cd] = line;
        return acc;
    }, {});
    companies = companies.reduce((acc, company) => {
        acc[company.company_cd] = company;
        return acc;
    }, {});

    output['stations'] = stations;
    output['lines'] = lines;
    output['companies'] = companies;
    output['joins'] = joins;

    fs.writeFileSync('./data.json', JSON.stringify(output));
})();
