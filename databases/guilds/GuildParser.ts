import console from "console";
import { userIntros } from "data/user-intros";
import { Client, Guild, GuildMember, Snowflake, User } from "discord.js";
import mongoose, { Model } from "mongoose";
import UserIntro from "types/UserIntro";
import { ChannelData } from "./ChannelData";
import { GuildData } from "./GuildData";
import GuildModel from "./GuildModel";

export class GuildParser{
    client: Client;
    userIntroSet: Set<string>

    constructor(client: Client){
        this.client = client;
        this.userIntroSet = new Set<string>();
    }

    public parseGuildsFromDB(): Map<string, GuildData> {
        console.log("Parsing guilds from MongoDB");

        const allGuilds = new Map<string, GuildData>();

        this.client.guilds.cache.forEach(async (guild:Guild) => {
            this.parseGuildFromDB(guild, allGuilds);
        });

        return allGuilds;
    }

    private async parseGuildFromDB(guild: Guild, allGuilds: Map<string, GuildData>): Promise<void>{
        console.log(`Parsing guild ${guild.name}`);

        const exists = await GuildModel.exists({_id: guild.id});

        if(!exists){
            this.addGuildToDB(guild);
            console.log(`Added guild ${guild.id} to database`);
            return;
        }

        const query = await GuildModel.find({_id: guild.id});

        if(query.length){
            console.log(`Guild query is returning items (length > 0)`);

            const guildData: GuildData = new GuildData(guild, this.client.user!);

            console.log(`Query[0]: ${query[0]}`);

            for(const channel in query[0].channels){
                guildData.channels.set(channel, new ChannelData(guildData));
            }

            guildData.roles = new Set<string>(query[0].roles.map((value: String, index: number, array: String[]) => {
                return value.toString();
            }));

            
            for(let i = 0; i < query[0].userIntros.length; i++){
                let userIntro = {
                    userId: query[0].userIntros[i].userId.toString(),
                    title: query[0].userIntros[i].title.toString(),
                    description: query[0].userIntros[i].description.toString(),
                    tags: Array.from(query[0].userIntros[i].tags.toString()),
                    color: 0
                };

                if(this.userIntroSet.has(userIntro.userId)){
                    //Duplicate
                    continue;
                }

                console.log(`Intro obj pushed: ${userIntro.userId}, ${userIntro.title}, ${userIntro.description}`);

                guildData.userIntros.push(userIntro);
            }
            
            allGuilds.set(guild.id, guildData);

            console.log(`Parsed guild: ${guildData.guild.name} with ${guildData.channels.size} channels, ${guildData.roles.size} roles, and ${guildData.userIntros.length} user intros`);
        }
        
        console.log(`Done parsing guilds from MongoDB. Contains ${allGuilds.size} guilds`);
    }

    public async addGuildToDB(guild: Guild): Promise<GuildData> {
        const guildData: GuildData = new GuildData(guild, this.client.user!);

        await GuildModel.create({
            _id: guildData.guild.id,
            channels: Array.from(guildData.channels.values()),
            roles: Array.from(guildData.roles.values()),
            userIntros: Array.from(guildData.userIntros.values())
        });

        console.log(`Added guild: ${guild.name}`);

        return guildData;
    }

    public async addUserIntroToGuildInDB(userIntro: UserIntro, guild:Guild){
        console.log(`Adding user to database: User: ${userIntro.userId}, Guild: ${guild.name}`);

        if(this.userIntroSet.has(userIntro.userId)){
            await GuildModel.deleteOne({
                _id: guild.id,
                userIntros: {
                    userId: userIntro.userId
                }
            }).then((value)=>{
                console.log(`Tried to remove duplicate, removed ${value.deletedCount}`)
            });
        }

        const updateQuery = await GuildModel.updateOne(
            {
                _id: guild.id,
            },
            {
                $addToSet: {
                    userIntros: {
                        userId: userIntro.userId,
                        title: userIntro.title,
                        description: userIntro.description,
                        tags: Array.from(userIntro.tags.values()),
                        color: userIntro.color?.toString()!
                    }
                }
            }).then((value)=>{
                console.log(`Added user to guild. Result: ${value.modifiedCount} changes `);
            });

        console.log(`New query - ${updateQuery} `);
    }

    public async removeGuildFromDB(guild: Guild): Promise<void> {
        await GuildModel.deleteOne({_id: guild.id});
        
        console.log(`Removed guild: ${guild.name}`);
    }
}