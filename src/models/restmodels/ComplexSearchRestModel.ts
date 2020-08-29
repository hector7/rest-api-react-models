import React from 'react'
import { RestModel, UrlCallbackParam } from "."
import { Schema, StringOrNumberKeys } from "../Schema"
import ComplexSearchActions from '../../actions/ComplexSearchActions'
import ComplexSearchReducer from '../../reducers/ComplexSearchReducer'
import ComplexIdRestModel from './ComplexIdRestModel'
import BasicIdRestModel from './basic/BasicIdRestModel'
import { shallowEqual } from 'react-redux'
import { useDispatch, useSelector } from '../../../';
import { UseGetPopulatedResult, UseGetResult } from './basic/BasicSearchRestModel'
import { ReducerType } from '../ReducerStorage'

export default class ComplexSearchRestModel<OptType = any,
    S extends Schema<any> = any,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string = any,
    GetItem = any,
    MetaData = any> extends RestModel<OptType, S, IdKey, GetItem, MetaData>{

    /** @internal */
    public _actions: ComplexSearchActions<OptType, S, IdKey, GetItem, MetaData>

    /** @internal */
    public _reducer: ComplexSearchReducer<OptType, S, IdKey, MetaData>
    constructor(idModel: BasicIdRestModel<S, IdKey> | ComplexIdRestModel<OptType, S, IdKey>, optSchema: Schema<OptType, any, any>, url: UrlCallbackParam<OptType>) {
        super(idModel.model, idModel._id, url, {
            trailingSlash: idModel.trailingSlash,
            headers: idModel.headers,
            getItems: idModel.getItems as any,
            getMetaData: idModel.getMetaData as any,
            itemStructure: idModel.itemStructure as any
        })
        this._reducer = new ComplexSearchReducer(this, idModel._reducer, url)
        this._actions = new ComplexSearchActions(this, url)
    }

    public useFetchIfNeeded(opts: OptType, queryString?: string | URLSearchParams) {
        const dispatch = useDispatch()
        React.useEffect(() => {
            dispatch(this._actions.fetchIfNeeded(opts, queryString?.toString()))
        })
    }
    public useInvalidate(opts: OptType, queryString?: string | URLSearchParams) {
        return () => {
            const dispatch = useDispatch()
            dispatch(this._actions.invalidate(opts, queryString?.toString()))
        }
    }
    public useGet(opts: OptType, queryString?: string | URLSearchParams) {
        type Result = UseGetResult<S["RealType"], MetaData> & { state: ReducerType }
        const [result, setResult] = React.useState<Omit<Result, 'redirect'>>({ error: null, metadata: null, initialized: false, invalidated: true, loading: false, items: [], state: {} })
        const redirect = this.useInvalidate(opts, queryString?.toString())
        const state = useSelector<ReducerType, Omit<Result, 'redirect'>>(state => {
            const resultState: Omit<UseGetResult<S["RealType"], MetaData>, 'redirect'> & { state: ReducerType } = {
                state,
                items: this._reducer.get(opts, state, queryString?.toString()),
                metadata: this._reducer.getMetadata(opts, state, queryString?.toString()),
                loading: this._reducer.isFetching(opts, state, queryString?.toString()),
                initialized: this._reducer.isInitialized(opts, state, queryString?.toString()),
                invalidated: this._reducer.isInvalidated(opts, state, queryString?.toString()),
                error: this._reducer.getError(opts, state, queryString?.toString()),
            }
            return resultState
        })
        this.useFetchIfNeeded(opts, queryString)
        React.useEffect(() => {
            const { items: currentItems, ...currentState } = state
            const { items: prevItems, ...prevState } = result
            if (!shallowEqual(prevState, currentState)) setResult(state)
            else if (currentItems.length !== prevItems.length) setResult(state)
            else if (currentItems.some((item, key) => {
                return item !== this._reducer.get(opts, prevState.state, queryString?.toString())[key]
            })) setResult(state)
        })
        const { state: currentSate, ...other } = state
        return { ...other, redirect }
    }

    public useFetchPopulatedIfNeeded(opts: OptType, queryString?: string | URLSearchParams) {
        const dispatch = useDispatch()
        React.useEffect(() => {
            dispatch(this._actions.fetchPopulatedIfNeeded(opts, queryString?.toString()))
        })
    }

    public useGetPopulated(opts: OptType, queryString?: string | URLSearchParams) {
        const redirect = this.useInvalidate(opts, queryString?.toString())
        type Result = UseGetPopulatedResult<S["PopulatedType"], S["FullPopulatedType"], MetaData> & { state: ReducerType }
        const [result, setResult] = React.useState<Result>({ error: null, initialized: false, metadata: null, populated: false, invalidated: true, loading: false, items: [], state: {} })
        const state = useSelector<ReducerType, Result>(state => {
            const resultState: UseGetPopulatedResult<S["PopulatedType"], S["FullPopulatedType"], MetaData> & { state: ReducerType } = {
                state,
                populated: this._reducer.isPopulated(opts, state, queryString?.toString()),
                items: this._reducer.getPopulated(opts, state, queryString?.toString()),
                initialized: this._reducer.isInitialized(opts, state, queryString?.toString()),
                loading: this._reducer.isFetching(opts, state, queryString?.toString()),
                metadata: this._reducer.getMetadata(opts, state, queryString?.toString()),
                invalidated: this._reducer.isInvalidated(opts, state, queryString?.toString()),
                error: this._reducer.getError(opts, state, queryString?.toString()),
            }
            return resultState
        })
        this.useFetchPopulatedIfNeeded(opts, queryString)
        React.useEffect(() => {
            const { items: currentItems, ...currentState } = state
            const { items: prevItems, ...prevState } = result
            if (!shallowEqual(prevState, currentState)) setResult(state)
            else if (currentItems.length !== prevItems.length) setResult(state)
            else if (this._reducer.get(opts, currentState.state, queryString?.toString()).some(item => {
                let count = 0
                this.model.schema._getModelValuesToPopulate(item, (model, id) => {
                    if (this._reducer.getById(currentState.state, id) !== this._reducer.getById(prevState.state, id)) count++
                })
                return count > 0
            })) setResult(state)
        })
        const { state: currentSate, ...other } = state
        return { ...other, redirect }
    }
}