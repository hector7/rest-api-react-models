import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { ComplexIdRestModel as OriginalComplexIdRestModel } from '@rest-api/redux/src/restmodels/ComplexIdRestModel'
import { useGetByIdExtended } from '../hooks/getById'
import { useGetByIdPopulatedExtended } from '../hooks/getByIdPopulated'
import { Schema } from '../DataTypes'

export default class ComplexIdRestModel<Opts, S extends Schema<any>, IdKey extends SchemaNamespace.StringOrNumberKeys<S["RealType"]> & SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string> extends OriginalComplexIdRestModel<Opts, S, IdKey> {


    public useGetById(opts: Opts, id: S["RealType"][IdKey]) {
        return useGetByIdExtended(this, opts, id)
    }

    public useGetByIdPopulated(opts: Opts, id: S["PopulatedType"][IdKey]) {
        return useGetByIdPopulatedExtended(this, opts, id)
    }
}