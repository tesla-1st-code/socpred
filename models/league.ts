import { BIGINT, STRING, Instance, TEXT, DATE, BOOLEAN } from 'sequelize';
import { DbContext } from '../common/database';

export interface LeagueAttribute {
    id?: number;
    name: string;
    prefix: string;
}

export interface LeagueEntity extends Instance<LeagueAttribute> {
    data: LeagueAttribute;
}

export let League = DbContext.define<LeagueEntity, LeagueAttribute>('league', {
   id: { type: BIGINT, primaryKey: true, autoIncrement: true },
   name: { type: STRING, allowNull: false },
   prefix: { type: STRING, allowNull: false }
}, { timestamps: false, tableName: 'leagues', freezeTableName: true });