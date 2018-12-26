import { readFileSync } from "fs";
import { sum, mean, uniqBy } from 'lodash';
import { League } from "../models/league";
import { Team } from "../models/team";
import { Feature } from "../models/feature";
import { DataHelper } from "../helpers/data";
import { Result } from "../models/result";

const seasons = ['1819'];

export class Extraction {
    constructor() {}
    
    async run() {
        await this.extractLeagues();
        await this.extractTeams();
        await this.extractFeatures();
        await this.extractSchedules();
    }

    private async extractLeagues() {
        await League.create({name: 'Serie A', prefix: 'seriea'});
        await League.create({name: 'EPL', prefix: 'epl'});
        await League.create({name: 'La Liga Santander', prefix: 'laliga'});

        console.log('Leagues have been extracted');
    }

    private async extractTeams() {
        let leagues = await League.findAll();

        for (let i=0; i<leagues.length; i++) {
            let league = leagues[i].toJSON();
            let seasonData = JSON.parse(readFileSync('../data/' + league.prefix + seasons[seasons.length-1] + '.json').toString());
            let teams = uniqBy(seasonData, "HomeTeam");

            for (let i=0; i<teams.length; i++) {
                let team = teams[i];
                await Team.create({name: team['HomeTeam'], leagueId: league.id});
    
                console.log(`Team ${team['HomeTeam']} has been extracted`);
            }
        }
    }

    async extractFeatures() {
        let leagues = await League.findAll();

        for (let i=0; i<leagues.length; i++) {
            let league = leagues[i].toJSON();
            let data = DataHelper.getSeasonData(league.prefix);

            let meanHomeGoal = mean(data.map(e => parseInt(e['FTHG'])));
            let meanAwayGoal = mean(data.map(e => parseInt(e['FTAG'])));
            
            let teams = await Team.findAll({where: { leagueId: league.id}});

            for (let j=0; j<teams.length; j++) {
                let team = teams[j].toJSON();
    
                let homeGames = data.filter(e => e['HomeTeam'] === team.name);
                let awayGames = data.filter(e => e['AwayTeam'] === team.name);
            
                let hgr = mean(homeGames.map(e => parseInt(e['FTHG'])))/meanHomeGoal;
                let hcr = mean(homeGames.map(e => parseInt(e['FTAG'])))/meanAwayGoal;
                
                let agr = mean(awayGames.map(e => parseInt(e['FTAG'])))/meanAwayGoal;
                let acr = mean(awayGames.map(e => parseInt(e['FTHG'])))/meanHomeGoal;
                
                let existingFeature = await Feature.findOne({where: { teamId: team.id}});

                if (!existingFeature) {
                    await Feature.create({
                        teamId: team.id,
                        hgr: hgr,
                        hcr: hcr,
                        agr: agr,
                        acr: acr
                    });
                }
                else {
                    await Feature.update({
                        hgr: hgr,
                        hcr: hcr,
                        agr: agr,
                        acr: acr }, {where: { teamId: team.id }});
                }
    
                console.log(`Team ${team.name} feature has been extracted`);
            }      
        }
    }

    private async extractSchedules() {
        let leagues = await League.findAll();

        for (let i=0; i<leagues.length; i++) {
            let league = leagues[i].toJSON();
            let fixtures = DataHelper.getFixtures(league.prefix).filter(e => e['Round Number'] >= 16);
            
            fixtures = fixtures.sort((a, b) => {
                return a['Round Number'] - b['Round Number']
            });

            for (let j=0; j<fixtures.length; j++) {
                let fixture = fixtures[j];
                let homeTeam = await Team.findOne({where: {name: fixture['Home Team']}});
                let awayTeam = await Team.findOne({where: {name: fixture['Away Team']}});
                let segmentedDates = fixture["Date"].split('/');
                let day = parseInt(segmentedDates[0]) > 10 ? segmentedDates[0] : ("0" + segmentedDates[0]);
                let month = parseInt(segmentedDates[1]) > 10 ? segmentedDates[1] : ("0" + segmentedDates[1]);
                let year = segmentedDates[2].split(' ')[0];
                let date = new Date(year+'/'+month+'/'+day);
                
                let existingFixture = await Result.findOne({ where: { round: fixture['Round Number'], 
                    homeId: homeTeam.getDataValue('id'), 
                    awayId: awayTeam.getDataValue('id')}
                });

                let scores = fixture['Result'].split('-');
                let result = '';

                if (scores.length > 1) {
                    if (parseInt(scores[0]) > parseInt(scores[1]))
                        result = 'H';
                    else if (parseInt(scores[0]) < parseInt(scores[1]))   
                        result = 'A';
                    else 
                        result = 'D';
                }

                if (!existingFixture) {
                    await Result.create({
                        homeId: homeTeam.getDataValue('id'),
                        awayId: awayTeam.getDataValue('id'),
                        round: fixture['Round Number'],
                        date: date,
                        actualScore: fixture['Result'],
                        actualResult: result
                    });

                    console.log(`${fixture['Home Team']} vs ${fixture['Away Team']} fixture has been extracted`);
                }
            }
        }
    }
}

new Extraction().extractFeatures();