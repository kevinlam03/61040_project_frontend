import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export interface ScreenTimeDoc extends BaseDoc {
    user: ObjectId;
    feature: string;
    timeUsed: number; // in seconds
}

// Check features to make sure they're correct 
export default class ScreenTimeConcept {
    public readonly screenTime = new DocCollection<ScreenTimeDoc>("screenTime");

    async setTimeUsed(user: ObjectId, feature: string, time: number) {
        // Create document if it doesn't already exist 
        try {
            await this.dataExists(user, feature);
        } catch( ScreenTimeDataNotFoundError ) {
            await this.screenTime.createOne({
                user, 
                feature,
                timeUsed: 0,
            });
        }

        await this.screenTime.updateOne(
            { 
                user, 
                feature,
            }, 
            {
                timeUsed: time
            }
        );

        return { msg: "Updated screenTime!", time: time}

    }
    
    async getTimeUsed(user: ObjectId, feature: string) {
        /* try {
            await this.dataExists(user, feature);  
        } catch(ScreenTimeDataNotFoundError) {
            return {time: 0};
        } */

        const res = await this.screenTime.readOne({
            user, 
            feature,
        });

        if (res === null) {
            await this.setTimeUsed(user, feature, 0)
            return 0
        }

        return res.timeUsed
    }

    // always fails, always making new document right now
    async dataExists(user: ObjectId, feature: string) {
        const res = await this.screenTime.readOne({
            user, 
            feature,
        });

        if (res === null) {
            throw new ScreenTimeDataNotFoundError(user);
        }
    }
}

export class ScreenTimeDataNotFoundError extends NotAllowedError {
    constructor(
        public readonly user: ObjectId,
    ) {
        super("ScreenTime data wasn't found for {0}.", user)
    }
}