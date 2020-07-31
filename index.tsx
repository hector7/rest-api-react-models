import React from 'react'
import { Provider as DefaultProvider, ReactReduxContextValue, createSelectorHook, createDispatchHook } from 'react-redux'
import { Types, configureStore } from '@rest-api/redux'
export { HttpError, Callback, filterNulls } from '@rest-api/redux'
import Model, { Schema as SchemaClass, BasicIdRestModel, ComplexIdRestModel } from './src/DataTypes'
import { RestModel } from '@rest-api/redux/src/restmodels'
import { default as BasicRestModel } from './src/DataTypes'
export { default as Model } from './src/DataTypes'
const { required } = Types
export { required, required as idOnly }
const initialContext: any = null
const Context = React.createContext<ReactReduxContextValue<any, any>>(initialContext)
export function Schema<I extends Item>(schema: I) {
    return new SchemaClass<RealType<I>, PopulatedType<I>, FullPopulatedType<I>>(schema)
}
export const useSelector = createSelectorHook(Context)
export const useDispatch = createDispatchHook(Context)

export type ModelType<M extends Model<any, any, any, any> | SchemaClass<any>> =
    M extends Model<infer T, any, any, any> ? T["RealType"] :
    M extends SchemaClass<any> ? M["RealType"] : never
export type PopulatedModelType<M extends Model<any, any, any, any> | SchemaClass<any>> =
    M extends Model<infer T, any, any, any> ? T['PopulatedType'] :
    M extends SchemaClass<any> ? M['PopulatedType'] : never
export type FullPopulatedModelType<M extends Model<any, any, any, any> | SchemaClass<any>> =
    M extends Model<infer T, any, any, any> ? T['FullPopulatedType'] :
    M extends SchemaClass<any> ? M['FullPopulatedType'] : never

export function getProvider() {
    const store = configureStore()
    const Provider: React.FC<{}> = (props) => {
        return <DefaultProvider {...props} store={store} context={Context} />
    }
    return Provider
}

type Uniform<T extends { [K: string]: any }> = { [K in keyof T]: T[K] }
type Item = {
    [key: string]: ItemFieldType
};
type RequiredFields<T extends Item> = { [P in keyof T]: T[P] extends { type: any, required: true } ? P : T[P] extends [{ type: any, required: true }] ? P : never }[keyof T];
type OptionalFields<T extends Item> = { [P in keyof T]: T[P] extends { type: any, required: true } ? never : T[P] extends [{ type: any, required: true }] ? never : P }[keyof T];

type ItemFieldWithParams<T> = { type: T, required?: true | false }
type ModelItemFieldWithParams = { type: RestModel<any, any, any, any, any>, required?: true | false, idOnly?: true | false }
type ItemFieldType = ItemFieldBasicType | [ItemFieldBasicType] | ModelItemFieldWithParams | [ModelItemFieldWithParams] | ItemFieldWithParams<ItemFieldBasicType> | [ItemFieldWithParams<ItemFieldBasicType>] | ItemFieldWithParams<ItemFieldBasicType>[]
type ItemFieldBasicType = StringConstructor | BooleanConstructor | NumberConstructor | DateConstructor | SchemaClass<any, any, any> | RestModel<any, any, any, any, any>
type IdPopulatedType<PopulatedType, IdKey extends keyof PopulatedType> = Uniform<Record<IdKey, PopulatedType[IdKey]> & Partial<PopulatedType>>
type CommonFieldType<arg> =
    arg extends StringConstructor ? string :
    arg extends BooleanConstructor ? boolean :
    arg extends NumberConstructor ? number :
    arg extends DateConstructor ? Date : never
type PopulatedTypeField<arg extends Item['']> =
    arg extends [infer c] ? GetPopulatedTypeField<c>[] : GetPopulatedTypeField<arg>
type FullPopulatedTypeField<arg extends Item['']> =
    arg extends [infer c] ? GetFullPopulatedTypeField<c>[] : GetFullPopulatedTypeField<arg>
type GetPopulatedTypeField<arg> =
    arg extends { type: infer c } ? arg extends { type: infer c, idOnly: true } ? GetBasicPopulatedTypeField<c> : GetBasicPopulatedTypeField<c, true> : GetBasicPopulatedTypeField<arg>
type GetFullPopulatedTypeField<arg> =
    arg extends { type: infer c } ? GetBasicFullPopulatedTypeField<c> : GetBasicFullPopulatedTypeField<arg>
type GetBasicFullPopulatedTypeField<arg> =
    arg extends BasicRestModel<infer S, infer Id, any, any> ? S['FullPopulatedType'] :
    arg extends BasicIdRestModel<infer S, infer Id> ? S['FullPopulatedType'] :
    arg extends ComplexIdRestModel<any, infer S, infer Id> ? S['FullPopulatedType'][] :
    arg extends SchemaClass<any, any, infer FullPopulatedType> ? FullPopulatedType : CommonFieldType<arg>
type GetBasicPopulatedTypeField<arg, idOnly = false> =
    idOnly extends true ? (
        arg extends BasicRestModel<infer S, infer Id, any, any> ? S['PopulatedType'] :
        arg extends BasicIdRestModel<infer S, infer Id> ? S['PopulatedType'] :
        arg extends ComplexIdRestModel<any, infer S, infer Id> ? S['PopulatedType'][] :
        arg extends SchemaClass<any, infer PopulatedType, any> ? PopulatedType : CommonFieldType<arg>
    ) : (
        arg extends BasicRestModel<infer S, infer Id, any, any> ? IdPopulatedType<S['PopulatedType'], Id> :
        arg extends BasicIdRestModel<infer S, infer Id> ? IdPopulatedType<S['PopulatedType'], Id> :
        arg extends ComplexIdRestModel<any, infer S, infer Id> ? S['PopulatedType'][] :
        arg extends SchemaClass<any, infer PopulatedType, any> ? PopulatedType : CommonFieldType<arg>
    )
type RealTypeField<arg extends Item['']> =
    arg extends [infer c] ? GetRealTypeField<c>[] : GetRealTypeField<arg>
type GetRealTypeField<arg> =
    arg extends { type: infer c } ?
    arg extends { type: infer c, idOnly: true } ? GetBasicRealTypeField<c> : GetBasicRealTypeField<c, true>
    : GetBasicRealTypeField<arg>
type GetBasicRealTypeField<arg, idOnly = false> =
    idOnly extends true ? (
        arg extends BasicRestModel<infer S, infer Id, any, any> ? S['RealType'] :
        arg extends BasicIdRestModel<infer S, infer Id> ? S['RealType'] :
        arg extends ComplexIdRestModel<any, infer S, infer Id> ? never :
        arg extends SchemaClass<infer RealType, infer d, any> ? RealType : CommonFieldType<arg>
    ) : (
        arg extends BasicRestModel<infer S, infer Id, any, any> ? S['RealType'][Id] :
        arg extends BasicIdRestModel<infer S, infer Id> ? S['RealType'][Id] :
        arg extends ComplexIdRestModel<any, infer S, infer Id> ? never :
        arg extends SchemaClass<infer RealType, infer d, any> ? RealType : CommonFieldType<arg>
    )
type FullPopulatedType<T extends Item> = Uniform<keyof T extends never ? {} : {
    -readonly [P in Exclude<keyof T, OptionalFields<T>>]: FullPopulatedTypeField<T[P]>
} & {
        -readonly [P in Exclude<keyof T, RequiredFields<T>>]?: FullPopulatedTypeField<T[P]>
    }>
type PopulatedType<T extends Item> = Uniform<keyof T extends never ? {} : {
    -readonly [P in Exclude<keyof T, OptionalFields<T>>]: PopulatedTypeField<T[P]>
} & {
        -readonly [P in Exclude<keyof T, RequiredFields<T>>]?: PopulatedTypeField<T[P]>
    }>
type RealType<T extends Item> = Uniform<keyof T extends never ? {} : {
    -readonly [P in Exclude<keyof T, OptionalFields<T>>]: RealTypeField<T[P]>
} & {
        -readonly [P in Exclude<keyof T, RequiredFields<T>>]?: RealTypeField<T[P]>
    }>