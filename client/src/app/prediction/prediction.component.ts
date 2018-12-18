import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {
    leagues: any[];
    results: any[];

    selectedLeague: any;
    selectedRound: number;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.selectedRound = 16;
        this.fetch();
    }

    async fetch() {
        if (!this.leagues)
           await this.fetchLeagues();

        if (!this.selectedLeague)
           this.selectedLeague = this.leagues[0];

        this.results = await this.dataService.getAll({leagueId: this.selectedLeague.id, round: this.selectedRound}, 'result', 'getAll').toPromise();
        console.log(this.results);
    }

    async fetchLeagues() {
        this.leagues = await this.dataService.getAll({}, 'leagues', 'getAll').toPromise();
        this.selectedLeague = this.leagues[0];
    }
}
