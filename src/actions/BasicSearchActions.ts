import { Schema, StringOrNumberKeys } from '../models/Schema'
import { RestModel, UrlCallbackParam } from '../models/restmodels'
import { Callback, HttpError } from '../..'
import ComplexSearchActions from './ComplexSearchActions'

export default class BasicSearchActions<S extends Schema<any>,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string,
    GetItem = S['RealType'][],
    MetaData = null> {
    private complexActions: ComplexSearchActions<{}, S, IdKey, GetItem, MetaData>
    constructor(model: RestModel<{}, S, IdKey, GetItem, MetaData>, url: UrlCallbackParam<{}>) {
        this.complexActions = new ComplexSearchActions<{}, S, IdKey, GetItem, MetaData>(model, url)
    }
    fetchIfNeeded(queryString: string = '', callback?: Callback<{ items: S['RealType'][], metadata: MetaData | null | any }, HttpError>) {
        return this.complexActions.fetchIfNeeded({}, queryString, callback)
    }
    fetchPopulatedIfNeeded(queryString: string = '') {
        return this.complexActions.fetchPopulatedIfNeeded({}, queryString)
    }
    invalidate(queryString: string = '') {
        return this.complexActions.invalidate({}, queryString)
    }
}