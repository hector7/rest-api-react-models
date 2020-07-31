import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { HttpError } from '@rest-api/redux'
import { shallowEqual } from 'react-redux'
import { useDispatch, useSelector } from '../..'
import { BasicIdRestModel } from '@rest-api/redux/src/restmodels/basic/BasicIdRestModel'
import { ComplexIdRestModel } from '@rest-api/redux/src/restmodels/ComplexIdRestModel'
import { BasicRestModel } from '@rest-api/redux/src/restmodels/basic/BasicRestModel'
import { Schema } from '../DataTypes'

export type PropsFromItem<PartialItem, PopulatedItem> = {
    populated: true,
    invalidated: boolean;
    error: HttpError | null;
    loading: boolean;
    item: PopulatedItem;
} | {
    item: PartialItem | null;
    loading: boolean;
    populated: false,
    invalidated: boolean;
    error: HttpError | null;
}



export default function useGetByIdPopulated<S extends Schema<any>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string>(
        model: BasicRestModel<S, IdKey, any, any> | BasicIdRestModel<S, IdKey>,
        id: S["PopulatedType"][IdKey]
    ): PropsFromItem<S["PopulatedType"], S["FullPopulatedType"]> {
    type Result = PropsFromItem<S["PopulatedType"], S["FullPopulatedType"]>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, populated: false, invalidated: true, loading: false, [name]: null })
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<S["PopulatedType"], S["FullPopulatedType"]> = {
            item: model._utils.getByIdPopulated(state, id) as any,
            loading: model._utils.isIdFetching(state, id),
            populated: model._utils.isIdPopulated(state, id),
            invalidated: model._utils.isIdInvalidated(state, id),
            error: model._utils.getIdError(state, id),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(model._actions.fetchByIdPopulatedIfNeeded(id))
        const { item: newItem, ...newOthers } = state
        const { item, ...others } = result
        if (!shallowEqual(newOthers, others) || (newItem && !item) || state.populated !== result.populated) {
            setResult(state)
        }
    })
    return result
}


export function useGetByIdPopulatedExtended<
    Opts,
    S extends Schema<any>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<S["PopulatedType"]> & string>(
        model: ComplexIdRestModel<Opts, S, IdKey>,
        opts: Opts,
        id: S["PopulatedType"][IdKey]
    ): PropsFromItem<S["PopulatedType"], S["FullPopulatedType"]> {
    type Result = PropsFromItem<S["PopulatedType"], S["FullPopulatedType"]>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, populated: false, invalidated: true, loading: false, [name]: null })
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<S["PopulatedType"], S["FullPopulatedType"]> = {
            item: model._utils.getByIdPopulated(state, opts, id) as any,
            loading: model._utils.isIdFetching(state, opts, id),
            populated: model._utils.isIdPopulated(state, opts, id),
            invalidated: model._utils.isIdInvalidated(state, opts, id),
            error: model._utils.getIdError(state, opts, id),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(model._actions.fetchByIdPopulatedIfNeeded(opts, id))
        const { item: newItem, ...newOthers } = state
        const { item, ...others } = state
        if (!shallowEqual(newOthers, others) || (newItem && !item) || state.populated !== result.populated) {
            setResult(state)
        }
    })
    return result
}

