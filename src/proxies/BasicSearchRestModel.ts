import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { BasicSearchRestModel as OriginalBasicSearchRestModel } from '@rest-api/redux/src/restmodels/basic/BasicSearchRestModel'
import useGet from '../hooks/get'
import useGetPopulated from '../hooks/getPopulated'

export default class BasicSearchRestModel<
    RealType,
    PopulatedType,
    FullPopulatedType,
    IdType extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    GetItem = never, MetaData = null
    > extends OriginalBasicSearchRestModel<RealType, PopulatedType, FullPopulatedType, IdType, GetItem, MetaData> {

    public useGet(queryString?: string | URLSearchParams) {
        return useGet(this, queryString)
    }

    public useGetPopulated(queryString?: string | URLSearchParams) {
        return useGetPopulated(this, queryString)
    }
}