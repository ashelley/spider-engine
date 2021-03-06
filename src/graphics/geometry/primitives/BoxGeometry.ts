
import * as Attributes from "../../../core/Attributes";
import { Geometry } from "../Geometry";
import { AABB } from "../../../math/AABB";
import { Vector3 } from "../../../math/Vector3";
import { defaultAssets } from "../../../assets/DefaultAssets";

@Attributes.displayName("Box")
export class BoxGeometry extends Geometry {

    @Attributes.unserializable()
    private _boundingBox = new AABB(new Vector3(-1, -1, -1), new Vector3(1, 1, 1));

    getVertexBuffer() {
        return defaultAssets.primitives.box.vertexBuffer;
    }

    getBoundingBox() {        
        return this._boundingBox;
    }
}
