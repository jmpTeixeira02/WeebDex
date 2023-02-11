// REVER LOCALIZAÇÃO DESTES IMPORTS
import scrapperData from "../scrapper/target.mjs"
import scrapper from '../scrapper/scrapper.mjs'

export default function(db) {
    return {webScraping: webScraping}

    async function webScraping(table, dataBuilder){
        console.log("Starting the fetch process...")
        let updates = []
        const websites = Object.values(scrapperData)
        for (const website of websites){
            const entries = await scrapper(website)
            for (const entrie of entries){
                await processEntry(entrie, table, dataBuilder, updates)
            }
        }
        console.log("Ending the fetch process...")
        return updates
    } 


    async function processEntry(entrie, table, dataBuilder, updates){
        const data = dataBuilder(entrie)
        const [res, error] = await db.select(table, data.select.condition)
        // New entrie in the DB
        if(res.rows.length == 0){
            insertEntry(data.insert, table)
            return
        }
        // Update entry
        if(res.rows[0].chapter < entrie.chapter){
            updateEntry(data.update, table)
            if (res.rows[0].publish)
                updates.push(entrie)
        }
    }




    async function insertEntry(data, table){
        const [res, error] = await db.insert(table, data.values)
            if(res)
                console.log(`Inserted ${data.values.name} with publish as ${data.values.publish} into table ${table}`)
            else
                console.log(error)
    }

    async function updateEntry(data, table){
        const [res, error] = await db.update(table, data.values, data.condition)
            if (res)
                console.log(`Updated ${data.condition.name} to chapter ${data.values.chapter} into table ${table}`)
            else
                console.log(error)
    }
}