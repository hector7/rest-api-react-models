import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import OriginalBasicIdRestModel from '@rest-api/redux/src/restmodels/basic/BasicIdRestModel'
import useGetById from '../hooks/getById'
import useGetByIdPopulated from '../hooks/getByIdPopulated'

export default class BasicIdRestModel<RealType, PopulatedType, FullPopulatedType, IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string> extends OriginalBasicIdRestModel<RealType, PopulatedType, FullPopulatedType, IdKey> {


    public useGetById(id: RealType[IdKey]) {
        return useGetById(this, id)
    }

    public useGetByIdPopulated(id: PopulatedType[IdKey]) {
        return useGetByIdPopulated(this, id)
    }
}