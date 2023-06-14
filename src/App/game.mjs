import { BackedEnum } from "../../modules/utils/utils.mjs";



export class GameMode extends BackedEnum
{
    static BOTH = new GameMode(3);
    static MOVIE = new GameMode(1);
    static TV = new GameMode(2);
}





