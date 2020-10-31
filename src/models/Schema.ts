import { RestModel } from './restmodels'
import BasicRestModel from './restmodels/basic/BasicRestModel'
import BasicIdRestModel from './restmodels/basic/BasicIdRestModel'
import { ReducerType } from "./ReducerStorage";


export type StringOrNumberKeys<T> = { [P in keyof T]: T[P] extends (string | number) ? P : never }[keyof T];
export type Item = {
    [key: string]: ItemFieldType
};
type RequiredFields<T extends Item> = { [P in keyof T]: T[P] extends { type: any, required: true } ? P : T[P] extends [{ type: any, required: true }] ? P : never }[keyof T];
type OptionalFields<T extends Item> = { [P in keyof T]: T[P] extends { type: any, required: true } ? never : T[P] extends [{ type: any, required: true }] ? never : P }[keyof T];
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
export type ItemFieldWithParams<T> = { type: T, required?: true | false, nullable?: true | false }
export type ModelItemFieldWithParams = { type: RestModel<any>, required?: true | false, nullable?: true | false, idOnly?: true | false }
export type ItemFieldType<T = false> = ItemFieldBasicType<T> | [ItemFieldBasicType<T>] | ModelItemFieldWithParams | [ModelItemFieldWithParams] | ItemFieldWithParams<ItemFieldBasicType> | [ItemFieldWithParams<ItemFieldBasicType<T>>] | ItemFieldWithParams<ItemFieldBasicType<T>>[]
export type ItemFieldBasicType<T = false> = StringConstructor | BooleanConstructor | NumberConstructor | Schema<any> | RestModel<any> | (T extends true ? any : never)
export type IdPopulatedType<PopulatedType, IdKey extends keyof PopulatedType> = { [f in IdKey]: PopulatedType[IdKey] } & Partial<PopulatedType>
type CommonFieldType<arg> =
    arg extends StringConstructor ? string :
    arg extends BooleanConstructor ? boolean :
    arg extends NumberConstructor ? number :
    arg extends DateConstructor ? Date : arg
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
    arg extends BasicRestModel<infer S, infer Id> ? S['FullPopulatedType'] :
    arg extends BasicIdRestModel<infer S, infer Id> ? S['FullPopulatedType'] :
    arg extends Schema<any, any, infer FullPopulatedType> ? FullPopulatedType : CommonFieldType<arg>
type GetBasicPopulatedTypeField<arg, idOnly = false> =
    idOnly extends true ? (
        arg extends BasicRestModel<infer S, infer Id> ? S['PopulatedType'] :
        arg extends BasicIdRestModel<infer S, infer Id> ? S['PopulatedType'] :
        arg extends Schema<any, infer PopulatedType> ? PopulatedType : CommonFieldType<arg>
    ) : (
        arg extends BasicRestModel<infer S, infer Id> ? IdPopulatedType<S['PopulatedType'], Id> :
        arg extends BasicIdRestModel<infer S, infer Id> ? IdPopulatedType<S['PopulatedType'], Id> :
        arg extends Schema<any, infer PopulatedType> ? PopulatedType : CommonFieldType<arg>
    )
export type RealTypeField<arg extends ItemFieldType<any>> =
    arg extends { type: any, nullable: true } ? ArrayRealTypeField<arg> | null : ArrayRealTypeField<arg>
type ArrayRealTypeField<arg> =
    arg extends [infer c] ? GetRealTypeField<c>[] : GetRealTypeField<arg>
type GetRealTypeField<arg> =
    arg extends { type: infer c } ?
    arg extends { type: infer c, idOnly: true } ? GetBasicRealTypeField<c> : GetBasicRealTypeField<c, true>
    : GetBasicRealTypeField<arg>
type GetBasicRealTypeField<arg, idOnly = false> =
    idOnly extends true ? (
        arg extends BasicRestModel<infer S, infer Id> ? S['RealType'] :
        arg extends BasicIdRestModel<infer S, infer Id> ? S['RealType'] :
        arg extends Schema<infer RealType, infer d> ? { [k in keyof RealType]: RealType[k] } : CommonFieldType<arg>
    ) : (
        arg extends BasicRestModel<infer S, infer Id> ? S['RealType'][Id] :
        arg extends BasicIdRestModel<infer S, infer Id> ? S['RealType'][Id] :
        arg extends Schema<infer RealType, infer d> ? RealType : CommonFieldType<arg>
    )
export type SchemaFullPopulatedType<T extends Item> = keyof T extends never ? {} : OptionalFields<T> extends never ? {
    -readonly [P in keyof T]: FullPopulatedTypeField<T[P]>
} : Optional<{
    -readonly [P in keyof T]: FullPopulatedTypeField<T[P]>
}, OptionalFields<T>>
export type SchemaPopulatedType<T extends Item> = keyof T extends never ? {} : OptionalFields<T> extends never ? {
    -readonly [P in keyof T]: PopulatedTypeField<T[P]>
} : Optional<{
    -readonly [P in keyof T]: PopulatedTypeField<T[P]>
}, OptionalFields<T>>
export type SchemaRealType<T extends Item> = keyof T extends never ? {} : OptionalFields<T> extends never ? {
    -readonly [P in keyof T]: RealTypeField<T[P]>
} : Optional<{
    -readonly [P in keyof T]: RealTypeField<T[P]>
}, OptionalFields<T>>
function fieldIsExtendedFormat(property: ItemFieldType): property is ItemFieldWithParams<any> {
    return property.hasOwnProperty('type')
}
function isBasicModel(property: any): property is BasicIdRestModel {
    return property.constructor === BasicIdRestModel || property.constructor === BasicRestModel
}
export function fieldIsSchema(property: any): property is Schema<any> {
    return property && typeof property === 'object' && property.constructor === Schema
}
export type DeleteFieldSchema<T> = {
    0: T
} & Array<T>

export type SchemaWithoutKeys<S extends Schema<any>, K extends DeleteFieldSchema<keyof S['RealType']>> = Schema<{
    [K2 in Exclude<keyof S['RealType'], K[number]>]: S['RealType'][K2]
}, {
        [K2 in Exclude<keyof S['PopulatedType'], K[number]>]: S['PopulatedType'][K2]
    }, {
        [K2 in Exclude<keyof S['FullPopulatedType'], K[number]>]: S['FullPopulatedType'][K2]
    }>
interface DeleteFieldsType<S extends Schema<any>> {
    <K extends DeleteFieldSchema<keyof S['RealType']>>
        (...keys: K): Schema<{
            [K2 in Exclude<keyof S['RealType'], K[number]>]: S['RealType'][K2]
        }, {
                [K2 in Exclude<keyof S['PopulatedType'], K[number]>]: S['PopulatedType'][K2]
            }, {
                [K2 in Exclude<keyof S['FullPopulatedType'], K[number]>]: S['FullPopulatedType'][K2]
            }>
}
interface UpdateFieldsType<RT extends object, PT extends object, FPT extends object> {
    <I extends Item>(newSchema: I): Schema<{
        [K2 in keyof RT | keyof I]: K2 extends keyof RT ? RT[K2] : K2 extends keyof I ? SchemaRealType<Pick<I, K2>>[keyof SchemaRealType<Pick<I, K2>>] : never
    }, {
            [K2 in keyof PT | keyof I]: K2 extends keyof PT ? PT[K2] : K2 extends keyof I ? SchemaPopulatedType<Pick<I, K2>>[keyof SchemaPopulatedType<Pick<I, K2>>] : never
        }, {
            [K2 in keyof FPT | keyof I]: K2 extends keyof FPT ? FPT[K2] : K2 extends keyof I ? SchemaFullPopulatedType<Pick<I, K2>>[keyof SchemaFullPopulatedType<Pick<I, K2>>] : never
        }>
}
export class Schema<RealType extends { [key: string]: any } = any, PopulatedType extends { [key: string]: any } = any, FullPopulatedType extends { [key: string]: any } = any>{
    public readonly _schema: Item
    public readonly _subSchema?: Schema<any>
    private functionToConvert?: { key: string, fx: (el: any) => any }
    constructor(schema: Item, subSchema?: Schema<any>) {
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
    protected fieldIsSchema(property: ItemFieldType): property is Schema<any> {
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
    private getErrorFromItemProperty(item: any, property: ItemFieldType, nullable: boolean, idOnly: boolean = false): any {
        if (this._fieldIsAnIdModel(property)) {
            if (idOnly)
                return this.getErrorFromItemProperty(item, property.idType, nullable)
            return property.model.schema.getValidateError(item)
        }
        if (this.fieldIsSchema(property)) return property.getValidateError(item)
        if (item === null && !nullable) {
            return `Received null, not marked as nullable.`
        }
        if (item.constructor !== property) {
            return `Received: \n  ${JSON.stringify(item, null, 2)}\nExpected:\n  ${(property as StringConstructor).name}`
        }
        throw new Error('Called getErrorFromItemProperty and not errors found.')
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

    public deleteFields: DeleteFieldsType<this> = (...fields) => {
        let schema = Object.assign({}, this._schema)
        fields.forEach(f => {
            const { [f]: toBeDelete, ...other } = schema
            schema = other
        })
        if (this._subSchema)
            return new Schema(schema, this._subSchema.deleteFields(...fields))
        return new Schema(schema)
    }
    /**
     * 
     * @param f field to update
     * @param fx function in order to convert the field
     */
    public updateField<Field extends keyof RealType, ReturnType>(f: Field, fx: (value: RealType[Field]) => ReturnType): Schema<{
        [K2 in keyof RealType]: K2 extends Field ? ReturnType : RealType[K2]
    }, {
            [K2 in keyof PopulatedType]: K2 extends Field ? ReturnType : PopulatedType[K2]
        }, {
            [K2 in keyof FullPopulatedType]: K2 extends Field ? ReturnType : FullPopulatedType[K2]
        }> {
        const schema = new Schema({}, this)
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
    private getValidateError(str: any): any {
        if (typeof str !== 'object') {
            return `Expected Object, found:
                ${JSON.stringify(str, null, 2)}`
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
            if (required && !str.hasOwnProperty(key)) return { [key]: 'Marked as required, not found' }
            if (str.hasOwnProperty(key)) {
                if (isArray) {
                    if (str[key] === null) {
                        if (!nullable) {
                            return { [key]: 'Received null, not marked as nullable' }
                        }
                    } else {
                        if (!Array.isArray(str[key])) {
                            return { [key]: 'Is not an array' }
                        }
                        for (let i = 0; i < str[key].length; i++) {
                            if (!this.isItemFromProperty(str[key][i], type, nullable, idOnly))
                                return { [key]: this.getErrorFromItemProperty(str[key][i], type, nullable, idOnly) }
                        }
                    }
                } else {
                    if (!this.isItemFromProperty(str[key], type, nullable, idOnly)) {
                        return { [key]: this.getErrorFromItemProperty(str[key], type, nullable, idOnly) }
                    }
                }
            }
        }
        if (this._subSchema) return this._subSchema.getValidateError(str)
        throw new Error('Called getValidateError and not errors found. Check first errors with validate function.')
    }
    public getValidateErrorPretty(str: any) {
        let error = this.getValidateError(str)
        let keys: string[] = []
        while (typeof error !== 'string') {
            const k = Object.keys(error)[0]
            keys.push(k)
            error = error[k]
        }
        return `Validate error on path "${keys.join('.')}"\n${error}`
    }
    public getValidateArrayError(str: any): any {
        if (Array.isArray(str)) {
            for (let i = 0; i < str.length; i++) {
                if (!this.validate(str[i]))
                    return this.getValidateErrorPretty(str[i])
            }
            throw new Error('Called getValidateArrayError and not errors found. Check first errors with validateArray function.')
        }
        return `Expected Array, found:
            ${JSON.stringify(str, null, 2)}`
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