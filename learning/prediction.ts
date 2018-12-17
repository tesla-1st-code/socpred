import { Team } from "../models/team";
import { Feature } from "../models/feature";
import { League } from "../models/league";
import { mean } from 'lodash';
import { StatisticHelper } from "../helpers/statistic";
import { DataHelper } from "../helpers/data";

export class Prediction {
    constructor() {}

    async run(home: string, away: string) {
        let homeTeam = await Team.findOne({ where: { name: home }, include:[{model: League, as: 'league'}]});
        let awayTeam = await Team.findOne({ where: { name: away }});
        
        let homeFeature = await Feature.findOne({ where:{ teamId: homeTeam.getDataValue('id')}});
        let awayFeature = await Feature.findOne({ where:{ teamId: awayTeam.getDataValue('id')}});
        let data = DataHelper.getSeasonData(homeTeam.toJSON()['league']['prefix']);

        let meanHomeGoal = mean(data.map(e => parseInt(e['FTHG'])));
        let meanAwayGoal = mean(data.map(e => parseInt(e['FTAG'])));

        let homeProb = homeFeature.toJSON().hgr * awayFeature.toJSON().acr * meanHomeGoal;
        let awayProb = awayFeature.toJSON().agr * homeFeature.toJSON().hcr * meanAwayGoal;

        let scoreRanges = [0, 1, 2, 3, 4, 5, 6];
      
        let homeProbs = [];
        let awayProbs = [];
    
        for (let i=0; i < scoreRanges.length; i++) {
            homeProbs.push({score: i, probability: StatisticHelper.calculatePoisson(i, homeProb)});
            awayProbs.push({score: i, probability: StatisticHelper.calculatePoisson(i, awayProb)});
        }   

        let homeWins = 0;
        let awayWins = 0;
        let draws = 0;

        for (let i=0; i<scoreRanges.length; i++) {
            for (let j=0; j<scoreRanges.length; j++) {
                console.log(`${i}-${j} = ${Math.round((homeProbs[i].probability * awayProbs[j].probability)*100)}%`);

                if (i > j) {
                    homeWins += (homeProbs[i].probability * awayProbs[j].probability)*100;
                }

                else if (i < j) {
                    awayWins += (homeProbs[i].probability * awayProbs[j].probability)*100;
                }

                else {
                    draws += (homeProbs[i].probability * awayProbs[j].probability)*100;
                }
            }
        }

        console.log(`Home = ${Math.round(homeWins)}%, Away =  ${Math.round(awayWins)}%, Draw =  ${Math.round(draws)}%`);

        
        return {homeProbabilities: homeProbs, awayProbabilities: awayProbs};
    }
}