import { combineReducers } from "redux"
import { ActionUnion, HttpError } from "../.."
import { idActions, restActions } from "../actions"
import { storeRequest, mapAllRequest, storeItems, storeIdRequest, storeItem } from "../reducers/utils"
import { Item } from "./Schema"

export type RequestType<T> = {
    didInvalidate: boolean,
    isFetching: boolean,
    lastUpdated: Date | null,
    error: HttpError | null,
    result: T | null,
    initialized: boolean
}
export type RestApiReducerType<Item, MetaData, Key extends keyof Item & string> = {
    searchs: {
        [url: string]: RequestType<{ ids: (Item[Key])[], metadata: MetaData }>
    },
    derived: {
        [modelName: string]: {
            [key: string]: RestApiReducerType<Item, MetaData, any>
        }
    },
    ids: {
        [key: string]: {
            [id: string]: RequestType<Item>
        }
    }
}
export type ApiReducerType<T> = {
    [queryString: string]: RequestType<T>
}

export const reducers: { [key: string]: RestApiReducerMap<any, any, any> } = {}

export type ReducerType = {
    [key: string]: RestApiReducerType<any, any, any> | ApiReducerType<any>
};


export type RestApiReducerMap<Item, Metadata, Key extends keyof Item & string> = (
    state: RestApiReducerType<Item, Metadata, Key> | undefined, action: ActionUnion<typeof idActions> | ActionUnion<typeof restActions>
) => RestApiReducerType<Item, Metadata, Key>
export default class ReducerStorage {
    static storage: ReducerStorage
    static getInstance() {
        if (ReducerStorage.storage === undefined) {
            ReducerStorage.storage = new ReducerStorage()
        }
        return ReducerStorage.storage
    }
    private reducers: {
        [modelName: string]: {
            ids: string[],
            subComplexReducerNames: string[]
        }
    } = {}
    static getReducerName() {
        let n_items = Object.keys(ReducerStorage.getInstance()).length
        let generated_name = `rd_${++n_items}`
        while (ReducerStorage.getInstance().reducers.hasOwnProperty(generated_name)) {
            generated_name = `rd_${++n_items}`
        }
        return generated_name
    }
    static addBasicIdReducer(modelName: string, id: string) {
        if (!ReducerStorage.getInstance().reducers.hasOwnProperty(modelName)) ReducerStorage.getInstance().reducers[modelName] = { ids: [], subComplexReducerNames: [] }
        if (ReducerStorage.getInstance().reducers[modelName].ids.indexOf(id) < 0)
            ReducerStorage.getInstance().reducers[modelName].ids.push(id)
    }
    static addComplexReducer(modelName: string, reducerName: string) {
        if (!ReducerStorage.getInstance().reducers.hasOwnProperty(modelName)) ReducerStorage.getInstance().reducers[modelName] = { ids: [], subComplexReducerNames: [] }
        ReducerStorage.getInstance().reducers[modelName].subComplexReducerNames.push(reducerName)
    }
    private getReducerByModelName(modelName: string, complexReducers: string[]): RestApiReducerMap<any, any, any> {
        return (state = { ids: {}, searchs: {}, derived: {} }, action) => {
            if (action.reducerName) {
                if (action.reducerName === modelName) {
                    switch (action.type) {
                        case 'REQUEST':
                            return storeRequest(state, action.uri, {
                                isFetching: true,
                                didInvalidate: false,
                                initialized: true
                            })
                        case 'FAILED':
                            return storeRequest(state, action.uri, {
                                isFetching: false,
                                didInvalidate: false,
                                error: action.error
                            })
                        case 'INVALIDATE_ALL':
                            return mapAllRequest(state, req => ({
                                ...req,
                                didInvalidate: true
                            }))
                        case 'INVALIDATE':
                            return storeRequest(state, action.uri, {
                                didInvalidate: true
                            })
                        case 'RECEIVE':
                            const lastUpdated = new Date()
                            return Object.assign(storeRequest(state, action.uri, {
                                isFetching: false,
                                didInvalidate: false,
                                lastUpdated,
                                result: {
                                    ids: action.items.map((i: any) => i[action.idKey]),
                                    metadata: action.metadata
                                },
                                initialized: true
                            }), {
                                ids: storeItems(state, this.reducers[modelName].ids, lastUpdated, action.items)
                            })
                        case 'REQUEST_ID':
                            return storeIdRequest(state, action.idKey, action.id, {
                                isFetching: true,
                                didInvalidate: false,
                                initialized: true
                            })
                        case 'FAILED_ID':
                            return storeIdRequest(state, action.idKey, action.id, {
                                isFetching: false,
                                error: action.error
                            })
                        case 'INVALIDATE_ID':
                            return storeIdRequest(state, action.idKey, action.id, {
                                didInvalidate: true
                            })
                        case 'REMOVE_ID':
                            const { [action.id]: idRemoved, ...otherIds } = state.ids[action.idKey]
                            return Object.assign({}, state, {
                                ids: Object.assign({}, state.ids, {
                                    [action.idKey]: Object.assign({}, otherIds)
                                })
                            })
                        case 'RECEIVE_ID':
                            return storeItem(state, action.data, this.reducers[modelName].ids, new Date())
                    }
                }
                if (complexReducers.indexOf(action.reducerName)) {
                    return Object.assign({}, state, {
                        derived: Object.assign({}, state.derived, {
                            [action.reducerName]: Object.assign({}, state.derived[action.reducerName], {
                                [action.optKey]: this.getReducerByModelName(modelName, [])
                            })
                        })
                    })
                }
            }
            return state
        }
    }
    private get reducer() {
        if (Object.keys(this.reducers).length === 0) {
            console.warn('@rest-api/react-models without any models. Has imported yet?')
            return (state: any) => state
        }
        return combineReducers(Object.keys(this.reducers).map(modelName => ({
            modelName,
            reducer: this.getReducerByModelName(modelName, this.reducers[modelName].subComplexReducerNames)
        })).reduce((res: {
            [key: string]: (
                state: RestApiReducerType<Item, any, any> | undefined,
                action: ActionUnion<typeof idActions> |
                    ActionUnion<typeof restActions>
            ) => RestApiReducerType<Item, any, any>
        }, next) => {
            res[next.modelName] = next.reducer
            return res
        }, {}))
    }
    static get generalReducer() {
        return ReducerStorage.getInstance().reducer
    }
}
