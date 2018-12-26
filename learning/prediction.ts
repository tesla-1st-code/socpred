import { Team } from "../models/team";
import { Feature } from "../models/feature";
import { League } from "../models/league";
import { mean, orderBy } from 'lodash';
import { StatisticHelper } from "../helpers/statistic";
import { DataHelper } from "../helpers/data";
import { Result } from "../models/result";

export class Prediction {
    constructor() {}

    async run(round: number, leagueId: number) {
        let fixtures = await Result.findAll({
            where: { round: round },
            include: [{model: Team, as: 'home', where: { leagueId: leagueId }, include: [{model: League, as: 'league'}]}]
        });

        for (let i=0; i<fixtures.length; i++) {
            let fixture = fixtures[i].toJSON();
            let league = fixture['home']['league'];
            let prediction = await this.getPrediction(fixture.homeId, fixture.awayId, league['prefix']);

            let scoreRanges = [0, 1, 2, 3, 4, 5, 6];
            let scores = [];

            for (let j=0; j<scoreRanges.length; j++) {
                for (let k=0; k<scoreRanges.length; k++) {
                   let homeR = prediction.hs[j].probability;
                   let awayR = prediction.as[k].probability;

                   scores.push({score: j.toString() + '-' + k.toString(), prob: homeR * awayR});
                }
            }

            let sorted = orderBy(scores, 'prob', ['desc']);
            let top3Result = sorted.slice(0, 3);
            let hw = prediction.wld.home > prediction.wld.away && prediction.wld.home > prediction.wld.draw;
            let aw = prediction.wld.away > prediction.wld.home && prediction.wld.away > prediction.wld.draw;
            let drw = prediction.wld.draw > prediction.wld.home && prediction.wld.draw > prediction.wld.away;

            await Result.update({
                predResult: hw ? 'H' : aw ? 'A' : 'D',
                predScore1: top3Result[0]['score'],
                predScore2: top3Result[1]['score'],
                predScore3: top3Result[2]['score'],
                prob1: top3Result[0]['prob'],
                prob2: top3Result[1]['prob'],
                prob3: top3Result[2]['prob']
            }, { where: { id: fixture.id }});

            console.log(`${fixture.id} has been updated`);
        }
    }

    private async getPrediction(homeId: number, awayId: number, prefix: string) {
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
    
        for (let i=0; i<scoreRanges.length; i++) {
            for (let j=0; j<scoreRanges.length; j++) {
                console.log(`${i}-${j} = ${Math.round((homeScores[i].probability * awayScores[j].probability)*100)}%`);

                if (i > j) {
                    homeWins += (homeScores[i].probability * awayScores[j].probability)*100;
                }

                else if (i < j) {
                    awayWins += (homeScores[i].probability * awayScores[j].probability)*100;
                }
            }
        }

        console.log(`Home = ${Math.round(homeWins)}%, Away =  ${Math.round(awayWins)}%, Draw =  ${Math.round(100 - (homeWins + awayWins))}%`);

        return {hs: homeScores, as: awayScores, wld: {home: homeWins, away: awayWins, draw: 100 - (homeWins + awayWins)}};
    }
}

new Prediction().run(18, 1);