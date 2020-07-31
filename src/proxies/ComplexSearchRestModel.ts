import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { ComplexSearchRestModel as OriginalComplexSearchRestModel } from '@rest-api/redux/src/restmodels/ComplexSearchRestModel'
import { useGetExtended } from '../hooks/get'
import { useGetPopulatedExtended } from '../hooks/getPopulated'
import { Schema } from '../DataTypes'

export default class ComplexSearchRestModel<
    Opts,
    S extends Schema<any>,
    IdType extends SchemaNamespace.StringOrNumberKeys<S["RealType"]> & SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string,
    GetItem = never, MetaData = null
    > extends OriginalComplexSearchRestModel<Opts, S, IdType, GetItem, MetaData> {

    public useGet(opts: Opts, queryString?: string | URLSearchParams) {
        return useGetExtended(this, opts, queryString)
    }

    public useGetPopulated(opts: Opts, queryString?: string | URLSearchParams) {
        return useGetPopulatedExtended(this, opts, queryString)
    }
}