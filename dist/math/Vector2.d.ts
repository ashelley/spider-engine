import { ObjectPool } from "../core/ObjectPool";
export declare class Vector2 {
    static zero: Vector2;
    static one: Vector2;
    static right: Vector2;
    static up: Vector2;
    static pool: ObjectPool<Vector2>;
    static dummy: Vector2;
    readonly length: number;
    readonly lengthSq: number;
    x: number;
    y: number;
    private _array;
    static fromArray(arr: number[]): void;
    static fromPool(): Vector2;
    constructor(x?: number, y?: number);
    set(x: number, y: number): this;
    add(other: Vector2): this;
    addVectors(a: Vector2, b: Vector2): this;
    substract(other: Vector2): this;
    substractVectors(a: Vector2, b: Vector2): this;
    normalize(): this;
    multiplyScalar(scalar: number): this;
    dot(other: Vector2): number;
    copy(other: Vector2): this;
    asArray(): number[];
    equals(other: Vector2): boolean;
}
