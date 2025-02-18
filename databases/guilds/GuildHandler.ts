import { Client, Guild, GuildMember, Message, PartialGuildMember, User } from "discord.js";
import UserIntro from "types/UserIntro";
import { GuildData } from "./GuildData";
import { GuildParser } from "./GuildParser";

export class GuildHandler {
    client:Client;
    parser:GuildParser;
    guilds:Map<string, GuildData>;
    dirty:boolean;

    public constructor(client:Client){
        this.client = client;
        this.parser = new GuildParser(client);
        this.guilds = new Map();
        this.dirty = true;
    }

    public async onClientReady(){
        this.guilds = await this.parser.parseGuildsFromDB();
    }

    public async onGuildCreate(guild:Guild){
        const guildData: GuildData = await this.parser.addGuildToDB(guild);
        this.guilds.set(guild.id, guildData);
    }

    public onGuildDelete(guild:Guild){
        this.parser.removeGuildFromDB(guild);
        this.guilds.delete(guild.id);
    }

    public async storeUserData(userIntro:UserIntro, guild:Guild): Promise<void>{
        this.parser.addUserIntroToGuildInDB(userIntro, guild);
    }

    public fetchUserData(guild:Guild): UserIntro[]{
        if(this.guilds.has(guild.id)){
            console.log(`Fetched user intros for guild ${guild.name}`);
            return this.guilds.get(guild.id)!.userIntros;
        } else{
            return [];
        }
    }

    public hasGuild(guild:Guild): boolean {
        return this.guilds.has(guild.id);
    }
}