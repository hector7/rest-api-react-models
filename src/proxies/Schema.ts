import { Model as OriginalModel } from '@rest-api/redux'
import { Schema as SchemaClass } from '@rest-api/redux/src/Schema'
import Model from './Model'
import BasicIdRestModel from './BasicIdRestModel'
import ComplexIdRestModel from './ComplexIdRestModel'

export default class Schema<RealType,
    PopulatedType = any, FullPopulatedType = any> extends SchemaClass<RealType, PopulatedType, FullPopulatedType>{
    /** @internal */
    protected _fieldIsAnIdModel(property: any): property is OriginalModel<any, any, any, any, any, any> {
        if (super._fieldIsAnIdModel(property)) return true
        return property instanceof Model || property instanceof BasicIdRestModel || property instanceof ComplexIdRestModel
    }
    /** @internal */
    protected fieldIsSchema(property: any): property is SchemaClass<any, any, any> {
        if (super.fieldIsSchema(property)) return true
        return property instanceof Schema
    }
}