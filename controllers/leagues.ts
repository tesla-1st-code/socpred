import { FindOptions } from "sequelize";
import { LeagueAttribute, League } from "../models/league";
import { JsonController, Get, Param, QueryParams } from "routing-controllers";

@JsonController("/leagues")
export class LeagueController {
    constructor() {}

    @Get("/getById/:id")
    async get(@Param('id') id: number) {
        return await League.findOne(this.applyQuery({id: id}));
    }

    @Get("/getAll")
    async getAll(@QueryParams() query: any) {
        return await League.findAll(this.applyQuery(query));
    }

    private applyQuery(query: any) {
        let options: FindOptions<LeagueAttribute> = { where: {}, include: [], order: [], };
        let teamQuery = {};
        
        if (query.leagueId)
            teamQuery['leagueId'] = query.leagueId;

        if (query.id)
           options.where['id'] = query.id;

        return options;
    }
}