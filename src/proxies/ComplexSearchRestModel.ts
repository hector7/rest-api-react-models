import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { ComplexSearchRestModel as OriginalComplexSearchRestModel } from '@rest-api/redux/src/restmodels/ComplexSearchRestModel'
import { useGetExtended } from '../hooks/get'
import { useGetPopulatedExtended } from '../hooks/getPopulated'

export default class ComplexSearchRestModel<
    Opts,
    RealType,
    PopulatedType,
    FullPopulatedType,
    IdType extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    GetItem = never, MetaData = null
    > extends OriginalComplexSearchRestModel<Opts, RealType, PopulatedType, FullPopulatedType, IdType, GetItem, MetaData> {

    public useGet(opts: Opts, queryString?: string | URLSearchParams) {
        return useGetExtended(this, opts, queryString)
    }

    public useGetPopulated(opts: Opts, queryString?: string | URLSearchParams) {
        return useGetPopulatedExtended(this, opts, queryString)
    }
}