import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";
import { Feature } from "./timeRestrictions";

export interface ScreenTimeDoc extends BaseDoc {
    user: ObjectId;
    feature: Feature;
    timeUsed: number; // in seconds
}

// Check features to make sure they're correct 
export default class ScreenTimeConcept {
    public readonly screenTime = new DocCollection<ScreenTimeDoc>("screenTime");

    async setTimeUsed(user: ObjectId, feature: Feature, time: number) {
        // Create document if it doesn't already exist 
        try {
            await this.dataExists(user, feature);
        } catch( ScreenTimeDataNotFoundError ) {
            await this.screenTime.createOne({
                user, 
                feature: { name: feature.name},
                timeUsed: 0,
            });
        }

        await this.screenTime.updateOne(
            { 
                user, 
                feature : { name: feature.name },
            }, 
            {
                timeUsed: time
            }
        );

        return { msg: "Updated screenTime!", time: time}

    }
    
    async getTimeUsed(user: ObjectId, feature: Feature) {
        try {
            await this.dataExists(user, feature);  
        } catch(ScreenTimeDataNotFoundError) {
            return {time: 0};
        }

        const res = await this.screenTime.readOne({
            user, 
            feature: { name: feature.name },
        });

        if (res === null) {
            throw new Error("This shouldn't happen.");
        }

        return {time: res.timeUsed}
    }

    // always fails, always making new document right now
    async dataExists(user: ObjectId, feature: Feature) {
        const res = await this.screenTime.readOne({
            user, 
            feature: { name: feature.name},
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