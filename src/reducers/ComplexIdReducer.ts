
import {  Schema, StringOrNumberKeys } from '../models/Schema'
import { getResult, getError, isFetching, isInvalidated, isInitialized } from './utils'
import { RestModel } from '../models/restmodels';
import { ReducerType, RestApiReducerType } from '../models/ReducerStorage';

export default class ComplexIdReducer<
    Opts,
    S extends Schema<any>,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string>{
    private restModel: RestModel<Opts, S, IdKey>
    constructor(restModel: RestModel<Opts, S, IdKey>) {
        this.restModel = restModel
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
    isIdPopulated(state: ReducerType, id: S['RealType'][IdKey]): boolean {
        if (typeof id !== 'string' && typeof id !== 'number') throw (new Error(`id ${id} must be a string or number. Type is ${typeof id}`))
        const res = this.getById(state, id)
        return res !== null ? this.restModel.model.schema._isPopulated(state, res) : false
    }
    isIdInitialized(state: ReducerType, id: S['RealType'][IdKey]): boolean {
        return isInitialized(this.getReducer(state).ids[this.restModel._id][id])
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