import React from 'react'
import { Schema, StringOrNumberKeys } from '../Schema'
import ComplexIdActions from "../../actions/ComplexIdActions"
import ComplexIdReducer from '../../reducers/ComplexIdReducer'
import { RestModel, UrlCallbackParam } from "."
import { UseGetByIdResult, UseGetByIdPopulatedResult } from './basic/BasicIdRestModel'
import { useDispatch, useSelector } from '../../../';
import { shallowEqual } from 'react-redux'
import { ReducerType } from '../ReducerStorage'

export default class ComplexIdRestModel<OptType = any, S extends Schema<any> = any,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string = any
    > extends RestModel<OptType, S, IdKey>{

    /** @internal */
    public _actions: ComplexIdActions<OptType, S, IdKey>
    /** @internal */
    public _reducer: ComplexIdReducer<OptType, S, IdKey>

    constructor(model: RestModel<OptType, S, any, any, any>, key: IdKey, optSchema: Schema<OptType>, url: UrlCallbackParam<OptType>) {
        super(model.model, key, url, {
            trailingSlash: model.trailingSlash,
            headers: model.headers,
            getItems: model.getItems,
            getMetaData: model.getMetaData,
            itemStructure: model.itemStructure
        })
        this._actions = new ComplexIdActions(this)
        this._reducer = new ComplexIdReducer(this)
    }
    public useInvalidate(opts: OptType, id: S["RealType"][IdKey]) {
        return () => {
            const dispatch = useDispatch()
            dispatch(this._actions.invalidateById(opts, id))
        }
    }
    public useInvalidateAll() {
        return () => {
            const dispatch = useDispatch()
            dispatch(this._actions.invalidateAll())
        }
    }
    public useFetchByIdIfNeeded(opts: OptType, id: S["RealType"][IdKey]) {
        const dispatch = useDispatch()
        React.useEffect(() => {
            dispatch(this._actions.fetchByIdIfNeeded(opts, id))
        })
    }
    public useGetById(opts: OptType, id: S["RealType"][IdKey]) {
        type Result = UseGetByIdResult<S["RealType"]>
        const [result, setResult] = React.useState<Result>({ error: null, initialized: false, invalidated: true, loading: false, item: null })
        const redirect = this.useInvalidate(opts, id)
        const state = useSelector<ReducerType, Result>(state => {
            const resultState: UseGetByIdResult<S["RealType"]> = {
                item: this._reducer.getById(state, id),
                initialized: this._reducer.isIdInitialized(state, id),
                loading: this._reducer.isIdFetching(state, id),
                invalidated: this._reducer.isIdInvalidated(state, id),
                error: this._reducer.getIdError(state, id),
            }
            return resultState
        })
        this.useFetchByIdIfNeeded(opts, id)
        React.useEffect(() => {
            if (!shallowEqual(state, result)) setResult(state)
        })
        return { ...result, redirect }
    }

    public useFetchByIdPopulatedIfNeeded(opts: OptType, id: S["PopulatedType"][IdKey]) {
        const dispatch = useDispatch()
        React.useEffect(() => {
            dispatch(this._actions.fetchByIdPopulatedIfNeeded(opts, id))
        })
    }

    public useGetByIdPopulated(opts: OptType, id: S["PopulatedType"][IdKey]) {
        type Result = UseGetByIdPopulatedResult<S["PopulatedType"], S["FullPopulatedType"]>
        const redirect = this.useInvalidate(opts, id)
        const [result, setResult] = React.useState<Result>({ error: null, populated: false, initialized: false, invalidated: true, loading: false, item: null })
        const state = useSelector<ReducerType, Result>(state => {
            const resultState: UseGetByIdPopulatedResult<S["PopulatedType"], S["FullPopulatedType"]> = {
                item: this._reducer.getByIdPopulated(state, id),
                loading: this._reducer.isIdFetching(state, id),
                initialized: this._reducer.isIdInitialized(state, id),
                populated: this._reducer.isIdPopulated(state, id),
                invalidated: this._reducer.isIdInvalidated(state, id),
                error: this._reducer.getIdError(state, id),
            }
            return resultState
        })
        this.useFetchByIdPopulatedIfNeeded(opts, id)
        React.useEffect(() => {
            const { item: newItem, ...newOthers } = state
            const { item, ...others } = state
            if (!shallowEqual(newOthers, others) || (newItem && !item) || state.populated !== result.populated) {
                setResult(state)
            }
        })
        return { ...result, redirect }
    }
}