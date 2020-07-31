import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import BasicIdRestModel from './BasicIdRestModel'
import Schema from './Schema'
import ComplexIdRestModel from './ComplexIdRestModel'
import BasicSearchRestModel from './BasicSearchRestModel'
import ComplexSearchRestModel from './ComplexSearchRestModel'
import useGet from '../hooks/get'
import useGetPopulated from '../hooks/getPopulated'
import useModificators from '../hooks/modificators'
import useGetById from '../hooks/getById'
import useGetByIdPopulated from '../hooks/getByIdPopulated'
import { BasicRestModel } from '@rest-api/redux/src/restmodels/basic/BasicRestModel'

export default class Model<S extends Schema<any>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<S["RealType"]> & SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string,
    GetItem,
    MetaData> 
    extends BasicRestModel<S, IdKey, GetItem, MetaData> {

    public useGet(queryString?: string | URLSearchParams) {
        return useGet(this, queryString)
    }

    public useGetPopulated(queryString?: string | URLSearchParams) {
        return useGetPopulated(this, queryString)
    }

    public useModificators() {
        return useModificators(this)
    }

    public usePost(){
        return useModificators(this).post
    }

    public usePatch(){
        return useModificators(this).patch
    }

    public usePut(){
        return useModificators(this).put
    }

    public useDelete(){
        return useModificators(this).remove
    }

    public useGetById(id: S["RealType"][IdKey]) {
        return useGetById(this, id)
    }

    public useGetByIdPopulated(id: S["PopulatedType"][IdKey]) {
        return useGetByIdPopulated(this, id)
    }

    getSubModelWithKey<
        k extends SchemaNamespace.StringOrNumberKeys<S["RealType"]> & SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string
    >(key: k, url?: string): BasicIdRestModel<S, k>
    getSubModelWithKey<
        R,
        k extends SchemaNamespace.StringOrNumberKeys<S["RealType"]> & SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string
    >(optSchema: Schema<R>, key: k, url: (opts: R) => string): ComplexIdRestModel<R, S, k>
    getSubModelWithKey<
        R,
        k extends SchemaNamespace.StringOrNumberKeys<S["RealType"]> & SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string
    >(keyOrSchema: Schema<R> | k, keyOrUrl?: string | k, url?: (opts: any) => string) {
        if (typeof (keyOrSchema) === 'string')
            return new BasicIdRestModel(this, keyOrSchema, keyOrUrl ? () => keyOrUrl : this.getUrl)
        return new ComplexIdRestModel(this, keyOrUrl as k, keyOrSchema, url!)
    }
    getSearchSubModel(url: string): BasicSearchRestModel<S, IdKey, GetItem, MetaData>
    getSearchSubModel<R>(optSchema: Schema<R>, url: (opt: R) => string): ComplexSearchRestModel<R, S, IdKey, GetItem, MetaData>
    getSearchSubModel<R>(optSchemaOrUrl: Schema<R> | string, url?: (opt: R) => string) {
        if (typeof (optSchemaOrUrl) === 'string') {
            return new BasicSearchRestModel<S, IdKey, GetItem, MetaData>(this.basicIdRestModel, () => optSchemaOrUrl)
        }
        return new ComplexSearchRestModel<R, S, IdKey, GetItem, MetaData>(this.basicIdRestModel, optSchemaOrUrl, url!)
    }
}
