import { Schema, StringOrNumberKeys } from '../models/Schema'
import { getResult, getError, isFetching, isInvalidated, isInitialized } from './utils'
import BasicIdRestModel from '../models/restmodels/basic/BasicIdRestModel';
import { UrlCallbackParam } from '../models/restmodels';
import { ReducerType, RestApiReducerType } from '../models/ReducerStorage';

export default class BasicSearchReducer<
    S extends Schema<any>,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string,
    MetaData>{
    public readonly restModel: BasicIdRestModel<S, IdKey>
    private url: UrlCallbackParam<{}>
    constructor(restModel: BasicIdRestModel<S, IdKey>, url: UrlCallbackParam<{}>) {
        this.restModel = restModel
        this.url = url
    }
    public getReducer(state: ReducerType): RestApiReducerType<S['RealType'], MetaData, IdKey> {
        const res = Object.assign(<RestApiReducerType<S['RealType'], any, IdKey>>{ searchs: {}, derived: {}, ids: {} }, state[this.restModel.model.name])
        return Object.assign({}, res, {
            ids: Object.assign({}, res.ids, {
                [this.restModel._id]: Object.assign({}, res.ids[this.restModel._id])
            })
        })
    }
    private getUrl(queryString: string) {
        const gettedUrl = this.url({})
        const realUrl = this.restModel.trailingSlash && !gettedUrl.endsWith('/') ? `${gettedUrl}/` : gettedUrl
        return queryString ? `${realUrl}?${queryString}` : realUrl
    }
    get(state: ReducerType, queryString: string = '') {
        const result = getResult(this.getReducer(state).searchs[this.getUrl(queryString)])
        return result ? result.ids.map(id => this.restModel._reducer.getById(state, id)!) : []
    }
    get getById() {
        return this.restModel._reducer.getById
    }
    getPopulated(state: ReducerType, queryString: string = '') {
        const result = getResult(this.getReducer(state).searchs[this.getUrl(queryString)])
        return result ? Object.assign([], result.ids).map(id => this.restModel._reducer.getByIdPopulated(state, id)!) : []
    }
    isPopulated(state: ReducerType, queryString: string = '') {
        const items = this.get(state, queryString)
        return items.map(item => this.restModel.model.schema._isPopulated(state, item)).every(e => e === true)
    }
    isInitialized(state: ReducerType, queryString: string = '') {
        return isInitialized(this.getReducer(state).searchs[this.getUrl(queryString)])
    }
    getError(state: ReducerType, queryString: string = '') {
        return getError(this.getReducer(state).searchs[this.getUrl(queryString)])
    }
    isFetching(state: ReducerType, queryString: string = '') {
        return isFetching(this.getReducer(state).searchs[this.getUrl(queryString)])
    }
    isInvalidated(state: ReducerType, queryString: string = '') {
        return isInvalidated(this.getReducer(state).searchs[this.getUrl(queryString)])
    }
    getMetadata(state: ReducerType, queryString: string = '') {
        const result = getResult(this.getReducer(state).searchs[this.getUrl(queryString)])
        return result && result.metadata ? result.metadata : null
    }
}