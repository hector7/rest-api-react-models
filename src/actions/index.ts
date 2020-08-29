
import { isFetching, isInvalidated } from "../reducers/utils";
import { createAction, HttpError } from "../..";
import { RequestType } from "../models/ReducerStorage";

export const IGNORED_STATUS = [408]
export const REQUEST = 'REQUEST'
export const FAILED = 'FAILED'
export const INVALIDATE = 'INVALIDATE'
export const INVALIDATE_ALL = 'INVALIDATE_ALL'
export const RECEIVE = 'RECEIVE'
export const REQUEST_ID = 'REQUEST_ID'
export const FAILED_ID = 'FAILED_ID'
export const INVALIDATE_ID = 'INVALIDATE_ID'
export const RECEIVE_ID = 'RECEIVE_ID'
export const REMOVE_ID = 'REMOVE_ID'


export const idActions = {
    invalidateAll: (reducerName: string, optKey: string = '') => createAction(INVALIDATE_ALL, {
        reducerName,
        optKey
    }),
    fetchByIdIfNeeded: (reducerName: string, idKey: string, id: string | number, optKey: string = '', ) => createAction(REQUEST_ID, {
        idKey,
        reducerName,
        id,
        optKey
    }),
    failedById: (reducerName: string, idKey: string, id: string | number, error: HttpError, optKey: string = '', ) => createAction(FAILED_ID, {
        idKey,
        reducerName,
        id,
        error,
        optKey
    }),
    invalidateById: (reducerName: string, idKey: string, id: string | number, optKey: string = '', ) => createAction(INVALIDATE_ID, {
        idKey,
        reducerName,
        id,
        optKey
    }),
    receiveById: function <T extends any>(reducerName: string, data: T, optKey: string = '', ) {
        return createAction(RECEIVE_ID, {
            reducerName,
            data,
            optKey
        })
    },
    removeById: function (reducerName: string, idKey: string, data: any, optKey: string = '', ) {
        return createAction(REMOVE_ID, {
            idKey,
            reducerName,
            data,
            id: data[idKey],
            optKey
        })
    },
}
export const restActions = {
    request: (reducerName: string, uri: string, optKey: string = '') => createAction(REQUEST, {
        uri,
        reducerName,
        optKey
    }),
    failed: (reducerName: string, uri: string, error: HttpError, optKey: string = '') => createAction(FAILED, {
        uri,
        reducerName,
        error,
        optKey
    }),
    invalidate: (reducerName: string, uri: string, optKey: string = '') => createAction(INVALIDATE, {
        uri,
        reducerName,
        optKey
    }),
    receive: function <Data extends any, MetaData extends any, IdKey extends keyof Data & string>(idKey: IdKey, reducerName: string, uri: string, items: Data[], metadata: MetaData, optKey: string = '') {
        return createAction(RECEIVE, {
            idKey,
            reducerName,
            uri,
            items,
            metadata,
            optKey
        })
    },
}

export function shouldFetch(request: RequestType<any>) {
    if (isFetching(request)) return false
    return isInvalidated(request)
}
export type ActionUnion<A extends { [actionsCreator: string]: (...args: any[]) => any }> = ReturnType<A[keyof A]>