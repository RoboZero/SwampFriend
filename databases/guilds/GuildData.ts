import { Guild, GuildMember, User } from "discord.js";
import { ChannelData } from "./ChannelData";

export class GuildData{
    public guild: Guild;
    public botMember: GuildMember;
    public channels: Map<string, ChannelData>;
    public roles: Set<string>;   
    public users: Set<string>; 

    constructor(guild: Guild, botMember: User){
        this.guild = guild;
        this.channels = new Map<string, ChannelData>();
        this.roles = new Set<string>();
        this.users = new Set<string>();
        this.botMember = guild.members.cache.get(botMember!.id) as GuildMember
    }
}