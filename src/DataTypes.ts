import { Schema as SchemaClass, Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model as OriginalModel } from '@rest-api/redux'
import { Get, useGet, default as connectGet } from './get'
import { Get as GetPopulated, useGetPopulated, default as connectGetPopulated } from './getPopulated'
import { GetById, useGetById, default as connectGetById } from './getById'
import { GetById as GetByIdPopulated, useGetByIdPopulated, default as connectGetByIdPopulated } from './getByIdPopulated'
import { InferableComponentEnhancerWithProps } from 'react-redux'
import connectModificators, { useModificators } from './modificators'

type RouteOpts = {
    trailingSlash?: boolean;
    headers?: {
        [key: string]: string;
    };
};

export default class Model<ItemType extends SchemaNamespace.Item,
    RealType extends SchemaNamespace.RealType<ItemType>,
    PopulatedType extends SchemaNamespace.Type<ItemType>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Name extends string,
    GetItemType extends SchemaNamespace.Item = never,
    GetItem extends SchemaNamespace.RealType<GetItemType> = never,
    MetaData = null> extends OriginalModel<ItemType, RealType, PopulatedType, IdKey, Name, GetItemType, GetItem, MetaData> {

    constructor(schema: Schema<ItemType, RealType, PopulatedType>, name: Name, id: IdKey, url: string | (() => string), routeOpts?: RouteOpts)
    constructor(schema: Schema<ItemType, RealType, PopulatedType>, name: Name, id: IdKey, url: string | (() => string), itemStructure: Schema<GetItemType, GetItem, any>, getItems: (el: GetItem) => RealType[], routeOpts?: RouteOpts)
    constructor(schema: Schema<ItemType, RealType, PopulatedType>, name: Name, id: IdKey, url: string | (() => string), itemStructure: Schema<GetItemType, GetItem, any>, getItems: (el: GetItem) => RealType[], getMetaData: (el: GetItem) => MetaData, )
    constructor(schema: Schema<ItemType, RealType, PopulatedType>, name: Name, id: IdKey, url: string | (() => string), itemStructure: Schema<GetItemType, GetItem, any>, getItems: (el: GetItem) => RealType[], getMetaData: (el: GetItem) => MetaData, opts: RouteOpts)
    constructor(schema: Schema<ItemType, RealType, PopulatedType>, name: Name, id: IdKey, url: string | (() => string), itemStructureOrRouteOpts?: Schema<GetItemType, GetItem, any> | RouteOpts, getItems?: (el: GetItem) => RealType[], getMetaDataOrRouteOpts?: ((el: GetItem) => MetaData) | RouteOpts, opts?: RouteOpts) {
        super(schema, name, id, url, <any>itemStructureOrRouteOpts, getItems!, <any>getMetaDataOrRouteOpts!, opts!)
    }

    public useGet(queryString?: string) {
        return useGet(this, queryString)
    }

    public useGetPopulated(queryString?: string) {
        return useGetPopulated(this, queryString)
    }

    public useModificators() {
        return useModificators(this)
    }

    public useGetById(id: RealType[IdKey]) {
        return useGetById(this, id)
    }

    public useGetByIdPopulated(id: PopulatedType[IdKey]) {
        return useGetByIdPopulated(this, id)
    }

    public connectModificators() {
        return connectModificators(this)
    }

    public connectGet(): InferableComponentEnhancerWithProps<Get.PromsFromItem<RealType>, { queryString?: string }>
    public connectGet<Name extends string>(
        name: Name
    ): InferableComponentEnhancerWithProps<Get.PromsFromItem<RealType, Name>, { queryString?: string }>
    public connectGet<Name extends string = 'items'>(
        name?: Name
    ) {
        return connectGet<ItemType, RealType, IdKey, MetaData, Name>(this, name!)
    }
    public connectGetPopulated(): InferableComponentEnhancerWithProps<GetPopulated.PromsFromItem<PopulatedType>, { queryString?: string }>
    public connectGetPopulated<Name extends string>(
        name: Name
    ): InferableComponentEnhancerWithProps<GetPopulated.PromsFromItem<PopulatedType, Name>, { queryString?: string }>
    public connectGetPopulated<Name extends string = 'items'>(
        name?: Name
    ) {
        return connectGetPopulated<ItemType, PopulatedType, IdKey, MetaData, Name>(this, name!)
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
        return connectGetById(this, name!, idPropName!)
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
        return connectGetByIdPopulated(this, name!, idPropName!)
    }
}

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