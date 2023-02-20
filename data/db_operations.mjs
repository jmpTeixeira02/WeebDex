import pg from "pg"
import config from "../resources/config.mjs"

import {tryCatchHandler} from "../util.mjs"


const client = new pg.Client(config.dataBase)


// Receives array of objects desiredTables that has a name and columns field
async function init(... desiredTables){
    console.log("DB Connection Started!")
    await client.connect()

    const res = await client.query(
        `SELECT * FROM information_schema.tables 
        WHERE table_schema = 'public'`
    )
    const tables = res.rows
    const tableNames = tables.map(table => table.table_name)

   for (const table of desiredTables){
        if (!tableNames.includes(table.name)){
            await client.query(
                `CREATE TABLE ${table.name} (${table.columns})`
            )
            console.log(`Created table ${table.name}`)
        }
    }
}

async function insert(table, data){
    const keysArr = Object.keys(data)
    const keys = keysArr.join()
    const values = keysArr.map( (_, idx) => `$${idx+1}`).join()


    const [res, error] = await tryCatchHandler(
        async () => {
            return await client.query(
                `INSERT into ${table}(${keys}) VALUES(${values})`,
                Object.values(data)
            )},
    )
    return [res, error]
}

async function select(table, condition){
    let query_sufix = ""
    if (condition){
        const conditionArr = Object.keys(condition)
        query_sufix = " WHERE " + conditionArr.map( (e, idx) =>{
            const and = idx < 1 ? "" : " AND " 
            return `${and}${e} = $${idx+1}`
        }).join("")
    }
    
    const [res, error] = await tryCatchHandler(
        async () => {
            const base_query = `SELECT * FROM public.${table}`
            const query = base_query + query_sufix
            return await client.query(
                query,
                query_sufix != "" ? Object.values(condition) : undefined
            )},
    ) 
    return [res, error]
}

async function update(table, update, condition){
    const updateArr = Object.keys(update)
    let idx = 0

    const set = updateArr.map(e => {
        idx++
        return `${e} = $${idx}`
    }).join()

    const conditionArr = Object.keys(condition)
    const where = conditionArr.map(e =>{
        idx++
        return `${e} = $${idx}`
    }).join()

    const [res, error] = await tryCatchHandler(
        async() => {
            return await client.query(
                `UPDATE ${table} SET ${set} WHERE ${where}`,
                Object.values(update).concat(Object.values(condition))
            )}
    )
    
    return [res, error]
}

async function remove(table, condition){
    console.log("AAAAA")
    const conditionArr = Object.keys(condition)
    const where = conditionArr.map( (e, idx) =>{
        idx++
        return `${e} = $${idx}`
    }).join()

    const [res, error] = await tryCatchHandler(
        async() => {
            return await client.query(
                `DELETE FROM ${table} WHERE ${where}`,
                Object.values(condition)
            )}
    )
    console.log(res)
    return [res, error]
}



async function close(){
    await client.end()
    console.log("Connection Finished!")
}


export default {init, insert, select, update, close}