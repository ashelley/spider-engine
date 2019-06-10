import { Entity } from "../../core/Entity";
import { SerializableObject } from "../../core/SerializableObject";
import { Reference } from "../../serialization/Reference";
import { Matrix44 } from "../../math/Matrix44";
import * as Attributes from "../../core/Attributes";
import { LensFlare } from "./LensFlare";
import { Component } from "../../core/Component";
import { Projector } from "../Projector";
import { Color } from "../Color";
import { TextureSizePow2Metadata, TextureSizePow2 } from "../GraphicTypes";
import { Frustum } from "../Frustum";
import { OrthographicProjector } from "../OrthographicProjector";

export class LightType extends SerializableObject {
}

export class DirectionalLight extends LightType {

}

export class PointLight extends LightType {
    radius = 10;
}

namespace Private {
    export const projectorProperty = "_projector";
}

export class Light extends Component {

    get projector() { return this._projector.instance; }
    set projector(projector: Projector | undefined) { 
        let oldProjector = this._projector.instance;
        if (oldProjector) {
            oldProjector.changed.detach(this.onProjectorChanged);
        }
        this._projector.instance = projector;
        if (projector) {
            projector.changed.attach(this.onProjectorChanged);
            if (this.entity) {
                this.updateFrustum();
            }
        }        
    }

    intensity = 1;
    color = new Color(1, 1, 1, 1);
    castShadows = true;
    shadowBias = .001;
    shadowRadius = 4;

    @Attributes.enumLiterals(
        TextureSizePow2Metadata.literals, 
        name => name.substring(1) // Trim the _ from the display name
    )
    shadowMapSize = TextureSizePow2._2048;

    type: Reference<LightType>;

    @Attributes.unserializable()
    viewMatrix = new Matrix44();
    
    get frustum(): Frustum | null { return this._projector.instance ? this._projector.instance.frustum : null; }

    private _projector: Reference<Projector>;    

    // TODO
    // private _lensFlare = new Reference(LensFlare);
    
    constructor() {
        super();
        this.type = new Reference(LightType, new DirectionalLight());
        this._projector = new Reference(Projector, new OrthographicProjector());
        this.onTransformChanged = this.onTransformChanged.bind(this);
        this.onProjectorChanged = this.onProjectorChanged.bind(this);                
    }

    setEntity(entity: Entity) {
        super.setEntity(entity);
        this.entity.transform.changed.attach(this.onTransformChanged);

        let projector = this.projector;
        if (projector && projector.changed.listenerCount() === 0) {
            projector.changed.attach(this.onProjectorChanged);
        }
        
        this.updateFrustum();
    }

    // tslint:disable-next-line
    setProperty(property: string, value: any) {        
        if (property === Private.projectorProperty) {
            this.projector = (value as Reference<Projector>).instance;
        } else {
            super.setProperty(property, value);
        }
    }

    destroy() {
        let transform = this.entity.transform;
        if (transform) {
            transform.changed.detach(this.onTransformChanged);
        }
        super.destroy();
    }

    getProjectionMatrix() {
        let projector = this._projector.instance;
        return projector ? projector.getProjectionMatrix() : Matrix44.identity;
    }

    private updateFrustum() {
        let projector = this._projector.instance;
        if (projector) {
            projector.updateFrustum(this.entity.transform, 1);
        }
    }    

    private onTransformChanged() {     
        this.updateFrustum();   
    }

    private onProjectorChanged() {
        this.updateFrustum();
    }
}