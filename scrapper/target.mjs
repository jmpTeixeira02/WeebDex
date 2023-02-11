export default {
    "asura": {
        uri: "https://www.asurascans.com/",
        title_card: ".uta",
        parser: ($, el) => {
            return {
                title: $(el).find(".series").attr("title"),
                img: $(el).find("img").attr("src"),
                chapter: $(el).find($("li")).first().find("a").text(),
                chapter_uri: $(el).find($("li")).first().find("a").attr("href")
            }
        }
    },
    "void": {
        uri: "https://void-scans.com/",
        title_card: ".uta",
        parser: ($, el) => {
            return {
                title: $(el).find(".series").attr("title"),
                img: $(el).find("img").attr("src"),
                chapter: $(el).find($("li")).first().find("a").text(),
                chapter_uri: $(el).find($("li")).first().find("a").attr("href")
            }
        }
    },
    "reaper": {
        uri: "https://reaperscans.com/latest/comics",
        title_card: ".relative.flex.space-x-2.rounded.bg-white.p-2.transition",
        parser: ($, el) => {
            const unparsedChapter =  $(el).find(".flex-1.rounded").text().trim().split("\n")
            return {
                title: $(el).find("p").first().text().trim(),
                img: $(el).find("img").attr("src"),
                chapter: unparsedChapter[0],
                chapter_uri: $(el).find(".flex-1.rounded").attr("href")
            }
        }
    }
}