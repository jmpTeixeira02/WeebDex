# WeebDex
<img src="./resources/icon.png"  width="200" height="150">

**WeebDex** is a [Discord](https://discord.com/) bot using [discord.js](https://discord.js.org/#/) created by [João Teixeira](https://github.com/jmpTeixeira02)

**WeebDex** scrapes the web looking for new manwha chapter releases, currently working on the following websites

- [Asura Scans](https://www.asurascans.com/)
- [Reaper Scans](https://reaperscans.com/latest/comics)
- [Void Scans](https://void-scans.com/)

If a new chapter is found, the bot notifies the users by sending a message in [Discord](https://discord.com/)

Currently all the data is being stored in [PostgreSQL](https://www.postgresql.org/)

## Features
- **Current Channel** - Displays the current announcement channel
- **Set Channel** - Set the selected channel to be the new announcement channel
- **Update Publish Status** - Given a title name, update the publish status in order to enable/disable the message informing new releases


## W.I.P
- **Check Title**
- **List titles filtered**
- **Individual Notifications** - Each user can subscribe to different titles and they get mentioned when a new release exists 
- **Random** - Get a random manwha