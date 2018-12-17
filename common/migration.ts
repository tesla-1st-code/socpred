import { League } from "../models/league";
import { Team } from "../models/team";
import { Feature } from "../models/feature";

export let migrate = async() => {
    await League.sync({force: true});
    await Team.sync({force: true});
    await Feature.sync({force: true});
}

migrate();