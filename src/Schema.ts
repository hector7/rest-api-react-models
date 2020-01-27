import { Schema as SchemaClass, Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model as OriginalModel } from '@rest-api/redux'
import Model from './Model'

export class Schema<ItemType extends SchemaNamespace.Item,
    RealType extends SchemaNamespace.RealType<ItemType>,
    PopulatedType extends SchemaNamespace.Type<ItemType>> extends SchemaClass<ItemType, RealType, PopulatedType>{
    protected _fieldIsBasicModel(property: any): property is OriginalModel<any, any, any, any, any, any> {
        if (super._fieldIsBasicModel(property)) return true
        return property.constructor === Model
    }
    protected fieldIsSchema(property: any): property is SchemaClass<any, any, any> {
        if (super.fieldIsSchema(property)) return true
        return property.constructor === Schema
    }
    _getModelValues(item: RealType, callback: (model: OriginalModel<any, any, any, any, any, any, any, any>, id: any) => void) {
        super._getModelValues(item, callback)
    }
}