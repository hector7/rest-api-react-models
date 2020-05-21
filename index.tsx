import React from 'react'
import { Provider as DefaultProvider, ReactReduxContextValue, InferableComponentEnhancerWithProps, createSelectorHook, createDispatchHook } from 'react-redux'
import { Types, configureStore } from '@rest-api/redux'
import Model, { Schema as SchemaClass } from './src/DataTypes'
import { SchemaTypes } from '@rest-api/redux/src/Schema'
export { default as Model } from './src/DataTypes'
export * from '@rest-api/redux'
import { ModelType as OriginalModelType, PopulatedModelType as OriginalPopulatedModelType, FullPopulatedModelType as OriginalFullPopulatedModelType } from '@rest-api/redux'
const { required } = Types
export { required }
const initialContext: any = null
const Context = React.createContext<ReactReduxContextValue<any, any>>(initialContext)
export function Schema<I extends SchemaTypes.Item>(schema: I) {
    return new SchemaClass<SchemaTypes.RealType<I>, SchemaTypes.PopulatedType<I>, SchemaTypes.FullPopulatedType<I>>(schema)
}
export const useSelector = createSelectorHook(Context)
export const useDispatch = createDispatchHook(Context)

export type ModelType<M extends Model<any, any, any, any, any, any> | SchemaClass<any, any, any>> =
    M extends Model<infer T, any, any, any, any, any> ? T :
    M extends SchemaClass<infer T, any, any> ? T : OriginalModelType<M>
export type PopulatedModelType<M extends Model<any, any, any, any, any, any> | SchemaClass<any, any, any>> =
    M extends Model<any, infer T, any, any, any, any> ? T :
    M extends SchemaClass<any, infer T, any> ? T : OriginalPopulatedModelType<M>
export type FullPopulatedModelType<M extends Model<any, any, any, any, any, any> | SchemaClass<any, any, any>> =
    M extends Model<any, any, infer T, any, any, any> ? T :
    M extends SchemaClass<any, any, infer T> ? T : OriginalFullPopulatedModelType<M>
export type RealType<M extends Model<any, any, any, any, any, any> | SchemaClass<any, any, any>> =
    M extends Model<any, infer T, any, any, any, any> ? T :
    M extends SchemaClass<infer T, any, any> ? T : OriginalModelType<M>
export type PopulatedType<M extends Model<any, any, any, any, any, any> | SchemaClass<any, any, any>> =
    M extends Model<any, infer T, any, any, any, any> ? T :
    M extends SchemaClass<any, infer T, any> ? T : OriginalPopulatedModelType<M>


export function getProvider() {
    const store = configureStore()
    const Provider: React.FC<{}> = (props) => {
        return <DefaultProvider {...props} store={store} context={Context} />
    }
    return Provider
}