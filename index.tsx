import React from 'react'
import { Provider as DefaultProvider, ReactReduxContextValue, createSelectorHook, createDispatchHook } from 'react-redux'
import Model, { SchemaClass } from './src/DataTypes'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import ReducerStorage from './src/models/ReducerStorage'
export { default as Model, Schema, SchemaClass } from './src/DataTypes'
const TRUE: true = true
export { TRUE as required, TRUE as idOnly }
const initialContext: any = null
const Context = React.createContext<ReactReduxContextValue<any, any>>(initialContext)
export const useSelector = createSelectorHook(Context)
export const useDispatch = createDispatchHook(Context)
export type Callback<T, Err = Error> = (err: Err | null, res?: T) => void
export class HttpError {
    readonly codeNumber: number
    readonly date: Date
    readonly message: string
    constructor(status: number, message: string,) {
        this.codeNumber = status
        this.date = new Date()
        this.message = message
    }
}


export function createAction<T extends string>(type: T): Action<T>
export function createAction<T extends string, P>(type: T, payload: P): Action<T, P>
export function createAction<T extends string, P = {}>(type: T, payload?: P) {
    if (payload) {
        return { type, ...payload }
    }
    return { type }
}

export type ActionUnion<A extends { [actionsCreator: string]: (...args: any[]) => any }> = ReturnType<A[keyof A]>

export type Action<T extends string, P = {}> = {
    type: T
} & P

type MakeMetaDataOptions<GetItem, Item, MetaData> = {
    getItems: (data: GetItem) => Item[],
    getMetadata: (data: GetItem) => MetaData,
}
type MakeOptions<GetItem, Item> = {
    getItems?: (data: GetItem) => Item[],
    getMetadata?: never
}
type CommonOptions = {
    headers?: { [key: string]: string }
    trailingSlash?: boolean
}
export type Options<GetItem, Item, MetaData> = CommonOptions & (MetaData extends undefined ? MakeOptions<GetItem, Item> : MakeMetaDataOptions<GetItem, Item, MetaData>)

export type ProjectionType<T, Projection extends Partial<{ [key in keyof T]: 1 }>> = Pick<T, { [k in keyof T]: Projection[k] extends 1 ? k : never }[keyof T]>

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
    const store = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
    const Provider: React.FC<{}> = (props) => {
        return <DefaultProvider {...props} store={store} context={Context} />
    }
    return Provider
}
export function filterNulls<T, Q = T | null>(array: Q[]): T[] {
    return array.filter(el => el !== null) as any
}
