import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { ComplexIdRestModel as OriginalComplexIdRestModel } from '@rest-api/redux/src/restmodels/ComplexIdRestModel'
import { useGetByIdExtended } from '../hooks/getById'
import { useGetByIdPopulatedExtended } from '../hooks/getByIdPopulated'

export default class ComplexIdRestModel<Opts, RealType, PopulatedType, FullPopulatedType, IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string> extends OriginalComplexIdRestModel<Opts, RealType, PopulatedType, FullPopulatedType, IdKey> {


    public useGetById(opts: Opts, id: RealType[IdKey]) {
        return useGetByIdExtended(this, opts, id)
    }

    public useGetByIdPopulated(opts: Opts, id: PopulatedType[IdKey]) {
        return useGetByIdPopulatedExtended(this, opts, id)
    }
}