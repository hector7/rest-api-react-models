import React from 'react'
import BasicIdRestModel from './BasicIdRestModel'
import { Schema, StringOrNumberKeys } from "../../Schema"
import BasicSearchReducer from '../../../reducers/BasicSearchReducer'
import BasicSearchActions from '../../../actions/BasicSearchActions'
import { RestModel, UrlCallbackParam } from '../index'
import { useDispatch, useSelector, HttpError } from '../../../../';
import { shallowEqual } from 'react-redux'
import { ReducerType } from '../../ReducerStorage'

export type UseGetResult<Item, MetaData> = {
    items: NonNullable<Item>[];
    initialized: boolean,
    loading: boolean;
    invalidated: boolean;
    error: HttpError | null;
    metadata: MetaData | null;
    reload: () => void;
}

export type UseGetPopulatedResult<PartialItem, PopulatedItem, MetaData> = {
    invalidated: boolean;
    error: HttpError | null;
    initialized: boolean,
    loading: boolean;
    metadata: MetaData | null;

} & ({
    populated: true
    items: PopulatedItem[]
} | {
    populated: false
    items: PartialItem[]
})

export default class BasicSearchRestModel<S extends Schema<any> = any,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string = any,
    GetItem = any,
    MetaData = any
    > extends RestModel<{}, S, IdKey, GetItem, MetaData>{
    /** @internal */
    public _actions: BasicSearchActions<S, IdKey, GetItem, MetaData>
    /** @internal */
    public _reducer: BasicSearchReducer<S, IdKey, MetaData>
    constructor(idModel: BasicIdRestModel<S, IdKey>, url: UrlCallbackParam<{}>) {
        super(idModel.model, idModel._id, url, {
            trailingSlash: idModel.trailingSlash,
            headers: idModel.headers,
            getItems: idModel.getItems,
            getMetaData: idModel.getMetaData,
            itemStructure: idModel.itemStructure
        })
        this._reducer = new BasicSearchReducer<S, IdKey, MetaData>(idModel, url)
        this._actions = new BasicSearchActions<S, IdKey, GetItem, MetaData>(idModel, url)
    }
    
    public useInvalidate(queryString?: string | URLSearchParams) {
        return () => {
            const dispatch = useDispatch()
            dispatch(this._actions.invalidate(queryString?.toString()))
        }
    }
    public useFetchIfNeeded(queryString?: string | URLSearchParams) {
        const dispatch = useDispatch()
        React.useEffect(() => {
            dispatch(this._actions.fetchIfNeeded(queryString?.toString()))
        })
    }
    
    public useGet(queryString?: string | URLSearchParams) {
        type Result = UseGetResult<S["RealType"], MetaData> & { state: ReducerType }
        const [result, setResult] = React.useState<Omit<Result, 'reload'>>({ error: null, metadata: null, initialized: false, invalidated: true, loading: false, items: [], state: {} })
        const reload = this.useInvalidate(queryString?.toString())
        const state = useSelector<ReducerType, Omit<Result, 'reload'>>(state => {
            const resultState: Omit<UseGetResult<S["RealType"], MetaData>, 'reload'> & { state: ReducerType } = {
                state,
                items: this._reducer.get(state, queryString?.toString()),
                metadata: this._reducer.getMetadata(state, queryString?.toString()),
                loading: this._reducer.isFetching(state, queryString?.toString()),
                initialized: this._reducer.isInitialized(state, queryString?.toString()),
                invalidated: this._reducer.isInvalidated(state, queryString?.toString()),
                error: this._reducer.getError(state, queryString?.toString()),
            }
            return resultState
        })
        this.useFetchIfNeeded(queryString)
        React.useEffect(() => {
            const { items: currentItems, ...currentState } = state
            const { items: prevItems, ...prevState } = result
            if (!shallowEqual(prevState, currentState)) setResult(state)
            else if (currentItems.length !== prevItems.length) setResult(state)
            else if (currentItems.some((item, key) => {
                return item !== this._reducer.get(prevState.state, queryString?.toString())[key]
            })) setResult(state)
        })
        const { state: currentSate, ...other } = state
        return { ...other, reload }
    }

    public useFetchPopulatedIfNeeded(queryString?: string | URLSearchParams) {
        const dispatch = useDispatch()
        React.useEffect(() => {
            dispatch(this._actions.fetchPopulatedIfNeeded(queryString?.toString()))
        })
    }

    public useGetPopulated(queryString?: string | URLSearchParams) {
        type Result = UseGetPopulatedResult<S["PopulatedType"], S["FullPopulatedType"], MetaData> & { state: ReducerType }
        const reload = this.useInvalidate(queryString?.toString())
        const [result, setResult] = React.useState<Result>({ error: null, initialized: false, metadata: null, populated: false, invalidated: true, loading: false, items: [], state: {} })
        const state = useSelector<ReducerType, Result>(state => {
            const resultState: UseGetPopulatedResult<S["PopulatedType"], S["FullPopulatedType"], MetaData> & { state: ReducerType } = {
                state,
                populated: this._reducer.isPopulated(state, queryString?.toString()),
                items: this._reducer.getPopulated(state, queryString?.toString()),
                initialized: this._reducer.isInitialized(state, queryString?.toString()),
                loading: this._reducer.isFetching(state, queryString?.toString()),
                metadata: this._reducer.getMetadata(state, queryString?.toString()),
                invalidated: this._reducer.isInvalidated(state, queryString?.toString()),
                error: this._reducer.getError(state, queryString?.toString()),
            }
            return resultState
        })
        this.useFetchPopulatedIfNeeded(queryString)
        React.useEffect(() => {
            const { items: currentItems, ...currentState } = state
            const { items: prevItems, ...prevState } = result
            if (!shallowEqual(prevState, currentState)) setResult(state)
            else if (currentItems.length !== prevItems.length) setResult(state)
            else if (this._reducer.get(currentState.state, queryString?.toString()).some(item => {
                let count = 0
                this.model.schema._getModelValuesToPopulate(item, (model, id) => {
                    if (this._reducer.getById(currentState.state, id) !== this._reducer.getById(prevState.state, id)) count++
                })
                return count > 0
            })) setResult(state)
        })
        const { state: currentSate, ...other } = state
        return { ...other, reload }
    }
}