import React from 'react'
import { Provider as DefaultProvider, ReactReduxContextValue, InferableComponentEnhancerWithProps, createSelectorHook, createDispatchHook } from 'react-redux'
import { Schema as SchemaClass, Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Types, Model as OriginalModel, Redux, HttpError, configureStore } from '@rest-api/redux'
import { Get, useGet, default as connectGet } from './src/get'
import { Get as GetPopulated, useGetPopulated, default as connectGetPopulated } from './src/getPopulated'
import { GetById, useGetById, default as connectGetById } from './src/getById'
import { GetById as GetByIdPopulated, useGetByIdPopulated, default as connectGetByIdPopulated } from './src/getByIdPopulated'
export * from '@rest-api/redux'
const { required } = Types
export { required }
const initialContext: any = null
const Context = React.createContext<ReactReduxContextValue<any, any>>(initialContext)
export const useSelector = createSelectorHook(Context)
export const useDispatch = createDispatchHook(Context)

export type ModelType<M extends Model<any, any, any, any, any, any, any> | SchemaClass<any, any, any>> =
    M extends Model<any, infer T, any, any, any, any, any> ? T :
    M extends SchemaClass<any, infer T, any> ? T : never
export type ModelPopulatedType<M extends Model<any, any, any, any, any, any, any> | SchemaClass<any, any, any>> =
    M extends Model<any, any, infer T, any, any, any, any> ? T :
    M extends SchemaClass<any, any, infer T> ? T : never

type UrlCallbackParam = () => string

type RouteOpts = {
    trailingSlash?: boolean,
    headers?: {
        [key: string]: string;
    }
}

export class Model<ItemType extends SchemaNamespace.Item,
    RealType extends SchemaNamespace.RealType<ItemType>,
    PopulatedType extends SchemaNamespace.Type<ItemType>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Name extends string,
    GetItemType extends SchemaNamespace.Item = never,
    GetItem extends SchemaNamespace.RealType<GetItemType> = never,
    MetaData = null> {
    private model: OriginalModel<ItemType, RealType, PopulatedType, IdKey, Name, GetItemType, GetItem, MetaData>

    constructor(schema: SchemaClass<ItemType, RealType, PopulatedType>, name: Name, id: IdKey, url: string | UrlCallbackParam)
    constructor(schema: SchemaClass<ItemType, RealType, PopulatedType>, name: Name, id: IdKey, url: string | UrlCallbackParam, itemStructure: SchemaClass<GetItemType, GetItem, any>, getItems: (el: GetItem) => RealType[])
    constructor(schema: SchemaClass<ItemType, RealType, PopulatedType>, name: Name, id: IdKey, url: string | UrlCallbackParam, itemStructure: SchemaClass<GetItemType, GetItem, any>, getItems: (el: GetItem) => RealType[], getMetaData: (el: GetItem) => MetaData, )
    constructor(schema: SchemaClass<ItemType, RealType, PopulatedType>, name: Name, id: IdKey, url: string | UrlCallbackParam, itemStructure: SchemaClass<GetItemType, GetItem, any>, getItems: (el: GetItem) => RealType[], getMetaData: (el: GetItem) => MetaData, opts: RouteOpts)
    constructor(schema: SchemaClass<ItemType, RealType, PopulatedType>, name: Name, id: IdKey, url: string | UrlCallbackParam, itemStructure?: SchemaClass<GetItemType, GetItem, any>, getItems?: (el: GetItem) => RealType[], getMetaData?: (el: GetItem) => MetaData, opts: RouteOpts = {}) {
        this.model = new OriginalModel(schema, name, id, url, itemStructure!, getItems!, getMetaData!, opts)
    }
    public useGet(queryString?: string) {
        return useGet(this.model, queryString)
    }
    public useGetPopulated(queryString?: string) {
        return useGetPopulated(this.model, queryString)
    }

    public useGetById(id: RealType[IdKey]) {
        return useGetById(this.model, id)
    }

    public useGetByIdPopulated(id: PopulatedType[IdKey]) {
        return useGetByIdPopulated(this.model, id)
    }

    public connectGet(): InferableComponentEnhancerWithProps<Get.PromsFromItem<RealType>, { queryString?: string }>
    public connectGet<Name extends string>(
        name: Name
    ): InferableComponentEnhancerWithProps<Get.PromsFromItem<RealType, Name>, { queryString?: string }>
    public connectGet<Name extends string = 'items'>(
        name?: Name
    ) {
        return connectGet<ItemType, RealType, MetaData, Name>(this.model, name!)
    }
    public connectGetPopulated(): InferableComponentEnhancerWithProps<GetPopulated.PromsFromItem<PopulatedType>, { queryString?: string }>
    public connectGetPopulated<Name extends string>(
        name: Name
    ): InferableComponentEnhancerWithProps<GetPopulated.PromsFromItem<PopulatedType, Name>, { queryString?: string }>
    public connectGetPopulated<Name extends string = 'items'>(
        name?: Name
    ) {
        return connectGetPopulated<ItemType, PopulatedType, MetaData, Name>(this.model, name!)
    }

    public connectGetById(): InferableComponentEnhancerWithProps<GetById.PromsFromItem<RealType>, { id: RealType[IdKey] }>
    public connectGetById<Name extends string>(
        propertyName: Name
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<RealType, Name>, { id: RealType[IdKey] }>;
    public connectGetById<Name extends string, idPropName extends string>(
        propertyName: Name,
        idPropName: idPropName
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<RealType, Name>, Record<idPropName, RealType[IdKey]>>;
    public connectGetById(
        name?: string,
        idPropName?: string
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<any, any>, any> {
        return connectGetById(this.model, name!, idPropName!)
    }

    public connectGetByIdPopulated(): InferableComponentEnhancerWithProps<GetByIdPopulated.PromsFromItem<PopulatedType>, { id: RealType[IdKey] }>
    public connectGetByIdPopulated<Name extends string>(
        propertyName: Name
    ): InferableComponentEnhancerWithProps<GetByIdPopulated.PromsFromItem<PopulatedType, Name>, { id: RealType[IdKey] }>;
    public connectGetByIdPopulated<Name extends string, idPropName extends string>(
        propertyName: Name,
        idPropName: idPropName
    ): InferableComponentEnhancerWithProps<GetByIdPopulated.PromsFromItem<PopulatedType, Name>, Record<idPropName, RealType[IdKey]>>;
    public connectGetByIdPopulated(
        name?: string,
        idPropName?: string
    ): InferableComponentEnhancerWithProps<GetByIdPopulated.PromsFromItem<any, any>, any> {
        return connectGetByIdPopulated(this.model, name!, idPropName!)
    }
}

export function getProvider() {
    const store = configureStore()
    const Provider: React.FunctionComponent<{}> = (props) => {
        return <DefaultProvider {...props} store={store} context={Context} />
    }
    return Provider
}