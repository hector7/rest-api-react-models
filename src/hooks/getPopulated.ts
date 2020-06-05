import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model, HttpError } from '@rest-api/redux'
import { shallowEqual } from 'react-redux'
import { useDispatch, useSelector } from '../..'
import BasicSearchRestModel from '@rest-api/redux/src/restmodels/basic/BasicSearchRestModel'
import ComplexSearchRestModel from '@rest-api/redux/src/restmodels/ComplexSearchRestModel'

export type PropsFromItem<PartialItem, PopulatedItem, MetaData, Name extends string = 'items'> = {
    populated: true,
    invalidated: boolean;
    error: HttpError | null;
    loading: boolean;
    metadata: MetaData | null;
} & {
        [k in Name]: PopulatedItem[];
    } | {
        [k in Name]: PartialItem[];
    } & {
        loading: boolean;
        populated: false,
        invalidated: boolean;
        error: HttpError | null;
        metadata: MetaData | null;
    }



export default function useGetPopulated<
    RealType,
    PopulatedType,
    FullPopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Metadata>(
        model: Model<RealType, PopulatedType, FullPopulatedType, IdKey, any, Metadata> | BasicSearchRestModel<RealType, PopulatedType, FullPopulatedType, IdKey, any, Metadata>,
        queryString?: string | URLSearchParams
    ): PropsFromItem<PopulatedType, FullPopulatedType, Metadata> {
    const { fetchPopulatedIfNeeded } = model.actions
    type Result = PropsFromItem<PopulatedType, FullPopulatedType, Metadata> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Result>({ error: null, metadata: null, populated: false, invalidated: true, loading: false, items: [], state: <any>{} })
    const { getPopulated, getMetadata, isFetching, isPopulated, isInvalidated, getError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<PopulatedType, FullPopulatedType, Metadata> & { state: ReducerNamespace.ReducerType } = {
            state,
            populated: isPopulated(state, queryString?.toString()),
            items: getPopulated(state, queryString?.toString()) as any,
            loading: isFetching(state, queryString?.toString()),
            metadata: getMetadata(state, queryString?.toString()),
            invalidated: isInvalidated(state, queryString?.toString()),
            error: getError(state, queryString?.toString()),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchPopulatedIfNeeded(queryString?.toString()))
        const { items: currentItems, ...currentState } = state
        const { items: prevItems, ...prevState } = result
        if (!shallowEqual(prevState, currentState)) setResult(state)
        else if (currentItems.length !== prevItems.length) setResult(state)
        else if (model.utils.get(currentState.state, queryString?.toString()).some(item => {
            let count = 0
            model.model.schema._getModelValuesToPopulate(item, (model, id) => {
                if (model.utils.getById(currentState.state, id) !== model.utils.getById(prevState.state, id)) count++
            })
            return count > 0
        })) setResult(state)
    })
    const { state: currentSate, ...other } = state
    return other
}


export function useGetPopulatedExtended<
    Opts,
    RealType,
    PopulatedType,
    FullPopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Metadata>(
        model: ComplexSearchRestModel<Opts, RealType, PopulatedType, FullPopulatedType, IdKey, any, Metadata>,
        opts: Opts,
        queryString?: string | URLSearchParams
    ): PropsFromItem<PopulatedType, FullPopulatedType, Metadata> {
    const { fetchPopulatedIfNeeded } = model.actions
    type Result = PropsFromItem<PopulatedType, FullPopulatedType, Metadata> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Result>({ error: null, metadata: null, populated: false, invalidated: true, loading: false, items: [], state: <any>{} })
    const { getPopulated, getMetadata, isFetching, isPopulated, isInvalidated, getError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<PopulatedType, FullPopulatedType, Metadata> & { state: ReducerNamespace.ReducerType } = {
            state,
            populated: isPopulated(opts, state, queryString?.toString()),
            items: getPopulated(opts, state, queryString?.toString()) as any,
            loading: isFetching(opts, state, queryString?.toString()),
            metadata: getMetadata(opts, state, queryString?.toString()),
            invalidated: isInvalidated(opts, state, queryString?.toString()),
            error: getError(opts, state, queryString?.toString()),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchPopulatedIfNeeded(opts, queryString?.toString()))
        const { items: currentItems, ...currentState } = state
        const { items: prevItems, ...prevState } = result
        if (!shallowEqual(prevState, currentState)) setResult(state)
        else if (currentItems.length !== prevItems.length) setResult(state)
        else if (model.utils.get(opts, currentState.state, queryString?.toString()).some(item => {
            let count = 0
            model.model.schema._getModelValuesToPopulate(item, (model, id) => {
                if (model.utils.getById(currentState.state, id) !== model.utils.getById(prevState.state, id)) count++
            })
            return count > 0
        })) setResult(state)
    })
    const { state: currentSate, ...other } = state
    return other
}

