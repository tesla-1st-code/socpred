import { readFileSync } from "fs";
import { sum, mean, uniqBy } from 'lodash';
import { League } from "../models/league";
import { Team } from "../models/team";
import { Feature } from "../models/feature";
import { DataHelper } from "../helpers/data";

const seasons = ['1819'];

export class Extraction {
    constructor() {}
    
    async run() {
        await this.extractLeagues();
        await this.extractTeams();
        await this.extractFeatures();   
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

    private async extractFeatures() {
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
                
                if (isNaN(hgr) || isNaN(hcr) || isNaN(agr) || isNaN(acr)) {
                    console.log();
                }
                await Feature.create({
                    teamId: team.id,
                    hgr: hgr,
                    hcr: hcr,
                    agr: agr,
                    acr: acr
                });
    
                console.log(`Team ${team.name} feature has been extracted`);
            }      
        }
    }
}

new Extraction().run();