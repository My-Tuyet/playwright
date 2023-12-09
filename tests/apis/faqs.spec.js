import {test, expect} from "../fixtures/database";

let catId = 36;
let slug = "huydeptrai";
/* 
APIs:/api/kbr
1.GetListCSFAQCategories()
2.GetListCategoriesStructure()
3.topSearch()
4.search([FromQuery] string searchText = "", [FromQuery] int pageSize = 15, [FromQuery] int page = 1)
5.getListByCategory([FromQuery] int catId, [FromQuery] int pageSize = 15, [FromQuery] int page = 1)
6.GetDetailBySlug([FromRoute] string slug)
*/
test("Get list CS FAQ categories", async ({request, dataFactory}) => {
    const apiResult = await request.get("/api/kbr/GetListCSFAQCategories");
    expect(apiResult.ok()).toBeTruthy();
    const source = await apiResult.json();
    const target = await dataFactory.query(`SELECT DISTINCT id=kc.Id, name=kc.Name
    FROM KnowledgeBaseResourcesCategories kc JOIN KnowledgeBaseResourcesSubCategories ksc ON kc.Id = ksc.CategoryId
    JOIN KnowledgeBaseResourcesArticles ka ON ksc.Id = ka.CategoryId AND ka.Type = 1
    ORDER BY kc.Name`);
    catId = target.recordset?.find(() => true)?.id;
    expect(target.recordset).toEqual(source.data);
})


test("Get list categories structure", async ({request, dataFactory}) => {
    const apiResult = await request.get("/api/kbr/GetListCategoriesStructure");
    expect(apiResult.ok()).toBeTruthy();
    const source = await apiResult.json();
    const target = await dataFactory.query(`SELECT DISTINCT catId = kc.Id, catName = kc.Name, id = ksc.Id, name = ksc.Name
    FROM KnowledgeBaseResourcesCategories kc JOIN KnowledgeBaseResourcesSubCategories ksc ON kc.Id = ksc.CategoryId
    JOIN KnowledgeBaseResourcesArticles ka ON ksc.Id = ka.CategoryId AND ka.Type = 1
    ORDER BY catName, name`);
    // let result = [];
    // target.recordset.forEach(item => {
    //     if(!result.find(c => c.id == item.catId)){
    //         result.push({id: item.catId, name: item.catName, subCategories: target.recordset.filter(c => c.catId == item.catId).map(c => ({id: c.id, name: c.name}))});
    //     }
    // })
    let dataAfterGroup = target.recordset.reduce((result, item) => {
        if(!result.find(c => c.id == item.catId)){
            result.push({id: item.catId, name: item.catName, subCategories: target.recordset.filter(c => c.catId == item.catId).map(c => ({id: c.id, name: c.name}))});
        }
        return result;
    }, []);
    expect(dataAfterGroup).toEqual(source.data);
})

test("Top search", async ({request, dataFactory}) => {
    const apiResult = await request.get("/api/kbr/topSearch");
    expect(apiResult.ok()).toBeTruthy();
    const source = await apiResult.json();
    slug = source.data.find(c =>true)?.slug;
    const target = await dataFactory.query(`SELECT TOP 5 kw.Content
    INTO #temp
    FROM Keywords kw
    WHERE kw.EntityType = 6
    ORDER BY SearchPoint DESC
    
    SELECT DISTINCT id = ka.Id
    FROM KnowledgeBaseResourcesArticles ka
    WHERE ka.Type = 1 AND EXISTS (SELECT TOP 1 1 FROM #temp WHERE CHARINDEX(Content, SearchField) > 0)
    
    drop table #temp`);
    let sourceIds = source.data.map(c => c.id);
    let targetIds = target.recordset.map(c => c.id);
    let targetLength = targetIds?.length;
    expect(targetIds).toEqual(expect.arrayContaining(sourceIds));
    expect(sourceIds.length).toEqual(targetLength >= 12 ? 12 : targetLength);
})

test("search", async ({request, dataFactory}) => {
    // const keywords = ["thyroid success", "vitamin D3&K2", "@before"];
    const keywords = ["thyroid success"];
    const page = 1;
    const pageSize = 15;
    for(let word of keywords){
        let keyword = word.trim().replaceAll(/\s+/g, ' ').toLowerCase();
        let queryKeyword = `SELECT SearchPoint
                            FROM Keywords
                            WHERE EntityType = 6 AND Content = '${keyword}'`;
        const keyWordBefore = await dataFactory.query(queryKeyword);

        let apiResult = await request.get(`/api/kbr/search?searchText=${encodeURIComponent(word)}&page=${page}&pageSize=${pageSize}`);
        expect(apiResult.ok()).toBeTruthy();
        let source = await apiResult.json();
        
        let keywordArr = keyword.replaceAll(",", "").split(" ").filter(c =>c);
        let selectQuery = `SELECT categoryId = kc.Id, categoryName = kc.Name, description = ka.Description, id = ka.Id, slug = ka.Slug, subCategoryId = ks.Id, subCategoryName = ks.Name, title = ka.Title, typeDescription = 'faqs'`
        let conditionQuery = ` FROM KnowledgeBaseResourcesArticles ka JOIN KnowledgeBaseResourcesSubCategories ks ON ka.CategoryId = ks.Id
            JOIN KnowledgeBaseResourcesCategories kc ON kc.Id = ks.CategoryId
        WHERE ka.Type = 1 `;
        if(keywordArr && keywordArr.length){
            keywordArr.forEach(c => {
                conditionQuery += `AND ka.SearchField LIKE '%${c}%' `;
            })
        }
        const target = await dataFactory.query(`${selectQuery} ${conditionQuery} ORDER BY kc.Name, ka.CreatedOn DESC 
                                                OFFSET ${pageSize*(page - 1)} ROWS FETCH NEXT ${pageSize} ROWS ONLY`);
        const targetTotal = await dataFactory.query(`SELECT total = COUNT(DISTINCT ka.Id) ${conditionQuery}`);
        expect(targetTotal.recordset[0]?.total).toEqual(source.total);
        expect(target.recordset).toEqual(source.data);
        if(targetTotal.recordset){
            const keyWordAfter = await dataFactory.query(queryKeyword);
            expect(keyWordAfter.recordset[0].SearchPoint - (keyWordBefore.recordset[0].SearchPoint || 0)).toEqual(1);
        }
    }
})


test("Get list by category", async ({request, dataFactory}) => {
    const page = 1;
    const pageSize = 15;
    const apiResult = await request.get(`/api/kbr/getListByCategory?catId=${catId}&page=${page}&pageSize=${pageSize}`);
    expect(apiResult.ok()).toBeTruthy();
    const source = await apiResult.json();

    let selectQuery = `SELECT categoryId = kc.Id, categoryName = kc.Name, description = ka.Description, id = ka.Id, slug = ka.Slug, subCategoryId = ks.Id, subCategoryName = ks.Name, title = ka.Title, typeDescription = 'faqs'`
    let conditionQuery = ` FROM KnowledgeBaseResourcesArticles ka JOIN KnowledgeBaseResourcesSubCategories ks ON ka.CategoryId = ks.Id
        JOIN KnowledgeBaseResourcesCategories kc ON kc.Id = ks.CategoryId
        WHERE kc.Id = ${catId} AND ka.Type = 1`;
    const target = await dataFactory.query(`${selectQuery} ${conditionQuery} ORDER BY kc.Name, ka.CreatedOn DESC`);
    const targetTotal = await dataFactory.query(`SELECT total = COUNT(DISTINCT ka.Id) ${conditionQuery}`);
    expect(targetTotal.recordset[0]?.total).toEqual(source.total);
    expect.soft(target.recordset).toEqual(source.data);
})

test("Get Detail By Slug", async ({request, dataFactory}) => {
    const apiResult = await request.get(`/api/kbr/${slug}`);
    expect(apiResult.ok()).toBeTruthy();
    const source = await apiResult.json();
    const target = await dataFactory.query(`SELECT categoryId = kc.Id, categoryName = kc.Name, description = ka.Description, id = ka.Id, slug = ka.Slug, subCategoryId = ks.Id, subCategoryName = ks.Name, title = ka.Title, type = ka.Type, kbType = kc.Type, previewImage = ka.PreviewImage
    FROM KnowledgeBaseResourcesArticles ka JOIN KnowledgeBaseResourcesSubCategories ks ON ka.CategoryId = ks.Id
    JOIN KnowledgeBaseResourcesCategories kc ON kc.Id = ks.CategoryId
    WHERE ka.Slug = '${slug}'`);
    expect.soft(source).toEqual(expect.objectContaining(target.recordset?.find(c => true)));
    // expect.soft(source).toMatchObject(target.recordset?.find(c => true));
})
