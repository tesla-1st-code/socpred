import { BIGINT, STRING, Instance, DATEONLY, DECIMAL, INTEGER } from 'sequelize';
import { DbContext } from '../common/database';
import { Team } from './team';

export interface ResultAttribute {
    id?: number;
    homeId: number;
    awayId: number;
    round: number;
    actualScore?: string;
    actualResult?: string;
    predScore1?: string;
    predScore2?: string;
    predScore3?: string;
    prob1?: number;
    prob2?: number;
    prob3?: number;
    predResult?: string;
    date: Date;
}

export interface ResultEntity extends Instance<ResultAttribute> {
    data: ResultAttribute;
}

export let Result = DbContext.define<ResultEntity, ResultAttribute>('result', {
   id: { type: BIGINT, primaryKey: true, autoIncrement: true },
   homeId: { type: BIGINT, allowNull: false, field: 'home_id' },
   awayId: { type: BIGINT, allowNull: false, field: 'away_id' },
   round: { type: INTEGER, allowNull: false},
   actualScore: { type: STRING, allowNull: true, field: 'actual_score'},
   actualResult: { type: STRING, allowNull: true, field: 'actual_result'},
   predScore1: { type: STRING, allowNull: true, field: 'pred_score_1'},
   predScore2: { type: STRING, allowNull: true, field: 'pred_score_2'},
   predScore3: { type: STRING, allowNull: true, field: 'pred_score_3'},
   prob1: { type: DECIMAL, allowNull: true, field: 'prob_1'},
   prob2: { type: DECIMAL, allowNull: true, field: 'prob_2'},
   prob3: { type: DECIMAL, allowNull: true, field: 'prob_3'},
   predResult: { type: STRING, allowNull: true, field: 'pred_result'},
   date: { type: DATEONLY, allowNull: true }
}, { timestamps: false, tableName: 'results', freezeTableName: true });

Result.belongsTo(Team, {as: 'home', foreignKey: 'homeId'});
Result.belongsTo(Team, {as: 'away', foreignKey: 'awayId'});