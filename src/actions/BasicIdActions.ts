import { Schema, StringOrNumberKeys } from '../models/Schema'
import { RestModel } from '../models/restmodels'
import ComplexIdActions from './ComplexIdActions'
import { Callback, HttpError } from '../..'

export default class BasicIdActions<S extends Schema<any>,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string,> {
    private complexActions: ComplexIdActions<{}, S, IdKey>
    constructor(model: RestModel<{}, S, IdKey, any, any>) {
        this.complexActions = new ComplexIdActions<{}, S, IdKey>(model)
    }
    invalidateById(id: S['RealType'][IdKey]) {
        return this.complexActions.invalidateById({}, id)
    }
    invalidateAll() {
        return this.complexActions.invalidateAll()
    }
    fetchByIdIfNeeded(id: S['RealType'][IdKey], callback?: Callback<S['RealType'] | null, HttpError>) {
        return this.complexActions.fetchByIdIfNeeded({}, id, callback)
    }
    fetchByIdPopulatedIfNeeded(id: S['RealType'][IdKey]) {
        return this.complexActions.fetchByIdPopulatedIfNeeded({}, id)
    }
    post(item: Omit<S['RealType'], IdKey> | FormData, callback: Callback<S['RealType'], HttpError>) {
        return this.complexActions.post({}, item, callback)
    }
    put(id: S['RealType'][IdKey], item: S['RealType'] | FormData, callback: Callback<S['RealType'], HttpError>) {
        return this.complexActions.put({}, id, item, callback)
    }
    patch(id: S['RealType'][IdKey], item: Partial<S['RealType']> | FormData, callback: Callback<S['RealType'], HttpError>) {
        return this.complexActions.patch({}, id, item, callback)
    }
    delete(item: S['RealType'], callback: Callback<undefined, HttpError>) {
        return this.complexActions.delete({}, item, callback)
    }
}