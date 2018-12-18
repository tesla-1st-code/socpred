import { BIGINT, STRING, Instance, DATEONLY, DECIMAL, INTEGER } from 'sequelize';
import { DbContext } from '../common/database';
import { Team } from './team';

export interface ResultAttribute {
    id?: number;
    homeId: number;
    awayId: number;
    round: number;
    actualScore?: string;
    predictedScore?: string;
    actualProbability?: number;
    predictedProbability?: number;
    actualResult?: string;
    predictedResult?: string;
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
   predictedScore: { type: STRING, allowNull: true, field: 'predicted_score'},
   actualProbability: { type: DECIMAL, allowNull: true, field: 'actual_probability'},
   predictedProbability: { type: DECIMAL, allowNull: true, field: 'predicted_probability'},
   actualResult: { type: STRING, allowNull: true, field: 'actual_result'},
   predictedResult: { type: STRING, allowNull: true, field: 'predicted_result'},
   date: { type: DATEONLY, allowNull: true }
}, { timestamps: false, tableName: 'results', freezeTableName: true });

Result.belongsTo(Team, {as: 'home', foreignKey: 'homeId'});
Result.belongsTo(Team, {as: 'away', foreignKey: 'awayId'});