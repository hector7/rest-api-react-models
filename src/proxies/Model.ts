import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model as OriginalModel } from '@rest-api/redux'
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

    getSubModelWithKey<
        k extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string
    >(key: k, url?: string): BasicIdRestModel<RealType, PopulatedType, FullPopulatedType, k>
    getSubModelWithKey<
        R,
        k extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string
    >(optSchema: Schema<R>, key: k, url: (opts: R) => string): ComplexIdRestModel<R, RealType, PopulatedType, FullPopulatedType, k>
    getSubModelWithKey<
        R,
        k extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string
    >(keyOrSchema: Schema<R> | k, keyOrUrl?: string | k, url?: (opts: any) => string) {
        if (typeof (keyOrSchema) === 'string')
            return new BasicIdRestModel(this, keyOrSchema, keyOrUrl ? () => keyOrUrl : this.getUrl)
        return new ComplexIdRestModel(this, keyOrUrl as k, keyOrSchema, url!)
    }
    getSearchSubModel(url: string): BasicSearchRestModel<RealType, PopulatedType, FullPopulatedType, IdKey, GetItem, MetaData>
    getSearchSubModel<R>(optSchema: Schema<R>, url: (opt: R) => string): ComplexSearchRestModel<R, RealType, PopulatedType, FullPopulatedType, IdKey, GetItem, MetaData>
    getSearchSubModel<R>(optSchemaOrUrl: Schema<R> | string, url?: (opt: R) => string) {
        if (typeof (optSchemaOrUrl) === 'string') {
            return new BasicSearchRestModel<RealType, PopulatedType, FullPopulatedType, IdKey, GetItem, MetaData>(this.basicIdRestModel, () => optSchemaOrUrl)
        }
        return new ComplexSearchRestModel<R, RealType, PopulatedType, FullPopulatedType, IdKey, GetItem, MetaData>(this.basicIdRestModel, optSchemaOrUrl, url!)
    }
}
