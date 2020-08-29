import { RestModel } from '../models/restmodels'
import { Schema, StringOrNumberKeys } from '../models/Schema'
import { getResult, getError, isFetching, isInvalidated, isInitialized } from './utils'
import { ReducerType, RestApiReducerType } from '../models/ReducerStorage'

export default class BasicIdReducer<S extends Schema<any>,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string,>{
    private restModel: RestModel<{}, S, IdKey, any, any>
    constructor(model: RestModel<{}, S, IdKey, any, any>) {
        this.restModel = model
    }
    private getReducer(state: ReducerType): RestApiReducerType<S['RealType'], any, IdKey> {
        const res = Object.assign(<RestApiReducerType<S['RealType'], any, IdKey>>{ searchs: {}, derived: {}, ids: {} }, state[this.restModel.model.name])
        return Object.assign({}, res, {
            ids: Object.assign({}, res.ids, {
                [this.restModel._id]: Object.assign({}, res.ids[this.restModel._id])
            })
        })
    }
    getById(state: ReducerType, id: S['RealType'][IdKey]): S['RealType'] | null {
        if (typeof id !== 'string' && typeof id !== 'number') throw (new Error(`id ${id} must be a string or number. Type is ${typeof id}`))
        return getResult(this.getReducer(state).ids[this.restModel._id][id])
    }
    getByIdPopulated(state: ReducerType, id: S['RealType'][IdKey]): S['PopulatedType'] | null {
        if (typeof id !== 'string' && typeof id !== 'number') throw (new Error(`id ${id} must be a string or number. Type is ${typeof id}`))
        const res = this.getById(state, id)
        return res !== null ? this.restModel.model.schema._convertToPopulated(state, res) : null
    }
    getIdError(state: ReducerType, id: S['RealType'][IdKey]) {
        if (typeof id !== 'string' && typeof id !== 'number') throw (new Error(`id ${id} must be a string or number. Type is ${typeof id}`))
        return getError(this.getReducer(state).ids[this.restModel._id][id])
    }
    isIdInitialized(state: ReducerType, id: S['RealType'][IdKey]) {
        if (typeof id !== 'string' && typeof id !== 'number') throw (new Error(`id ${id} must be a string or number. Type is ${typeof id}`))
        return isInitialized(this.getReducer(state).ids[this.restModel._id][id])
    }
    isIdPopulated(state: ReducerType, id: S['RealType'][IdKey]) {
        if (typeof id !== 'string' && typeof id !== 'number') throw (new Error(`id ${id} must be a string or number. Type is ${typeof id}`))
        const res = this.getById(state, id)
        return res !== null ? this.restModel.model.schema._isPopulated(state, res) : false
    }
    isIdFetching(state: ReducerType, id: S['RealType'][IdKey]) {
        if (typeof id !== 'string' && typeof id !== 'number') throw (new Error(`id ${id} must be a string or number. Type is ${typeof id}`))
        return isFetching(this.getReducer(state).ids[this.restModel._id][id])
    }
    isIdInvalidated(state: ReducerType, id: S['RealType'][IdKey]) {
        if (typeof id !== 'string' && typeof id !== 'number') throw (new Error(`id ${id} must be a string or number. Type is ${typeof id}`))
        return isInvalidated(this.getReducer(state).ids[this.restModel._id][id])
    }
}