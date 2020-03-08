import * as csvtojson from 'csvtojson';
import * as fs from "fs";
import * as _ from 'lodash';

(async () => {
    let stations, lines, companies, joins, output = {};

    stations = await csvtojson().fromFile("./csv/station20200306free.csv");
    const station_count = stations.length;

    lines = await csvtojson().fromFile("./csv/line20200306free.csv");
    const line_count = lines.length;

    companies = await csvtojson().fromFile("./csv/company20200306.csv");
    const company_count = companies.length;

    joins = await csvtojson().fromFile("./csv/join20200306.csv");

    let station_random_indexes = _.range(station_count);
    station_random_indexes = _.shuffle(station_random_indexes);
    stations = stations.reduce((acc, station, index) => {
        station.index = station_random_indexes[index];
        acc[station.station_cd] = station;
        return acc;
    }, {});

    let line_random_indexes = _.range(line_count);
    line_random_indexes = _.shuffle(line_random_indexes);
    lines = _.reduce(lines, (acc, line, index) => {
        line.index = line_random_indexes[index];
        acc[line.line_cd] = line;
        return acc;
    }, {});

    let company_random_indexes = _.range(company_count);
    company_random_indexes = _.shuffle(company_random_indexes);
    companies = companies.reduce((acc, company, index) => {
        company.index = company_random_indexes[index];
        acc[company.company_cd] = company;
        return acc;
    }, {});

    output['stations'] = stations;
    output['lines'] = lines;
    output['companies'] = companies;
    output['joins'] = joins;

    fs.writeFileSync('./data.json', JSON.stringify(output));
})();
