import { FindOptions } from "sequelize";
import { ResultAttribute, Result } from "../models/result";
import { Team } from "../models/team";
import { JsonController, Get, Param, QueryParams } from "routing-controllers";

@JsonController("/result")
export class ResultController {
    constructor() {}

    @Get("/getById/:id")
    async get(@Param('id') id: number) {
        return await Result.findOne(this.applyQuery({id: id}));
    }

    @Get("/getAll")
    async getAll(@QueryParams() query: any) {
        return await Result.findAll(this.applyQuery(JSON.parse(query.query)));
    }

    private applyQuery(query: any) {
        let options: FindOptions<ResultAttribute> = { where: {}, include: [], order: [['id', 'DESC']], };
        let teamQuery = {};
        
        if (query.leagueId)
            teamQuery['leagueId'] = query.leagueId;

        options.include.push({model: Team, as: 'home', where: teamQuery});
        options.include.push({model: Team, as: 'away', where: teamQuery});

        if (query.id)
           options.where['id'] = query.id;

        if (query.round)
            options.where['round'] = query.round;
        
        if (query.isDone)
            options.where['actualResult'] = {$not: ""};

        return options;
    }
}