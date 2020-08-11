import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { HttpError } from '@rest-api/redux'
import { shallowEqual } from 'react-redux'
import { useDispatch, useSelector } from '../..'
import { BasicSearchRestModel } from '@rest-api/redux/src/restmodels/basic/BasicSearchRestModel'
import { ComplexSearchRestModel } from '@rest-api/redux/src/restmodels/ComplexSearchRestModel'
import { BasicRestModel } from '@rest-api/redux/src/restmodels/basic/BasicRestModel'
import { Schema } from '../DataTypes'


export type PropsFromItem<PartialItem, PopulatedItem, MetaData> = {
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


export default function useGetPopulated<
    S extends Schema<any>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<S["RealType"]> & SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string,
    Metadata>(
        model: BasicRestModel<S, IdKey, any, Metadata> | BasicSearchRestModel<S, IdKey, any, Metadata>,
        queryString?: string | URLSearchParams
    ): PropsFromItem<S["PopulatedType"], S["FullPopulatedType"], Metadata> {
    type Result = PropsFromItem<S["PopulatedType"], S["FullPopulatedType"], Metadata> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Result>({ error: null, initialized: false, metadata: null, populated: false, invalidated: true, loading: false, items: [], state: {} })
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<S["PopulatedType"], S["FullPopulatedType"], Metadata> & { state: ReducerNamespace.ReducerType } = {
            state,
            populated: model._utils.isPopulated(state, queryString?.toString()),
            items: model._utils.getPopulated(state, queryString?.toString()),
            initialized: model._utils.isInitialized(state, queryString?.toString()),
            loading: model._utils.isFetching(state, queryString?.toString()),
            metadata: model._utils.getMetadata(state, queryString?.toString()),
            invalidated: model._utils.isInvalidated(state, queryString?.toString()),
            error: model._utils.getError(state, queryString?.toString()),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(model._actions.fetchPopulatedIfNeeded(queryString?.toString()))
        const { items: currentItems, ...currentState } = state
        const { items: prevItems, ...prevState } = result
        if (!shallowEqual(prevState, currentState)) setResult(state)
        else if (currentItems.length !== prevItems.length) setResult(state)
        else if (model._utils.get(currentState.state, queryString?.toString()).some(item => {
            let count = 0
            model.model.schema._getModelValuesToPopulate(item, (model, id) => {
                if (model._utils.getById(currentState.state, id) !== model._utils.getById(prevState.state, id)) count++
            })
            return count > 0
        })) setResult(state)
    })
    const { state: currentSate, ...other } = state
    return other
}


export function useGetPopulatedExtended<
    Opts,
    S extends Schema<any>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<S["RealType"]> & SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string,
    Metadata>(
        model: ComplexSearchRestModel<Opts, S, IdKey, any, Metadata>,
        opts: Opts,
        queryString?: string | URLSearchParams
    ): PropsFromItem<S["PopulatedType"], S["FullPopulatedType"], Metadata> {
    type Result = PropsFromItem<S["PopulatedType"], S["FullPopulatedType"], Metadata> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Result>({ error: null, initialized: false, metadata: null, populated: false, invalidated: true, loading: false, items: [], state: {} })
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<S["PopulatedType"], S["FullPopulatedType"], Metadata> & { state: ReducerNamespace.ReducerType } = {
            state,
            populated: model._utils.isPopulated(opts, state, queryString?.toString()),
            initialized: model._utils.isInitialized(opts, state, queryString?.toString()),
            items: model._utils.getPopulated(opts, state, queryString?.toString()),
            loading: model._utils.isFetching(opts, state, queryString?.toString()),
            metadata: model._utils.getMetadata(opts, state, queryString?.toString()),
            invalidated: model._utils.isInvalidated(opts, state, queryString?.toString()),
            error: model._utils.getError(opts, state, queryString?.toString()),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(model._actions.fetchPopulatedIfNeeded(opts, queryString?.toString()))
        const { items: currentItems, ...currentState } = state
        const { items: prevItems, ...prevState } = result
        if (!shallowEqual(prevState, currentState)) setResult(state)
        else if (currentItems.length !== prevItems.length) setResult(state)
        else if (model._utils.get(opts, currentState.state, queryString?.toString()).some(item => {
            let count = 0
            model.model.schema._getModelValuesToPopulate(item, (model, id) => {
                if (model._utils.getById(currentState.state, id) !== model._utils.getById(prevState.state, id)) count++
            })
            return count > 0
        })) setResult(state)
    })
    const { state: currentSate, ...other } = state
    return other
}

