import console from "console";
import { Client, Guild, GuildMember, Snowflake, User } from "discord.js";
import mongoose, { Model } from "mongoose";
import { ChannelData } from "./ChannelData";
import { GuildData } from "./GuildData";
import GuildModel from "./GuildModel";

export class GuildParser{
    client: Client;

    constructor(client: Client){
        this.client = client;
    }

    public parseGuildsFromDB(): Map<string, GuildData> {
        console.log("Parsing guilds from MongoDB");

        const allGuilds = new Map<string, GuildData>();

        this.client.guilds.cache.forEach(async (guild:Guild) => {
            this.client = this.client;
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
            const guildData: GuildData = new GuildData(guild, this.client.user!);

            for(const channel in query[0].channels){
                guildData.channels.set(channel, new ChannelData(guildData));
            }

            guildData.roles = new Set<string>(query[0].roles.map((value: String, index: number, array: String[]) => {
                return value.toString()
            }));

            guildData.users = new Set<string>(query[0].users.map((value: String, index: number, array: String[]) => {
                return value.toString()
            }));

            allGuilds.set(guild.id, guildData);

            console.log(`Parsed guild: ${guildData.guild.name} with ${guildData.channels.size} channels, ${guildData.roles.size} channels, and ${guildData.users.size} users`);
        }
        
        console.log(`Done parsing guilds from MongoDB. Contains ${allGuilds.size} guilds`);
    }

    public async addGuildToDB(guild: Guild): Promise<GuildData> {
        const guildData: GuildData = new GuildData(guild, this.client.user!);

        await GuildModel.create({
            _id: guildData.guild.id,
            channels: Array.from(guildData.channels.values()),
            roles: Array.from(guildData.roles.values()),
            users: Array.from(guildData.users.values())
        });

        console.log(`Added guild: ${guild.name}`);

        return guildData;
    }

    public async addMemberToGuildInDB(newMember:GuildMember){
        this.addUserToGuildInDB(newMember.id, newMember.guild);
    }

    public async addUserToGuildInDB(userId:string, guild:Guild){
        const query = await GuildModel.find({_id: guild.id });
        
        GuildModel.findOneAndUpdate(
            query,
            {
                $addToSet: {
                    users: userId
                }
            },
            function (error: any, success: any) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            });

        console.log(`Added user to guild. New query - ${query[0]} `);
    }

    public async removeGuildFromDB(guild: Guild): Promise<void> {
        await GuildModel.deleteOne({_id: guild.id});
        
        console.log(`Removed guild: ${guild.name}`);
    }
}