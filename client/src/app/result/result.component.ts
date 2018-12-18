import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
    correctResultRate: number;
    correctScoreRate: number;

    constructor(private dataService: DataService) { }

    ngOnInit() {
       this.correctResultRate = 0;
       this.fetch();
    }

    async fetch() {
        let data = await this.dataService.getAll({isDone: true}, 'result', 'getAll').toPromise();
        let correctResult = data.filter(e => e.actualResult === e.predResult).length;
        let correctScore = data.filter(e => (e.actualScore == e.predScore1) 
          || (e.actualScore == e.predScore2) || (e.actualScore == e.predScore3)).length;

        this.correctResultRate = correctResult/data.length;
        this.correctScoreRate = correctScore/data.length;
    }
}
