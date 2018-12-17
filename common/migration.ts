import { League } from "../models/league";
import { Team } from "../models/team";
import { Feature } from "../models/feature";
import { Result } from "../models/result";

export let migrate = async() => {
    await League.sync({force: true});
    await Team.sync({force: true});
    await Feature.sync({force: true});
    await Result.sync({force: true});
}

migrate();