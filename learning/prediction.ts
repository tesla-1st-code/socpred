import { Team } from "../models/team";
import { Feature } from "../models/feature";
import { League } from "../models/league";
import { mean } from 'lodash';
import { StatisticHelper } from "../helpers/statistic";
import { DataHelper } from "../helpers/data";

export class Prediction {
    constructor() {}

    async predict() {
        
    }

    private async run(homeId: number, awayId: number, prefix: string) {
        let homeFeature = await Feature.findOne({ where:{ teamId: homeId}});
        let awayFeature = await Feature.findOne({ where:{ teamId:awayId}});
        let data = DataHelper.getSeasonData(prefix);

        let meanHomeGoal = mean(data.map(e => parseInt(e['FTHG'])));
        let meanAwayGoal = mean(data.map(e => parseInt(e['FTAG'])));

        let homeProb = homeFeature.toJSON().hgr * awayFeature.toJSON().acr * meanHomeGoal;
        let awayProb = awayFeature.toJSON().agr * homeFeature.toJSON().hcr * meanAwayGoal;

        let scoreRanges = [0, 1, 2, 3, 4, 5, 6];
      
        let homeScores = [];
        let awayScores = [];
    
        for (let i=0; i < scoreRanges.length; i++) {
            homeScores.push({score: i, probability: StatisticHelper.calculatePoisson(i, homeProb)});
            awayScores.push({score: i, probability: StatisticHelper.calculatePoisson(i, awayProb)});
        }   

        let homeWins = 0;
        let awayWins = 0;
        let draw = 0;

        for (let i=0; i<scoreRanges.length; i++) {
            for (let j=0; j<scoreRanges.length; j++) {
                console.log(`${i}-${j} = ${Math.round((homeScores[i].probability * awayScores[j].probability)*100)}%`);

                if (i > j) {
                    homeWins += (homeScores[i].probability * awayScores[j].probability)*100;
                }

                else if (i < j) {
                    awayWins += (homeScores[i].probability * awayScores[j].probability)*100;
                }

                else {
                    draw += (homeScores[i].probability * awayScores[j].probability)*100;
                }
            }
        }

        console.log(`Home = ${Math.round(homeWins)}%, Away =  ${Math.round(awayWins)}%, Draw =  ${Math.round(draw)}%`);

        return {hs: homeScores, as: awayScores, wld: {home: homeWins, away: awayWins, draw: draw}};
    }
}