import React from 'react'
import { Provider as DefaultProvider, ReactReduxContextValue, InferableComponentEnhancerWithProps, createSelectorHook, createDispatchHook } from 'react-redux'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Types, configureStore } from '@rest-api/redux'
import Model, { Schema as SchemaClass } from './src/DataTypes'
import { SchemaTypes } from '@rest-api/redux/src/Schema'
export { default as Model } from './src/DataTypes'
export * from '@rest-api/redux'
const { required } = Types
export { required }
const initialContext: any = null
const Context = React.createContext<ReactReduxContextValue<any, any>>(initialContext)
export function Schema<ItemType extends SchemaNamespace.Item,
    RealType extends SchemaNamespace.RealType<ItemType>,
    PopulatedType extends SchemaNamespace.Type<ItemType>>(schema: ItemType) {
    return new SchemaClass<ItemType, RealType, PopulatedType>(schema)
}
export const useSelector = createSelectorHook(Context)
export const useDispatch = createDispatchHook(Context)
export type ModelType<M extends Model<any, any, any, any, any, any, any> | SchemaClass<any, any, any>> =
    M extends Model<any, infer T, any, any, any, any, any> ? T :
    M extends SchemaClass<any, infer T, any> ? T : never
export type ModelPopulatedType<M extends Model<any, any, any, any, any, any, any> | SchemaClass<any, any, any>> =
    M extends Model<any, any, infer T, any, any, any, any> ? T :
    M extends SchemaClass<any, any, infer T> ? T : never


export function getProvider() {
    const store = configureStore()
    const Provider: React.FC<{}> = (props) => {
        return <DefaultProvider {...props} store={store} context={Context} />
    }
    return Provider
}