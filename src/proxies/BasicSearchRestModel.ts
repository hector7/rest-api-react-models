import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { BasicSearchRestModel as OriginalBasicSearchRestModel } from '@rest-api/redux/src/restmodels/basic/BasicSearchRestModel'
import useGet from '../hooks/get'
import useGetPopulated from '../hooks/getPopulated'
import { Schema } from '../DataTypes'

export default class BasicSearchRestModel<
    S extends Schema<any>,
    IdType extends SchemaNamespace.StringOrNumberKeys<S["RealType"]> & SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string,
    GetItem = never, MetaData = null
    > extends OriginalBasicSearchRestModel<S, IdType, GetItem, MetaData> {

    public useGet(queryString?: string | URLSearchParams) {
        return useGet(this, queryString)
    }

    public useGetPopulated(queryString?: string | URLSearchParams) {
        return useGetPopulated(this, queryString)
    }
}