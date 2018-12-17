import { BIGINT, STRING, Instance, TEXT, DATE, BOOLEAN } from 'sequelize';
import { DbContext } from '../common/database';
import { League } from './league';

export interface TeamAttribute {
    id?: number;
    leagueId: number;
    name: string;
    
}

export interface TeamEntity extends Instance<TeamAttribute> {
    data: TeamAttribute;
}

export let Team = DbContext.define<TeamEntity, TeamAttribute>('team', {
   id: { type: BIGINT, primaryKey: true, autoIncrement: true },
   leagueId: { type: BIGINT, allowNull: false, field: 'league_id'},
   name: { type: STRING, allowNull: false }
}, { timestamps: false, tableName: 'teams', freezeTableName: true });

Team.belongsTo(League, { as: 'league', foreignKey: 'leagueId'});