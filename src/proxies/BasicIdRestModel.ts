import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { BasicIdRestModel as OriginalBasicIdRestModel } from '@rest-api/redux/src/restmodels/basic/BasicIdRestModel'
import useGetById from '../hooks/getById'
import useGetByIdPopulated from '../hooks/getByIdPopulated'
import { Schema } from '../DataTypes'

export default class BasicIdRestModel<S extends Schema<any>, IdKey extends SchemaNamespace.StringOrNumberKeys<S["RealType"]> & SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string> extends OriginalBasicIdRestModel<S, IdKey> {


    public useGetById(id: S["RealType"][IdKey]) {
        return useGetById(this, id)
    }

    public useGetByIdPopulated(id: S["PopulatedType"][IdKey]) {
        return useGetByIdPopulated(this, id)
    }
}