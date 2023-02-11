import {EmbedBuilder} from "discord.js"

export default function(client, db){
    const embedTemplate = new EmbedBuilder()
        .setColor(0x0099FF)

    async function sendMessage(msg, table, ){
        const embed = embedTemplate
            .setTitle(msg.title)
            .setDescription(`Chapter: ${msg.chapter}`)
            .setAuthor({ name: 'Manwha Update!', url: msg.uri })
            .setURL(msg.uri)
            .setImage(msg.img)
            .setTimestamp()
            .setFooter({ text: `Chapter: ${msg.chapter}`, iconURL: msg.img })
        const [res, error] = await db.select(table)
        const rows = res.rows
        for (const row of rows){
            const channel = client.channels.cache.get(row.channel_id)
            channel.send({ embeds: [embed] })
        }
    }

    return {sendMessage}
}