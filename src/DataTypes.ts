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

export default class Model<RealType,
    PopulatedType,
    FullPopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    GetItem,
    MetaData> extends OriginalModel<RealType, PopulatedType, FullPopulatedType, IdKey, GetItem, MetaData> {

    public useGet(queryString?: string | URLSearchParams) {
        return useGet(this, queryString)
    }

    public useGetPopulated(queryString?: string | URLSearchParams) {
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

    public connectGet(): InferableComponentEnhancerWithProps<Get.PromsFromItem<RealType>, { queryString?: string | URLSearchParams }>
    public connectGet<Name extends string>(
        name: Name
    ): InferableComponentEnhancerWithProps<Get.PromsFromItem<RealType, Name>, { queryString?: string | URLSearchParams }>
    public connectGet<Name extends string = 'items'>(
        name?: Name
    ) {
        return connectGet<RealType, IdKey, MetaData, Name>(this, name!)
    }
    public connectGetPopulated(): InferableComponentEnhancerWithProps<GetPopulated.PromsFromItem<PopulatedType, FullPopulatedType>, { queryString?: string | URLSearchParams }>
    public connectGetPopulated<Name extends string>(
        name: Name
    ): InferableComponentEnhancerWithProps<GetPopulated.PromsFromItem<PopulatedType, FullPopulatedType, Name>, { queryString?: string | URLSearchParams }>
    public connectGetPopulated<Name extends string = 'items'>(
        name?: Name
    ) {
        return connectGetPopulated<PopulatedType, FullPopulatedType, IdKey, MetaData, Name>(this, name!)
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

    public connectGetByIdPopulated(): InferableComponentEnhancerWithProps<GetByIdPopulated.PromsFromItem<PopulatedType, FullPopulatedType>, { id: RealType[IdKey] }>
    public connectGetByIdPopulated<Name extends string>(
        propertyName: Name
    ): InferableComponentEnhancerWithProps<GetByIdPopulated.PromsFromItem<PopulatedType, FullPopulatedType, Name>, { id: RealType[IdKey] }>;
    public connectGetByIdPopulated<Name extends string, idPropName extends string>(
        propertyName: Name,
        idPropName: idPropName
    ): InferableComponentEnhancerWithProps<GetByIdPopulated.PromsFromItem<PopulatedType, FullPopulatedType, Name>, Record<idPropName, RealType[IdKey]>>;
    public connectGetByIdPopulated(
        name?: string,
        idPropName?: string
    ): InferableComponentEnhancerWithProps<GetByIdPopulated.PromsFromItem<any, FullPopulatedType, any>, any> {
        return connectGetByIdPopulated(this, name!, idPropName!)
    }
}

export class Schema<RealType,
    PopulatedType, FullPopulatedType> extends SchemaClass<RealType, PopulatedType, FullPopulatedType>{
    protected _fieldIsAnIdModel(property: any): property is OriginalModel<any, any, any, any, any, any> {
        if (super._fieldIsAnIdModel(property)) return true
        return property.constructor === Model
    }
    protected fieldIsSchema(property: any): property is SchemaClass<any, any, any> {
        if (super.fieldIsSchema(property)) return true
        return property.constructor === Schema
    }
    /*
    _getModelValues(item: RealType, callback: (model: OriginalModel<any, any, any, any, any, any>, id: any) => void) {
        super._getModelValues(item, callback)
    }*/
}