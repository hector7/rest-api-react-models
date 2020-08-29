import { RestModel } from './restmodels'
import BasicRestModel from './restmodels/basic/BasicRestModel'
import BasicIdRestModel from './restmodels/basic/BasicIdRestModel'
import { ReducerType } from "./ReducerStorage";


export type StringOrNumberKeys<T> = { [P in keyof T]: T[P] extends (string | number) ? P : never }[keyof T];
export type Uniform<T extends { [K: string]: any }> = { [K in keyof T]: T[K] }
export type Item = {
    [key: string]: ItemFieldType
};
type RequiredFields<T extends Item> = { [P in keyof T]: T[P] extends { type: any, required: true } ? P : T[P] extends [{ type: any, required: true }] ? P : never }[keyof T];
type OptionalFields<T extends Item> = { [P in keyof T]: T[P] extends { type: any, required: true } ? never : T[P] extends [{ type: any, required: true }] ? never : P }[keyof T];

export type ItemFieldWithParams<T> = { type: T, required?: true | false, nullable?: true | false }
export type ModelItemFieldWithParams = { type: RestModel<any, any, any, any, any>, required?: true | false, nullable?: true | false, idOnly?: true | false }
export type ItemFieldType = ItemFieldBasicType | [ItemFieldBasicType] | ModelItemFieldWithParams | [ModelItemFieldWithParams] | ItemFieldWithParams<ItemFieldBasicType> | [ItemFieldWithParams<ItemFieldBasicType>] | ItemFieldWithParams<ItemFieldBasicType>[]
export type ItemFieldBasicType = StringConstructor | BooleanConstructor | NumberConstructor | DateConstructor | Schema<any, any, any> | RestModel<any, any, any, any, any>
export type IdPopulatedType<PopulatedType, IdKey extends keyof PopulatedType> = Uniform<Record<IdKey, PopulatedType[IdKey]> & Partial<PopulatedType>>
type CommonFieldType<arg> =
    arg extends StringConstructor ? string :
    arg extends BooleanConstructor ? boolean :
    arg extends NumberConstructor ? number :
    arg extends DateConstructor ? Date : never
export type PopulatedTypeField<arg extends Item['']> =
    arg extends { type: any, nullable: true } ? PopulatedArrayRealTypeField<arg> | null : PopulatedArrayRealTypeField<arg>
type PopulatedArrayRealTypeField<arg> =
    arg extends [infer c] ? GetPopulatedTypeField<c>[] : GetPopulatedTypeField<arg>
type FullPopulatedTypeField<arg extends Item['']> =
    arg extends { type: any, nullable: true } ? FullPopulatedArrayRealTypeField<arg> | null : FullPopulatedArrayRealTypeField<arg>
type FullPopulatedArrayRealTypeField<arg> =
    arg extends [infer c] ? GetFullPopulatedTypeField<c>[] : GetFullPopulatedTypeField<arg>
type GetPopulatedTypeField<arg> =
    arg extends { type: infer c } ? arg extends { type: infer c, idOnly: true } ? GetBasicPopulatedTypeField<c> : GetBasicPopulatedTypeField<c, true> : GetBasicPopulatedTypeField<arg>
type GetFullPopulatedTypeField<arg> =
    arg extends { type: infer c } ? GetBasicFullPopulatedTypeField<c> : GetBasicFullPopulatedTypeField<arg>
type GetBasicFullPopulatedTypeField<arg> =
    arg extends BasicRestModel<infer S, infer Id, any, any> ? S['FullPopulatedType'] :
    arg extends BasicIdRestModel<infer S, infer Id> ? S['FullPopulatedType'] :
    arg extends Schema<any, any, infer FullPopulatedType> ? FullPopulatedType : CommonFieldType<arg>
type GetBasicPopulatedTypeField<arg, idOnly = false> =
    idOnly extends true ? (
        arg extends BasicRestModel<infer S, infer Id, any, any> ? S['PopulatedType'] :
        arg extends BasicIdRestModel<infer S, infer Id> ? S['PopulatedType'] :
        arg extends Schema<any, infer PopulatedType, any> ? PopulatedType : CommonFieldType<arg>
    ) : (
        arg extends BasicRestModel<infer S, infer Id, any, any> ? IdPopulatedType<S['PopulatedType'], Id> :
        arg extends BasicIdRestModel<infer S, infer Id> ? IdPopulatedType<S['PopulatedType'], Id> :
        arg extends Schema<any, infer PopulatedType, any> ? PopulatedType : CommonFieldType<arg>
    )
export type RealTypeField<arg extends Item['']> =
    arg extends { type: any, nullable: true } ? ArrayRealTypeField<arg> | null : ArrayRealTypeField<arg>
type ArrayRealTypeField<arg> =
    arg extends [infer c] ? GetRealTypeField<c>[] : GetRealTypeField<arg>
type GetRealTypeField<arg> =
    arg extends { type: infer c } ?
    arg extends { type: infer c, idOnly: true } ? GetBasicRealTypeField<c> : GetBasicRealTypeField<c, true>
    : GetBasicRealTypeField<arg>
type GetBasicRealTypeField<arg, idOnly = false> =
    idOnly extends true ? (
        arg extends BasicRestModel<infer S, infer Id, any, any> ? S['RealType'] :
        arg extends BasicIdRestModel<infer S, infer Id> ? S['RealType'] :
        arg extends Schema<infer RealType, infer d, any> ? RealType : CommonFieldType<arg>
    ) : (
        arg extends BasicRestModel<infer S, infer Id, any, any> ? S['RealType'][Id] :
        arg extends BasicIdRestModel<infer S, infer Id> ? S['RealType'][Id] :
        arg extends Schema<infer RealType, infer d, any> ? RealType : CommonFieldType<arg>
    )
export type SchemaFullPopulatedType<T extends Item> = Uniform<keyof T extends never ? {} : {
    -readonly [P in Exclude<keyof T, OptionalFields<T>>]: FullPopulatedTypeField<T[P]>
} & {
        -readonly [P in Exclude<keyof T, RequiredFields<T>>]?: FullPopulatedTypeField<T[P]>
    }>
export type SchemaPopulatedType<T extends Item> = Uniform<keyof T extends never ? {} : {
    -readonly [P in Exclude<keyof T, OptionalFields<T>>]: PopulatedTypeField<T[P]>
} & {
        -readonly [P in Exclude<keyof T, RequiredFields<T>>]?: PopulatedTypeField<T[P]>
    }>
export type SchemaRealType<T extends Item> = Uniform<keyof T extends never ? {} : {
    -readonly [P in Exclude<keyof T, OptionalFields<T>>]: RealTypeField<T[P]>
} & {
        -readonly [P in Exclude<keyof T, RequiredFields<T>>]?: RealTypeField<T[P]>
    }>
function fieldIsExtendedFormat(property: ItemFieldType): property is ItemFieldWithParams<any> {
    return property.hasOwnProperty('type')
}
function isBasicModel(property: any): property is BasicIdRestModel {
    return property.constructor === BasicIdRestModel || property.constructor === BasicRestModel
}
export function fieldIsSchema(property: any): property is Schema<any, any, any> {
    return property && typeof property === 'object' && property.constructor === Schema
}
type DeleteFieldSchema<T> = {
    0: T
} & Array<T>
interface DeleteFieldsType<RT extends object, PT extends object, FPT extends object> {
    <K extends DeleteFieldSchema<keyof RT>>
        (...keys: K): Schema<{
            [K2 in Exclude<keyof RT, K[number]>]: RT[K2]
        }, {
                [K2 in Exclude<keyof PT, K[number]>]: PT[K2]
            }, {
                [K2 in Exclude<keyof FPT, K[number]>]: FPT[K2]
            }>
}
interface UpdateFieldsType<RT extends object, PT extends object, FPT extends object> {
    <I extends Item>(newSchema: I): Schema<{
        [K2 in Exclude<keyof RT, keyof I>]: RT[K2]
    } & SchemaRealType<I>, {
        [K2 in Exclude<keyof PT, keyof I>]: PT[K2]
    } & SchemaPopulatedType<I>, {
        [K2 in Exclude<keyof FPT, keyof I>]: FPT[K2]
    } & SchemaFullPopulatedType<I>>
}
export class Schema<RealType extends { [key: string]: any }, PopulatedType extends { [key: string]: any } = any, FullPopulatedType extends { [key: string]: any } = any>{
    public readonly _schema: Item
    public readonly _subSchema?: Schema<any, any, any>
    private functionToConvert?: { key: string, fx: (el: any) => any }
    constructor(schema: Item, subSchema?: Schema<any, any, any>) {
        this._schema = schema
        this._subSchema = subSchema
    }
    get RealType(): RealType {
        throw ('This getter is only for typing reasons')
    }
    get PopulatedType(): PopulatedType {
        throw ('This getter is only for typing reasons')
    }
    get FullPopulatedType(): FullPopulatedType {
        throw ('This getter is only for typing reasons')
    }
    static getSchema<I extends Item>(schema: I) {
        return new Schema<SchemaRealType<I>, SchemaPopulatedType<I>, SchemaFullPopulatedType<I>>(schema)
    }
    protected _fieldIsAnIdModel(property: ItemFieldType): property is BasicIdRestModel {
        return isBasicModel(property)
    }
    private fieldIsExtendedFormatWithModel(property: ItemFieldType): property is ModelItemFieldWithParams {
        if (fieldIsExtendedFormat(property)) {
            return this._fieldIsAnIdModel(property.type)
        }
        return false
    }
    protected fieldIsSchema(property: ItemFieldType): property is Schema<any, any, any> {
        return fieldIsSchema(property)
    }
    private isItemFromProperty(item: any, property: ItemFieldType, nullable: boolean, idOnly: boolean = false): boolean {
        if (this._fieldIsAnIdModel(property)) {
            if (idOnly)
                return this.isItemFromProperty(item, property.idType, nullable)
            return property.model.schema.validate(item)
        }
        if (this.fieldIsSchema(property)) return property.validate(item)
        if (item === null) {
            return nullable
        }
        return (item.constructor === property)
    }
    private get keys(): string[] {
        if (this._subSchema)
            return Object.keys(this._schema).concat(this._subSchema.keys)
        return Object.keys(this._schema)
    }
    public updateSchema: UpdateFieldsType<RealType, PopulatedType, FullPopulatedType> = schema => {
        const ownKeys = this.keys
        const targetKeys = Object.keys(schema)
        const matchingKeys = ownKeys.filter(k => targetKeys.indexOf(k) >= 0)
        return new Schema({
            ...this._schema,
            ...matchingKeys
                .map(k => ({ k, v: schema[k] }))
                .reduce((o: any, next) => {
                    o[next.k] = next.v
                    return o
                }, {})
        }, new Schema(schema).deleteFields(...matchingKeys as any))
    }

    public deleteFields: DeleteFieldsType<RealType, PopulatedType, FullPopulatedType> = (...fields) => {
        let schema = Object.assign({}, this._schema)
        fields.forEach(f => {
            const { [f]: toBeDelete, ...other } = schema
            schema = other
        })
        if (this._subSchema)
            return new Schema(schema, this._subSchema.deleteFields(...fields))
        return new Schema(schema)
    }
    public updateField<Field extends keyof RealType, ReturnType extends ItemFieldType>(f: Field, newDef: ReturnType, fx: (value: RealType[Field]) => RealTypeField<ReturnType>) {
        const schema = new Schema<Omit<RealType, Field> & { [f in Field]: ReturnType }, Omit<PopulatedType, Field> & { [f in Field]: ReturnType }, Omit<FullPopulatedType, Field> & { [f in Field]: ReturnType }>({ [f as string]: newDef }, this.deleteFields(f))
        schema.functionToConvert = { key: f as string, fx }
        return schema
    }
    /** @internal */
    public _useUpdatedSteps(state: ReducerType, item: any): RealType {
        let r: { [key: string]: any } = item
        if (this._subSchema) {
            r = this._subSchema._useUpdatedSteps(state, item)
        }
        if (this.functionToConvert !== undefined) {
            r[this.functionToConvert.key] = this.functionToConvert.fx(r[this.functionToConvert.key])
        }
        return r as any
    }
    /** @internal */
    public _isPopulated(state: ReducerType, item: RealType): boolean {
        let key: string
        for (key in this._schema) {
            if (item.hasOwnProperty(key)) {
                // check arrays and required property.
                const gField = this._schema[key]
                const isArray = fieldIsExtendedFormat(gField) ? Array.isArray(gField.type) : Array.isArray(gField)
                const field = Array.isArray(gField) ? gField[0] : gField
                const type = fieldIsExtendedFormat(field) ? field.type : field
                const idOnly = this.fieldIsExtendedFormatWithModel(field) ? field.idOnly === true : false
                if (this._fieldIsAnIdModel(type)) {
                    if (idOnly) {
                        if (isArray) {
                            const array = (<any>item)[key]
                            for (let i = 0; i < array.length; i++) {
                                const getByIdResult = type._reducer.getById(state, array[i])
                                if (!getByIdResult) return false
                            }
                        } else {
                            if (!type._reducer.getById(state, item[key])) return false
                        }
                    }
                } else if (this.fieldIsSchema(type)) {
                    if (isArray) {
                        const array = (<any>item)[key]
                        for (let i = 0; i < array.length; i++) {
                            const getByIdResult = type._isPopulated(state, array[i])
                            if (!getByIdResult) return false
                        }
                    } else {
                        if (!type._isPopulated(state, (<any>item)[key])) return false
                    }
                }
            }
        }
        return true
    }
    /** @internal */
    public _convertToPopulated(state: ReducerType, item: RealType): PopulatedType {
        let key: string
        let result: any = Object.assign({}, item)
        for (key in this._schema) {
            if (item.hasOwnProperty(key)) {
                // check arrays and required property.
                const gField = this._schema[key]
                const isArray = fieldIsExtendedFormat(gField) ? Array.isArray(gField.type) : Array.isArray(gField)
                const field = Array.isArray(gField) ? gField[0] : gField
                const type = fieldIsExtendedFormat(field) ? field.type : field
                const idOnly = this.fieldIsExtendedFormatWithModel(field) ? field.idOnly === true : false
                if (this._fieldIsAnIdModel(type)) {
                    if (idOnly) {
                        if (isArray) {
                            result[key] = (<any>item)[key].map((object: any) => {
                                const getByIdResult = type._reducer.getById(state, object)
                                return getByIdResult ? type.model.schema._convertToPopulated(state, getByIdResult) : { [type._id]: object }
                            })
                        } else {
                            const getByIdResult = type._reducer.getById(state, item[key])
                            result[key] = getByIdResult ? type.model.schema._convertToPopulated(state, getByIdResult) : { [type._id]: (<any>item)[key] }
                        }
                    }
                } else if (this.fieldIsSchema(type)) {
                    if (isArray) {
                        result[key] = (<any>item)[key].map((object: any) => {
                            return type._convertToPopulated(state, object)
                        })
                    } else {
                        result[key] = type._convertToPopulated(state, (<any>item)[key])
                    }
                }
            }
        }
        return result
    }
    public _getModelValuesToPopulate(item: RealType, callback: (model: BasicIdRestModel, id: any) => void) {
        let key: string
        for (key in this._schema) {
            if (item.hasOwnProperty(key)) {
                // check arrays and required property.
                const gField = this._schema[key]
                const isArray = fieldIsExtendedFormat(gField) ? Array.isArray(gField.type) : Array.isArray(gField)
                const field = Array.isArray(gField) ? gField[0] : gField
                const type = fieldIsExtendedFormat(field) ? field.type : field
                const idOnly = this.fieldIsExtendedFormatWithModel(field) ? field.idOnly === true : false
                if (this._fieldIsAnIdModel(type)) {
                    if (idOnly) {
                        if (isArray) {
                            (<any>item)[key].forEach((object: any, idx: number) => {
                                callback(type, object)
                            })
                        } else {
                            callback(type, (<any>item)[key])
                        }
                    }
                } else if (this.fieldIsSchema(type)) {
                    if (isArray) {
                        (<any>item)[key].forEach((object: any, idx: number) => {
                            type._getModelValuesToPopulate(object, callback)
                        })
                    } else {
                        type._getModelValuesToPopulate((<any>item)[key], callback)
                    }
                }
            }
        }
    }
    public validate(str: any): str is RealType {
        if (process.env.NODE_ENV === 'production') return true
        if (typeof str !== 'object') {
            return false
        }
        let key: string
        for (key in this._schema) {
            // check arrays and required property.
            const gField = this._schema[key]
            const isArray = fieldIsExtendedFormat(gField) ? Array.isArray(gField.type) : Array.isArray(gField)
            const field = Array.isArray(gField) ? gField[0] : gField
            const type = fieldIsExtendedFormat(field) ? field.type : field
            const required = fieldIsExtendedFormat(gField) && gField.required === true
            const idOnly = this.fieldIsExtendedFormatWithModel(field) ? field.idOnly === true : false
            const nullable = fieldIsExtendedFormat(field) ? field.nullable === true : false
            if (required && !str.hasOwnProperty(key)) return false
            if (str.hasOwnProperty(key)) {
                if (isArray) {
                    if (str[key] === null) {
                        if (!nullable) {
                            return false
                        }
                    } else {
                        if (!Array.isArray(str[key])) {
                            return false
                        }
                        for (let i = 0; i < str[key].length; i++) {
                            if (!this.isItemFromProperty(str[key][i], type, nullable, idOnly)) return false
                        }
                    }
                } else {
                    if (!this.isItemFromProperty(str[key], type, nullable, idOnly)) {
                        return false
                    }
                }
            }
        }
        if (this._subSchema) return this._subSchema.validate(str)
        return true
    }
    public validateArray(str: any): str is RealType[] {
        if (process.env.NODE_ENV === 'production') return true
        if (Array.isArray(str)) {
            return str.every(r => this.validate(r))
        }
        return false
    }
}
export default Schema.getSchema