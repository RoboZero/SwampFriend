# SwampFriend

A Discord.js bot written in TypeScript that lets you create an intro for yourself,
allows you to seek out random intros of others, and view a person's intro.

![image](https://user-images.githubusercontent.com/92892499/215334533-823f3721-95ab-458c-8884-78fb4b91d347.png)
![image](https://user-images.githubusercontent.com/92892499/215334551-32d81533-ee29-4457-af21-3dba116c377e.png)

## Getting Started

Create a `.env` file containing 3 tokens:

- `BOT_TOKEN`: The token for your bot
- `CLIENT_ID`: The ID of the application
- `GUILD_ID`: The ID of the server where you are developing your bot

Install the necessary dependencies
```
npm install
```

Run the command register file
```
npm run register
```

Start the bot
```
npm run start
```

## Commands

**/intro**

Creates a new intro for you if one does not exist, and gives you the option to edit your intro.

**/seek**

Grabs a random person's intro.

**/grab**

Grabs a specific person's intro.

**/deleteintro**

Deletes your intro from the system.

## Sources

https://discordjs.guide/
