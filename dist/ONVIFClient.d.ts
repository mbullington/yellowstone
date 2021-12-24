import RTSPClient from "./RTSPClient";
export default class ONVIFClient extends RTSPClient {
    constructor(username: string, password: string);
    playFrom(from: Date, to?: Date): Promise<this>;
    playReverse(from?: Date, to?: Date): Promise<this>;
}
