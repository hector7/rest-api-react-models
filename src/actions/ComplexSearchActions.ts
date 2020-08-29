import { RestModel, UrlCallbackParam } from "../models/restmodels"
import { Schema, StringOrNumberKeys } from '../models/Schema'
import { HttpError, Callback, ActionUnion } from "../.."
import { Dispatch } from "redux"
import { IGNORED_STATUS, restActions, shouldFetch } from "./index"
import { isFetching, getGeneralRequest, getItems, getMetadata, getError } from "../reducers/utils";
import { RestApiReducerType, ReducerType } from "../models/ReducerStorage"

export default class ComplexSearchActions<Opts,
    S extends Schema<any>,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string,
    GetItem = S['RealType'][],
    MetaData = null> {
    private url: UrlCallbackParam<Opts>
    private actions = {
        request: (opts: Opts, queryString: string,) => restActions.request(this.restModel.model.name, this.getUri(opts, { queryString })),
        failed: (opts: Opts, queryString: string, error: HttpError) => restActions.failed(this.restModel.model.name, this.getUri(opts, { queryString }), error),
        invalidate: (opts: Opts, queryString: string,) => restActions.invalidate(this.restModel.model.name, this.getUri(opts, { queryString })),
        receive: (opts: Opts, queryString: string, data: GetItem) => restActions.receive(this.restModel._id, this.restModel.model.name, this.getUri(opts, { queryString }), this.restModel.getItems(data), this.restModel.getMetaData(data))
    }

    private restModel: RestModel<Opts, S, IdKey, GetItem, MetaData>
    private queue: { [url: string]: Callback<{ items: S['RealType'][], metadata: MetaData }, HttpError>[] } = {}

    constructor(restModel: RestModel<Opts, S, IdKey, GetItem, MetaData>, url: UrlCallbackParam<Opts>) {
        this.restModel = restModel
        this.url = url
    }
    private getUri(opts: Opts, options: { queryString?: string, id?: string | number } = {}) {
        if (options.id) {
            return this.restModel.trailingSlash ? `${this.url(opts)}/${options.id}/` : `${this.url(opts)}/${options.id}`
        }
        if (options.queryString) {
            return this.restModel.trailingSlash ? `${this.url(opts)}/?${options.queryString}` : `${this.url(opts)}?${options.queryString}`
        }
        return this.restModel.trailingSlash ? `${this.url(opts)}/` : this.url(opts)
    }
    get(opts: Opts, queryString: string, callback?: Callback<{ items: S['RealType'][], metadata: MetaData }, HttpError>): any {
        const actions = this.actions
        return (dispatch: Dispatch<ActionUnion<typeof actions>>) => {
            const uri = this.getUri(opts, { queryString })
            if (callback) this.queue[uri].push(callback)
            dispatch(this.actions.request(opts, queryString))
            const xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4 && (xhttp.status === 200 || xhttp.status === 201)) {
                    const res = JSON.parse(xhttp.responseText)
                    // add array validation to schema.
                    if (this.restModel.validateFetch(res)) {
                        dispatch(this.actions.receive(opts, queryString, <GetItem>res))
                        try {
                            let cb
                            const response = {
                                items: this.restModel.getItems(res),
                                metadata: this.restModel.getMetaData(res)
                            }
                            while ((cb = this.queue[uri].shift()) !== undefined) {
                                cb(null, response)
                            }
                        } catch (err) {
                            const error = new HttpError(500, err.message)
                            dispatch(this.actions.failed(opts, queryString, error))
                            let cb
                            while ((cb = this.queue[uri].shift()) !== undefined) {
                                cb(error)
                            }
                        }
                    } else {
                        throw (new Error(`Response text from "${this.getUri(opts, { queryString })}" is not valid (Schema definition is invalid or bad implementation.)`))
                    }
                } else if (xhttp.readyState === 4) {
                    if (IGNORED_STATUS.indexOf(xhttp.status) > -1) {
                        return dispatch(this.get(opts, queryString, callback))
                    }
                    const error = new HttpError(xhttp.status, xhttp.responseText)
                    dispatch(this.actions.failed(opts, queryString, error))
                    let cb
                    while ((cb = this.queue[uri].shift()) !== undefined) {
                        cb(error)
                    }
                }
            }
            xhttp.open('GET', this.getUri(opts, { queryString }), true)
            Object.keys(this.restModel.headers).forEach(key => {
                xhttp.setRequestHeader(key, this.restModel.headers[key])
            })
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send()
        }
    }
    fetchIfNeeded(opts: Opts, queryString: string = '', callback?: Callback<{ items: S['RealType'][], metadata: MetaData | null | any }, HttpError>): any {
        const actions = this.actions
        return (dispatch: Dispatch<ActionUnion<typeof actions>>, getState: () => ReducerType) => {
            const uri = this.getUri(opts, { queryString })
            if (!this.queue.hasOwnProperty(uri)) this.queue[uri] = []
            const reducer = getState()[this.restModel.model.name] as RestApiReducerType<S['RealType'], MetaData, IdKey>
            const req = getGeneralRequest(reducer, uri)
            if (shouldFetch(req)) {
                return dispatch(this.get(opts, queryString, callback))
            }
            const promiseCb: Callback<{ items: S['RealType'][], metadata: MetaData | null }, HttpError> = (err, res) => {
                if (err) {
                    if (callback) callback(err)
                    return
                }
                if (callback) callback(null, res)
            }
            if (isFetching(req)) {
                this.queue[uri].push(promiseCb)
            } else {
                const error = getError(req)
                if (error) return promiseCb(error)
                promiseCb(null, {
                    items: getItems(reducer, this.restModel._id, uri),
                    metadata: getMetadata(reducer, uri)
                })
            }
        }
    }
    //TODO Opts needs to be changed by get key from schema. Won't populate submodels with opts.
    fetchPopulatedIfNeeded(opts: Opts, queryString: string = ''): any {
        return (dispatch: Dispatch<any>, getState: () => ReducerType) => {
            const uri = this.getUri(opts, { queryString })
            dispatch(this.fetchIfNeeded(opts, queryString))
            getItems((getState()[this.restModel.model.name] as RestApiReducerType<S['RealType'], MetaData, IdKey>), this.restModel._id, uri)
                .forEach(i => this.restModel.model.schema._getModelValuesToPopulate(i, (model, id) => {
                    dispatch(model._actions.fetchByIdPopulatedIfNeeded(id))
                }))
        }
    }
    invalidate(opts: Opts, queryString: string = ''): any {
        return this.actions.invalidate(opts, queryString)
    }
}
