import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model, HttpError } from '@rest-api/redux'
import { shallowEqual } from 'react-redux'
import { useDispatch, useSelector } from '../..'
import BasicSearchRestModel from '@rest-api/redux/src/restmodels/basic/BasicSearchRestModel'
import ComplexSearchRestModel from '@rest-api/redux/src/restmodels/ComplexSearchRestModel'

export type PropsFromItem<PartialItem, PopulatedItem, MetaData> = {
    populated: true,
    invalidated: boolean;
    error: HttpError | null;
    loading: boolean;
    metadata: MetaData | null;
    items: PopulatedItem[];
} |
{
    loading: boolean;
    populated: false,
    invalidated: boolean;
    error: HttpError | null;
    metadata: MetaData | null;
    items: PartialItem[];
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
    type Result = PropsFromItem<PopulatedType, FullPopulatedType, Metadata> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Result>({ error: null, metadata: null, populated: false, invalidated: true, loading: false, items: [], state: <any>{} })
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<PopulatedType, FullPopulatedType, Metadata> & { state: ReducerNamespace.ReducerType } = {
            state,
            populated: model.utils.isPopulated(state, queryString?.toString()),
            items: model.utils.getPopulated(state, queryString?.toString()) as any,
            loading: model.utils.isFetching(state, queryString?.toString()),
            metadata: model.utils.getMetadata(state, queryString?.toString()),
            invalidated: model.utils.isInvalidated(state, queryString?.toString()),
            error: model.utils.getError(state, queryString?.toString()),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(model.actions.fetchPopulatedIfNeeded(queryString?.toString()))
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
    type Result = PropsFromItem<PopulatedType, FullPopulatedType, Metadata> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Result>({ error: null, metadata: null, populated: false, invalidated: true, loading: false, items: [], state: <any>{} })
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<PopulatedType, FullPopulatedType, Metadata> & { state: ReducerNamespace.ReducerType } = {
            state,
            populated: model.utils.isPopulated(opts, state, queryString?.toString()),
            items: model.utils.getPopulated(opts, state, queryString?.toString()) as any,
            loading: model.utils.isFetching(opts, state, queryString?.toString()),
            metadata: model.utils.getMetadata(opts, state, queryString?.toString()),
            invalidated: model.utils.isInvalidated(opts, state, queryString?.toString()),
            error: model.utils.getError(opts, state, queryString?.toString()),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(model.actions.fetchPopulatedIfNeeded(opts, queryString?.toString()))
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

