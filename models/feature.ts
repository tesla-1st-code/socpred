import { BIGINT, STRING, Instance, TEXT, DATE, BOOLEAN, DECIMAL } from 'sequelize';
import { DbContext } from '../common/database';
import { Team } from './team';

export interface FeatureAttribute {
    id?: number;
    teamId: number;
    hgr: number;
    hcr: number;
    agr: number;
    acr: number;
    hccr: number;
    accr: number;
}

export interface FeatureEntity extends Instance<FeatureAttribute> {
    data: FeatureAttribute;
}

export let Feature = DbContext.define<FeatureEntity, FeatureAttribute>('feature', {
   id: { type: BIGINT, primaryKey: true, autoIncrement: true },
   teamId: { type: BIGINT, allowNull: false, field: 'team_id' },
   hgr: { type: DECIMAL, allowNull: false },
   hcr: { type: DECIMAL, allowNull: false },
   agr: { type: DECIMAL, allowNull: false },
   acr: { type: DECIMAL, allowNull: false },
   hccr: { type: DECIMAL, allowNull: false },
   accr: { type: DECIMAL, allowNull: false }
}, { timestamps: false, tableName: 'features', freezeTableName: true });

Feature.belongsTo(Team, {as: 'team', foreignKey: 'teamId'});