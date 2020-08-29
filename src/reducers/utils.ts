import { RequestType, RestApiReducerType } from "../models/ReducerStorage";
import { HttpError, filterNulls } from "../..";
import { StringOrNumberKeys } from "../models/Schema";

const INIT_REQUEST: RequestType<any> = {
    didInvalidate: true,
    error: null,
    isFetching: false,
    lastUpdated: null,
    result: null,
    initialized: false
}

export function generalAction<Item, MetaData, IdKey extends keyof Item & string>(
    state: RestApiReducerType<Item, MetaData, IdKey>,
    uri: string,
    req: Partial<RestApiReducerType<Item, MetaData, IdKey>['searchs']['']>
): RestApiReducerType<Item, MetaData, IdKey>['searchs'] {
    return Object.assign({}, state.searchs, {
        [uri]: Object.assign(INIT_REQUEST, state.searchs[uri], req)
    })
}
export function idAction<Item, MetaData, IdKey extends keyof Item & string>(
    state: RestApiReducerType<Item, MetaData, IdKey>['ids'],
    idKey: IdKey,
    id: string | number,
    req: Partial<RestApiReducerType<Item, MetaData, IdKey>['ids']['']['']>
): RestApiReducerType<Item, MetaData, IdKey>['ids'] {
    return Object.assign({}, state, {
        [idKey]: Object.assign({}, state[idKey], {
            [id]: Object.assign(INIT_REQUEST, state[idKey][id], req)
        })
    })
}
export function isInvalidated(req?: RequestType<any>): boolean {
    if (req)
        return req.didInvalidate
    return true
}
export function isInitialized(req?: RequestType<any>): boolean {
    if (req)
        return req.initialized
    return false
}
export function isFetching(req?: RequestType<any>): boolean {
    if (req)
        return req.isFetching
    return false
}
export function getError(req?: RequestType<any>): HttpError | null {
    if (req)
        return req.error
    return null
}
export function getResult<T>(req: RequestType<T>): T | null {
    return req && req.result !== null ? req.result : null
}

export function getItems<Item, Key extends keyof Item & string>(
    state: RestApiReducerType<Item, any, Key>,
    idKey: keyof Item & string,
    uri: string
): Item[] {
    const req = getGeneralRequest(state, uri)
    if (req.result) {
        return filterNulls(req.result.ids.map(id => getResult(getIdRequest(state, idKey, id))))
    }
    return []
}
export function getMetadata<Metadata>(
    state: RestApiReducerType<any, Metadata, any>,
    uri: string
): Metadata | null {
    const req = getGeneralRequest(state, uri)
    if (req.result) {
        return req.result.metadata
    }
    return null
}

export function getGeneralRequest<T, Metadata, Key extends keyof T & string>(
    state: RestApiReducerType<T, Metadata, Key>,
    uri: string
): RequestType<{ ids: T[Key][], metadata: Metadata }> {
    if (state.searchs[uri]) {
        return state.searchs[uri]
    }
    return INIT_REQUEST
}
export function storeIdRequest<Item>(state: RestApiReducerType<Item, any, any>, idKey: string, id: any, req: Partial<RequestType<Item>>): RestApiReducerType<Item, any, any> {
    return Object.assign({}, state, {
        ids: Object.assign({}, state.ids, {
            [idKey]: Object.assign({}, state.ids[idKey], {
                [id]: Object.assign({}, getIdRequest(state, idKey, id), req)
            })
        })
    })
}
export function mapAllRequest<Item, MetaData, Key extends keyof Item & string>(
    state: RestApiReducerType<Item, MetaData, Key>,
    mapRequest: (req: RequestType<{ ids: (Item[Key])[], metadata: MetaData }>) => RequestType<{ ids: (Item[Key])[], metadata: MetaData }>
): RestApiReducerType<Item, MetaData, Key> {
    return Object.assign({}, state, {
        searchs: Object.keys(state.searchs).map(uri => ({
            uri,
            value: mapRequest(state.searchs[uri])
        })).reduce((obj: RestApiReducerType<Item, MetaData, Key>['searchs'], next) => {
            obj[next.uri] = next.value
            return obj
        }, {})
    })
}
export function storeRequest<Item, MetaData, Key extends keyof Item & string>(state: RestApiReducerType<Item, MetaData, Key>, uri: string, req: Partial<RequestType<{ ids: (Item[Key])[], metadata: MetaData }>>): RestApiReducerType<Item, MetaData, Key> {
    return Object.assign({}, state, {
        searchs: Object.assign({}, state.searchs, {
            [uri]: Object.assign({}, state.searchs[uri], Object.assign({}, getGeneralRequest(state, uri), req))
        })
    })
}
export function storeItem<Item, K extends keyof Item & string>(state: RestApiReducerType<Item, any, any>, item: Item, keys: K[], lastUpdated: Date): RestApiReducerType<Item, any, any> {
    return Object.assign({}, state, {
        ids: Object.assign({}, state.ids, ...keys.map(idKey => {
            const id = item[idKey]
            if (typeof id !== 'string' && typeof id !== 'number') throw (new Error(`Invalid type for an id ${id}. Must be string or number.`))
            return {
                [idKey]: Object.assign({}, state.ids[idKey], {
                    [id]: Object.assign({}, INIT_REQUEST, {
                        result: item,
                        lastUpdated,
                        didInvalidate: false,
                        isFetching: false,
                        initialized: true
                    })
                })
            }
        }))
    })
}
export function storeItems<Item, MetaData, IdKey extends StringOrNumberKeys<Item> & string>(
    state: RestApiReducerType<Item, MetaData, IdKey>,
    idKeys: IdKey[],
    lastUpdated: Date,
    items: Item[]
): RestApiReducerType<Item, MetaData, IdKey>['ids'] {
    return Object.assign({},
        state.ids,
        idKeys.map(idKey => ({
            idKey,
            value: Object.assign({},
                state.ids[idKey],
                items.map(item => {
                    const id = item[idKey]
                    if (typeof id !== 'string' && typeof id !== 'number') throw (new Error(`Invalid type for an id ${id}. Must be string or number.`))
                    return {
                        id,
                        value: Object.assign({},
                            INIT_REQUEST,
                            {
                                isFetching: false,
                                result: item,
                                lastUpdated,
                                initialized: true
                            })
                    }
                }).reduce((items: RestApiReducerType<Item, MetaData, IdKey>['ids'][''], next) => {
                    items[next.id] = next.value
                    return items
                }, {})
            )
        })).reduce((items: RestApiReducerType<Item, MetaData, IdKey>['ids'], next) => {
            items[next.idKey] = next.value
            return items
        }, {}))
}
export function getIdRequest<Item>(state: RestApiReducerType<Item, any, any>, idKey: string, id: any): RequestType<Item> {
    if (typeof id !== 'string' && typeof id !== 'number') throw (new Error(`Invalid type for an id ${id}. Must be string or number.`))
    if (state.ids[idKey]) {
        const res = state.ids[idKey][id]
        if (res) {
            return res
        }
    }
    return INIT_REQUEST
}


export function provideFirstParam<Param, T extends any[], Q>(f: (arg: Param, ...args: T) => Q, param: Param): (...args: T) => Q {
    return f.bind(f, param)
}