import { UniqueObject } from "../core/UniqueObject";
import { AsyncEvent } from "ts-events";
export declare class Asset extends UniqueObject {
    isPersistent: boolean;
    deleted: AsyncEvent<string>;
    isLoaded(): boolean;
    save(): Promise<void>;
    destroy(): void;
}
export interface SerializedAsset {
    typeName: string;
    id?: string;
}
