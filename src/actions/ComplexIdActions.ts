import { Schema, StringOrNumberKeys } from "../models/Schema"
import { Callback, HttpError, ActionUnion } from "../.."
import { idActions, IGNORED_STATUS, shouldFetch } from './index'
import { isFetching, getIdRequest, getResult, getError } from '../reducers/utils'
import { Dispatch } from "redux";
import { RestModel } from "../models/restmodels";
import { RestApiReducerType, ReducerType } from "../models/ReducerStorage";

export default class ComplexIdActions<Opts,
    S extends Schema<any>,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string,> {

    private actions = {
        fetchByIdIfNeeded: (opt: Opts, id: string | number) => idActions.fetchByIdIfNeeded(this.restModel.model.name, this.restModel._id, id),
        invalidateAll: () => idActions.invalidateAll(this.restModel.model.name),
        invalidateOpt: (opt: Opts) => idActions.invalidateAll(this.restModel.model.name),
        failedById: (opt: Opts, id: string | number, error: HttpError) => idActions.failedById(this.restModel.model.name, this.restModel._id, id, error),
        invalidateById: (opt: Opts, id: string | number) => idActions.invalidateById(this.restModel.model.name, this.restModel._id, id),
        receiveById: (opt: Opts, data: S['RealType']) => idActions.receiveById(this.restModel.model.name, data),
        removeById: (opt: Opts, data: S['RealType']) => idActions.removeById(this.restModel.model.name, this.restModel._id, data),
    }

    private restModel: RestModel<Opts, S, IdKey, any, any>

    private idQueue: { [optKey: string]: { [id: string]: Callback<S['RealType'] | null, HttpError>[] } } = {}

    constructor(restModel: RestModel<Opts, S, IdKey, any, any>) {
        this.restModel = restModel
    }
    private getIdRequest(getState: () => ReducerType, id: S['RealType'][IdKey]) {
        const reducer = (<RestApiReducerType<S['RealType'], any, IdKey>>(getState()[this.restModel.model.name]))
        return getIdRequest(reducer, this.restModel._id, id)
    }
    private getUri(opts: Opts) {
        return this.restModel.trailingSlash ? `${this.restModel.getUrl(opts)}/` : `${this.restModel.getUrl(opts)}`
    }
    private getIdUri(opts: Opts, id: string | number) {
        return this.restModel.trailingSlash ? `${this.restModel.getUrl(opts)}/${id}/` : `${this.restModel.getUrl(opts)}/${id}`
    }
    private getById(opts: Opts, id: string | number, callback?: Callback<S['RealType'] | null, HttpError>): any {
        const actions = this.actions
        return (dispatch: Dispatch<ActionUnion<typeof actions>>) => {
            const optKey = this.getUri(opts)
            if (callback) this.idQueue[optKey][id].push(callback)
            dispatch(actions.fetchByIdIfNeeded(opts, id))
            const xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4 && (xhttp.status === 200 || xhttp.status === 201)) {
                    try {
                        const res = JSON.parse(xhttp.responseText)
                        if (this.restModel.validateItem(res)) {
                            dispatch(actions.receiveById(opts, res))
                            let cb
                            while ((cb = this.idQueue[optKey][id].shift()) !== undefined) {
                                cb(null, res)
                            }
                        } else {
                            console.log('not validated')
                            throw (new Error(`Response text from "${this.getIdUri(opts, id)}" is not valid (Schema definition is invalid or bad implementation.)`))
                        }
                    } catch (err) {
                        const error = new HttpError(500, err.message)
                        dispatch(actions.failedById(opts, id, error))
                        let cb
                        while ((cb = this.idQueue[optKey][id].shift()) !== undefined) {
                            cb(error)
                        }
                    }
                } else if (xhttp.readyState === 4) {
                    if (IGNORED_STATUS.indexOf(xhttp.status) > -1) {
                        return dispatch(this.getById(opts, id, callback))
                    }
                    const error = new HttpError(xhttp.status, xhttp.responseText)
                    dispatch(actions.failedById(opts, id, error))
                    let cb
                    while ((cb = this.idQueue[optKey][id].shift()) !== undefined) {
                        cb(error)
                    }
                }
            }
            xhttp.open('GET', this.getIdUri(opts, id), true)
            Object.keys(this.restModel.headers).forEach(key => {
                xhttp.setRequestHeader(key, this.restModel.headers[key])
            })
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send()
        }
    }
    invalidateById(opts: Opts, id: S['RealType'][IdKey]): any {
        if (typeof id !== 'string' && typeof id !== 'number')
            throw (new Error(`${JSON.stringify(id)} is not string or number. is type ${typeof id}`))
        return this.actions.invalidateById(opts, id)
    }
    fetchByIdIfNeeded(opts: Opts, id: S['RealType'][IdKey], callback?: Callback<S['RealType'] | null, HttpError>): any {
        const actions = this.actions
        return (dispatch: Dispatch<ActionUnion<typeof actions>>, getState: () => ReducerType) => {
            const optKey = this.getUri(opts)
            if (typeof id !== 'string' && typeof id !== 'number')
                throw (new Error(`${JSON.stringify(id)} is not string or number. is type ${typeof id}`))
            if (!this.idQueue.hasOwnProperty(optKey)) this.idQueue[optKey] = {}
            if (!this.idQueue[optKey].hasOwnProperty(id)) this.idQueue[optKey][id] = []
            const req = this.getIdRequest(getState, id)
            if (shouldFetch(req)) {
                return dispatch(this.getById(opts, id, callback))
            }
            const promiseCb: Callback<S['RealType'] | null, HttpError> = (err, res) => {
                if (err) {
                    if (callback) callback(err)
                    return
                }
                if (callback) callback(null, res)
            }
            if (isFetching(req)) {
                this.idQueue[optKey][id].push(promiseCb)
            } else {
                const error = getError(req)
                if (error) return promiseCb(error)
                promiseCb(null, getResult(req))
            }
        }
    }
    fetchByIdPopulatedIfNeeded(opts: Opts, id: S['RealType'][IdKey]): any {
        const actions = this.actions
        return (dispatch: Dispatch<ActionUnion<typeof actions>>, getState: () => ReducerType) => {
            dispatch(this.fetchByIdIfNeeded(opts, id))
            const req = this.getIdRequest(getState, id)
            if (req.result) {
                this.restModel.model.schema._getModelValuesToPopulate(req.result, (model, id) => dispatch(model._actions.fetchByIdPopulatedIfNeeded(id)))
            }
            //TODO Return promise
        }
    }
    post(opts: Opts, item: Omit<S['RealType'], IdKey> | FormData, callback: Callback<S['RealType'], HttpError>): any {
        const actions = this.actions
        return (dispatch: Dispatch<ActionUnion<typeof actions>>) => {
            const xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4 && (xhttp.status === 200 || xhttp.status === 201)) {
                    try {
                        const item: S['RealType'] = JSON.parse(xhttp.responseText)
                        dispatch(this.actions.invalidateAll())
                        dispatch(actions.receiveById(opts, item))
                        callback(null, item)
                    } catch (err) {
                        callback(new HttpError(500, err.message))
                    }
                } else if (xhttp.readyState === 4) {
                    if (IGNORED_STATUS.indexOf(xhttp.status) > -1) {
                        return dispatch(this.post(opts, item, callback))
                    }
                    callback(new HttpError(xhttp.status, xhttp.responseText))
                }
            }
            xhttp.open('POST', this.getUri(opts), true)
            Object.keys(this.restModel.headers).forEach(key => {
                xhttp.setRequestHeader(key, this.restModel.headers[key])
            })
            if ((<any>item).__proto__ === FormData)
                xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            else
                xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send((<any>item).__proto__ === FormData ? <FormData>item : JSON.stringify(item))
        }
    }
    put(opts: Opts, id: S['RealType'][IdKey], item: S['RealType'] | FormData, callback: Callback<S['RealType'], HttpError>): any {
        const actions = this.actions
        return (dispatch: Dispatch<ActionUnion<typeof actions>>) => {
            if (typeof id !== 'string' && typeof id !== 'number')
                throw (new Error(`${JSON.stringify(id)} is not string or number. is type ${typeof id}`))
            const xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    try {
                        const item: S['RealType'] = JSON.parse(xhttp.responseText)
                        dispatch(this.actions.invalidateAll())
                        dispatch(actions.receiveById(opts, item))
                        callback(null, item)
                    } catch (err) {
                        callback(new HttpError(500, err.message))
                    }
                } else if (xhttp.readyState === 4) {
                    if (IGNORED_STATUS.indexOf(xhttp.status) > -1) {
                        return dispatch(this.put(opts, id, item, callback))
                    }
                    callback(new HttpError(xhttp.status, xhttp.responseText))
                }
            }
            xhttp.open('PUT', this.getIdUri(opts, id), true)
            Object.keys(this.restModel.headers).forEach(key => {
                xhttp.setRequestHeader(key, this.restModel.headers[key])
            })
            if ((<any>item).__proto__ === FormData)
                xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            else
                xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send((<any>item).__proto__ === FormData ? <FormData>item : JSON.stringify(item))
        }
    }
    invalidateAll(): any {
        return this.actions.invalidateAll()
    }
    patch(opts: Opts, id: S['RealType'][IdKey], item: Partial<S['RealType']> | FormData, callback: Callback<S['RealType'], HttpError>): any {
        const actions = this.actions
        return (dispatch: Dispatch<ActionUnion<typeof actions>>) => {
            if (typeof id !== 'string' && typeof id !== 'number')
                throw (new Error(`${JSON.stringify(id)} is not string or number. is type ${typeof id}`))
            const xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    try {
                        const item: S['RealType'] = JSON.parse(xhttp.responseText)
                        dispatch(this.actions.invalidateAll())
                        dispatch(actions.receiveById(opts, item))
                        callback(null, item)
                    } catch (err) {
                        callback(new HttpError(500, err.message))
                    }
                } else if (xhttp.readyState === 4) {
                    if (IGNORED_STATUS.indexOf(xhttp.status) > -1) {
                        return dispatch(this.patch(opts, id, item, callback))
                    }
                    callback(new HttpError(xhttp.status, xhttp.responseText))
                }
            }
            xhttp.open('PATCH', this.getIdUri(opts, id), true)
            Object.keys(this.restModel.headers).forEach(key => {
                xhttp.setRequestHeader(key, this.restModel.headers[key])
            })
            if ((<any>item).__proto__ === FormData)
                xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            else
                xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send((<any>item).__proto__ === FormData ? <FormData>item : JSON.stringify(item))
        }
    }
    delete(opts: Opts, item: S['RealType'], callback: Callback<undefined, HttpError>): any {
        const actions = this.actions
        return (dispatch: Dispatch<ActionUnion<typeof actions>>) => {
            const xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4 && (xhttp.status === 200 || xhttp.status === 204)) {
                    try {
                        dispatch(this.actions.invalidateAll())
                        dispatch(actions.removeById(opts, item))
                        callback(null)
                    } catch (err) {
                        callback(new HttpError(500, err.message))
                    }
                } else if (xhttp.readyState === 4) {
                    if (IGNORED_STATUS.indexOf(xhttp.status) > -1) {
                        return dispatch(this.delete(opts, item, callback))
                    }
                    callback(new HttpError(xhttp.status, xhttp.responseText))
                }
            }
            xhttp.open('DELETE', this.getIdUri(opts, item[this.restModel._id] as any), true)
            Object.keys(this.restModel.headers).forEach(key => {
                xhttp.setRequestHeader(key, this.restModel.headers[key])
            })
            xhttp.send()
        }
    }
}
