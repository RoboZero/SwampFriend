import { GuildData } from "./GuildData";

export class ChannelData{
    guildData: GuildData;

    constructor(guildData:GuildData){
        this.guildData = guildData;
    }
}