import { Connection } from "typeorm";

import {articles} from "../news/tests/newsFixtures";
import DebtsFixtures from "..//debts/tests/DebtsFixtures";

export default class FixturesLoader {
    constructor(private connection: Connection) {};

    private fixtureSets = {
        "Article": articles
    };

    public loadFixtures(): Promise<any> {
        return Promise.all(Object.keys(this.fixtureSets).map((fixture) => {
            const fixturesRepo = this.connection.getRepository(fixture);
            fixturesRepo.save(this.fixtureSets[fixture]);
        })).then(() => {
            new DebtsFixtures(this.connection.getRepository("Debt")).load();
        });
    }
}