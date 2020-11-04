import {  Schema, StringOrNumberKeys } from '../models/Schema'
import { getResult, getError, isFetching, isInvalidated, isInitialized } from './utils'
import { RestModel, UrlCallbackParam } from '../models/restmodels';
import ComplexIdReducer from './ComplexIdReducer';
import BasicIdReducer from './BasicIdReducer';
import { ReducerType, RestApiReducerType } from '../models/ReducerStorage';
export default class ComplexSearchReducer<Opts,
    S extends Schema<any>,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string,
    MetaData>{
    private url: UrlCallbackParam<Opts>
    private restModel: RestModel<Opts, S, IdKey, any, MetaData>
    constructor(restModel: RestModel<Opts, S, IdKey, any, MetaData>, reducer: BasicIdReducer<S, IdKey> | ComplexIdReducer<Opts, S, IdKey>, url: UrlCallbackParam<Opts>) {
        this.restModel = restModel
        this.getById = reducer.getById
        this.url = url
    }

    public getById: (state: ReducerType, i: S['RealType'][IdKey]) => S['RealType'] | null
    private getReducer(state: ReducerType): RestApiReducerType<S['RealType'], MetaData, IdKey> {
        const res = Object.assign(<RestApiReducerType<S['RealType'], any, IdKey>>{ searchs: {}, derived: {}, ids: {} }, state[this.restModel.model.name])
        return Object.assign({}, res, {
            ids: Object.assign({}, res.ids, {
                [this.restModel._id]: Object.assign({}, res.ids[this.restModel._id])
            })
        })
    }
    private getUrl(opts: Opts, queryString: string) {
        const gettedUrl = this.url(opts)
        const url = this.restModel.trailingSlash && !gettedUrl.endsWith('/') ? `${gettedUrl}/` : gettedUrl
        return queryString ? `${url}?${queryString}` : url
    }

    get(opts: Opts, state: ReducerType, queryString: string = '') {
        const result = getResult(this.getReducer(state).searchs[this.getUrl(opts, queryString)])
        return result ? result.ids.map(id => this.getById(state, id)!).filter(f => f !== null) : []
    }
    getPopulated(opts: Opts, state: ReducerType, queryString: string = '') {
        const items = this.get(opts, state, queryString)
        return items.map(item => this.restModel.model.schema._convertToPopulated(state, item))
    }
    isInitialized(opts: Opts, state: ReducerType, queryString: string = '') {
        return isInitialized(this.getReducer(state).searchs[this.getUrl(opts, queryString)])
    }
    isPopulated(opts: Opts, state: ReducerType, queryString: string = '') {
        const items = this.get(opts, state, queryString)
        return items.map(item => this.restModel.model.schema._isPopulated(state, item)).every(e => e === true)
    }
    getError(opts: Opts, state: ReducerType, queryString: string = '') {
        return getError(this.getReducer(state).searchs[this.getUrl(opts, queryString)])
    }
    isFetching(opts: Opts, state: ReducerType, queryString: string = '') {
        return isFetching(this.getReducer(state).searchs[this.getUrl(opts, queryString)])
    }
    isInvalidated(opts: Opts, state: ReducerType, queryString: string = '') {
        return isInvalidated(this.getReducer(state).searchs[this.getUrl(opts, queryString)])
    }
    getMetadata(opts: Opts, state: ReducerType, queryString: string = '') {
        const result = getResult(this.getReducer(state).searchs[this.getUrl(opts, queryString)])
        return result && result.metadata ? result.metadata : null
    }
}