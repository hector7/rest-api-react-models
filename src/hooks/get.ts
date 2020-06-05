import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model, HttpError } from '@rest-api/redux'
import { shallowEqual } from 'react-redux'
import { useDispatch, useSelector } from '../..'
import BasicSearchRestModel from '@rest-api/redux/src/restmodels/basic/BasicSearchRestModel'
import ComplexSearchRestModel from '@rest-api/redux/src/restmodels/ComplexSearchRestModel'

export type PropsFromItem<Item, MetaData> = {
    items: NonNullable<Item>[];
    loading: boolean;
    invalidated: boolean;
    error: HttpError | null;
    metadata: MetaData | null;
}



export default function useGet<
    RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string,
    Metadata
>(
    model: Model<RealType, any, any, IdKey, any, Metadata> | BasicSearchRestModel<RealType, any, any, IdKey, any, Metadata>,
    queryString?: string | URLSearchParams
): PropsFromItem<RealType, Metadata> {
    const { fetchIfNeeded } = model.actions
    type Result = PropsFromItem<RealType, Metadata> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Result>({ error: null, metadata: null, invalidated: true, loading: false, items: [], state: <any>{} })
    const { get, getMetadata, isFetching, isInvalidated, getError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<RealType, Metadata> & { state: ReducerNamespace.ReducerType } = {
            state,
            items: get(state, queryString?.toString()),
            metadata: getMetadata(state, queryString?.toString()),
            loading: isFetching(state, queryString?.toString()),
            invalidated: isInvalidated(state, queryString?.toString()),
            error: getError(state, queryString?.toString()),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchIfNeeded(queryString?.toString()))
        const { items: currentItems, ...currentState } = state
        const { items: prevItems, ...prevState } = result
        if (!shallowEqual(prevState, currentState)) setResult(state)
        else if (currentItems.length !== prevItems.length) setResult(state)
        else if (currentItems.some((item, key) => {
            return item !== model.utils.get(prevState.state, queryString?.toString())[key]
        })) setResult(state)
    })
    const { state: currentSate, ...other } = state
    return other
}

export function useGetExtended<
    Opts,
    RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string,
    Metadata
>(
    model: ComplexSearchRestModel<Opts, RealType, any, any, IdKey, any, Metadata>,
    opts: Opts,
    queryString?: string | URLSearchParams
): PropsFromItem<RealType, Metadata> {
    const { fetchIfNeeded } = model.actions
    type Result = PropsFromItem<RealType, Metadata> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Result>({ error: null, metadata: null, invalidated: true, loading: false, items: [], state: <any>{} })
    const { get, getMetadata, isFetching, isInvalidated, getError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<RealType, Metadata> & { state: ReducerNamespace.ReducerType } = {
            state,
            items: get(opts, state, queryString?.toString()),
            metadata: getMetadata(opts, state, queryString?.toString()),
            loading: isFetching(opts, state, queryString?.toString()),
            invalidated: isInvalidated(opts, state, queryString?.toString()),
            error: getError(opts, state, queryString?.toString()),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchIfNeeded(opts, queryString?.toString()))
        const { items: currentItems, ...currentState } = state
        const { items: prevItems, ...prevState } = result
        if (!shallowEqual(prevState, currentState)) setResult(state)
        else if (currentItems.length !== prevItems.length) setResult(state)
        else if (currentItems.some((item, key) => {
            return item !== model.utils.get(opts, prevState.state, queryString?.toString())[key]
        })) setResult(state)
    })
    const { state: currentSate, ...other } = state
    return other
}
