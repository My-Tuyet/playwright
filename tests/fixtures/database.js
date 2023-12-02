import sql from "mssql";
import {test, expect} from"@playwright/test";

class dataFactory {
    constructor(page){
        this.page = page;
        this.config = {
            user: process.env.USER,
            password: process.env.PASSWORD,
            server: process.env.SERVER,
            database: process.env.DATABASE
        }
    }
    async connect () {
        await sql.connect(this.config);
    }
    async close() {
        await sql.close();
    }
    async query(clause) {
        return await sql.query(clause);
    }
}


exports.test = test.extend({
    dataFactory: async({page}, use) => {
        const factory = new dataFactory(page);
        await factory.connect();
        await use(factory);
        await factory.close();
    }
})

exports.expect = expect;