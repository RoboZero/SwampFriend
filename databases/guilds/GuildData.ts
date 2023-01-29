import { Guild, GuildMember, User } from "discord.js";
import UserIntro from "types/UserIntro";
import { ChannelData } from "./ChannelData";

export class GuildData{
    public guild: Guild;
    public botMember: GuildMember;
    public channels: Map<string, ChannelData>;
    public roles: Set<string>;   
    public userIntros: UserIntro[]; 

    constructor(guild: Guild, botMember: User){
        this.guild = guild;
        this.channels = new Map<string, ChannelData>();
        this.roles = new Set<string>();
        this.userIntros = [];
        this.botMember = guild.members.cache.get(botMember!.id) as GuildMember
    }
}