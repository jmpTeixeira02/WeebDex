import {tryCatchHandler} from "../util.mjs"

import fetch from 'node-fetch'
import * as cheerio from "cheerio"

async function webFetcher(website){
    const [data, error] = await tryCatchHandler(fetch, website.uri)
    if (data.ok){
        const body = await data.text()
        const $ = cheerio.load(body)


        const title_cards = $(website.title_card)
        let series = [{}]
        title_cards.each(function(_,  el){
            const chapter = website.parser($, el).chapter
            series.push({
                title: website.parser($, el).title,
                img: website.parser($, el).img,
                chapter: chapter.split(" ")[1],
                uri: website.parser($, el).chapter_uri
            })
        })
        return series.filter(serie => {
            if(serie.title) 
                return serie
        })
    }
}

export default webFetcher