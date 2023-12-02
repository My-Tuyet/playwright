import {test, expect} from "@playwright/test";
import sql from "mssql";
// (async () => {
//     const config = {
//         user: 'SqlAdmin',
//         password: '!2osiW6VNeff',
//         server: 'platform-joulebroker.database.windows.net',
//         database: 'MgiSolutions_Fresher'
//     };
//     await sql.connect(config);
//     const result = await sql.query('SELECT * FROM Customers');
//     console.log(result);
//     await sql.close();
// })

test('test connect', async ({ page }) => {
    const config = {
        user: 'reader_user',
        password: 'Test!123',
        server: 'drberg.database.windows.net',
        database: 'DrBerg_CRM_Dev'
    };
    await sql.connect(config);
    const result = await sql.query('SELECT TOP 10 * FROM KnowledgeBaseResourcesCategories ORDER BY Id DESC');
    console.log(result);
    await sql.close();
});