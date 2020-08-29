import { Subject, Observer } from "./Observable";
import Model from "./Model";

import { RequestType } from "./ReducerStorage";
import { RestModel } from "./restmodels";
import { Schema } from "./Schema";

const INIT_REQUEST: RequestType<any> = {
    didInvalidate: true,
    error: null,
    isFetching: false,
    lastUpdated: null,
    result: null,
    initialized: false
}

export class ModelState<R extends RestModel<any, any, any, any, any>> implements Subject {
    private observers: Observer[] = []
    private _state: {
        searchs: {
            [url: string]: RequestType<{ ids: any[], metadata: any }>
        },
        ids: {
            [key: string]: {
                [id: string]: RequestType<any>
            }
        }
    } = { searchs: {}, ids: {} }
    private model: R['model']
    constructor(r: RestModel<any, any, any, any, any>) {
        this.model = r.model
    }
    public get modelName() {
        return this.model.name
    }
    public get state() {
        return this._state
    }
    public addKeyModel(key: string) {
        if (!this._state.ids.hasOwnProperty(key))
            this._state.ids[key] = {}
    }
    attach(observer: Observer): void {
        this.observers.push(observer)
    }
    detach(observer: Observer): void {
        this.observers = this.observers.splice(this.observers.indexOf(observer), 1)
    }
    notify(): void {
        this.observers.forEach(o => o.update(this))
    }
    public getRequest(url: string): RequestType<{ ids: R['itemType'][], metadata: any }> {
        const request = this._state.searchs[url]
        if (request === undefined) {
            return INIT_REQUEST
        }
        return request
    }
    public getRequestById(key: string, id: string): RequestType<R['model']['schema']['RealType']> {
        const request = this._state.ids[key][id]
        if (request === undefined) {
            return INIT_REQUEST
        }
        return request
    }
    /**
     * updateGet for an internal use
     */
    public updateGet<R extends RestModel<any, any, any, any, any>>(url: string, request: Partial<RequestType<{ ids: R['itemType'][], metadata: any }>>) {
        const modelBranchSearchs = this._state.searchs
        this._state.searchs = {
            ...modelBranchSearchs,
            [url]: {
                ...INIT_REQUEST,
                ...request
            }
        }
    }
    /**
     * updateGetById for an internal use
     */
    public updateGetById(key: string, id: string, request: Partial<RequestType<R['model']['schema']['RealType']>>) {
        const modelBranchIds = this._state.ids[key]
        this._state.ids[key] = {
            ...modelBranchIds,
            [id]: {
                ...INIT_REQUEST,
                ...request
            }
        }
    }
}
export class State implements Observer, Subject {
    private observers: Observer[] = []
    private _state: {
        [modelName: string]: {
            searchs: {
                [url: string]: RequestType<{ ids: any[], metadata: any }>
            },
            ids: {
                [key: string]: {
                    [id: string]: RequestType<any>
                }
            }
        }
    } = {}
    //TODO attach to all modelstates.
    public get state() {
        return this._state
    }
    attach(observer: Observer): void {
        this.observers.push(observer)
    }
    detach(observer: Observer): void {
        this.observers = this.observers.splice(this.observers.indexOf(observer), 1)
    }
    notify(): void {
        this.observers.forEach(o => o.update(this))
    }
    update(subject: ModelState<any>): void {
        this.state[subject.modelName] = subject.state
        this.notify()
    }
}
export default new State()