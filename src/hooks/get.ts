import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { HttpError } from '@rest-api/redux'
import { shallowEqual } from 'react-redux'
import { useDispatch, useSelector } from '../..'
import {BasicSearchRestModel} from '@rest-api/redux/src/restmodels/basic/BasicSearchRestModel'
import {ComplexSearchRestModel} from '@rest-api/redux/src/restmodels/ComplexSearchRestModel'
import {BasicRestModel} from '@rest-api/redux/src/restmodels/basic/BasicRestModel'
import { Schema } from '../DataTypes'

export type PropsFromItem<Item, MetaData> = {
    items: NonNullable<Item>[];
    loading: boolean;
    invalidated: boolean;
    error: HttpError | null;
    metadata: MetaData | null;
    redirect: () => void;
}



export default function useGet<
    S extends Schema<any, any, any>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<S['RealType']> & string,
    Metadata
>(
    model: BasicRestModel<S, IdKey, any, Metadata> | BasicSearchRestModel<S, IdKey, any, Metadata>,
    queryString?: string | URLSearchParams
): PropsFromItem<S["RealType"], Metadata> {
    type Result = PropsFromItem<S["RealType"], Metadata> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Omit<Result, 'redirect'>>({ error: null, metadata: null, invalidated: true, loading: false, items: [], state: {} })
    const dispatch = useDispatch()
    function redirect() {
        dispatch(model._actions.invalidate(queryString?.toString()))
    }
    const state = useSelector<ReducerNamespace.ReducerType, Omit<Result, 'redirect'>>(state => {
        const resultState: Omit<PropsFromItem<S["RealType"], Metadata>, 'redirect'> & { state: ReducerNamespace.ReducerType } = {
            state,
            items: model._utils.get(state, queryString?.toString()),
            metadata: model._utils.getMetadata(state, queryString?.toString()),
            loading: model._utils.isFetching(state, queryString?.toString()),
            invalidated: model._utils.isInvalidated(state, queryString?.toString()),
            error: model._utils.getError(state, queryString?.toString()),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(model._actions.fetchIfNeeded(queryString?.toString()))
        const { items: currentItems, ...currentState } = state
        const { items: prevItems, ...prevState } = result
        if (!shallowEqual(prevState, currentState)) setResult(state)
        else if (currentItems.length !== prevItems.length) setResult(state)
        else if (currentItems.some((item, key) => {
            return item !== model._utils.get(prevState.state, queryString?.toString())[key]
        })) setResult(state)
    })
    const { state: currentSate, ...other } = state
    return { ...other, redirect }
}

export function useGetExtended<
    Opts,
    S extends Schema<any>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<S["RealType"]> & string,
    Metadata
>(
    model: ComplexSearchRestModel<Opts, S, IdKey, any, Metadata>,
    opts: Opts,
    queryString?: string | URLSearchParams
): PropsFromItem<S["RealType"], Metadata> {
    type Result = PropsFromItem<S["RealType"], Metadata> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Omit<Result, 'redirect'>>({ error: null, metadata: null, invalidated: true, loading: false, items: [], state: {} })
    const dispatch = useDispatch()
    function redirect() {
        dispatch(model._actions.invalidate(opts, queryString?.toString()))
    }
    const state = useSelector<ReducerNamespace.ReducerType, Omit<Result, 'redirect'>>(state => {
        const resultState: Omit<PropsFromItem<S["RealType"], Metadata>, 'redirect'> & { state: ReducerNamespace.ReducerType } = {
            state,
            items: model._utils.get(opts, state, queryString?.toString()),
            metadata: model._utils.getMetadata(opts, state, queryString?.toString()),
            loading: model._utils.isFetching(opts, state, queryString?.toString()),
            invalidated: model._utils.isInvalidated(opts, state, queryString?.toString()),
            error: model._utils.getError(opts, state, queryString?.toString()),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(model._actions.fetchIfNeeded(opts, queryString?.toString()))
        const { items: currentItems, ...currentState } = state
        const { items: prevItems, ...prevState } = result
        if (!shallowEqual(prevState, currentState)) setResult(state)
        else if (currentItems.length !== prevItems.length) setResult(state)
        else if (currentItems.some((item, key) => {
            return item !== model._utils.get(opts, prevState.state, queryString?.toString())[key]
        })) setResult(state)
    })
    const { state: currentSate, ...other } = state
    return { ...other, redirect }
}
