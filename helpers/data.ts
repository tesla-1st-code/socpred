import { readFileSync } from "fs";

const seasons = ['1718', '1819'];

export class DataHelper {
    static getSeasonData(prefix) {
        let data = [];

        for (let j=0; j<seasons.length; j++) {
            let seasonData = JSON.parse(readFileSync('../data/' + prefix + seasons[j] + '.json').toString());
            data = data.concat(seasonData);
        }

        return data;
    }
}