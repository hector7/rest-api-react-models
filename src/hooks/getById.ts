import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model, HttpError } from '@rest-api/redux'
import { shallowEqual } from 'react-redux'
import { useDispatch, useSelector } from '../..'
import BasicIdRestModel from '@rest-api/redux/src/restmodels/basic/BasicIdRestModel'
import ComplexIdRestModel from '@rest-api/redux/src/restmodels/ComplexIdRestModel'

export type PropsFromItem<Item> = {
    item: Item | null;
    loading: boolean;
    invalidated: boolean;
    error: HttpError | null;
}


export default function useGetById<RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string>(
        model: Model<RealType, any, any, IdKey, any, any> | BasicIdRestModel<RealType, any, any, IdKey>,
        id: RealType[IdKey]
    ): PropsFromItem<RealType> {
    const { fetchByIdIfNeeded } = model.actions
    type Result = PropsFromItem<RealType>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, invalidated: true, loading: false, [name]: null })
    const { getById, isIdFetching, isIdInvalidated, getIdError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<RealType> = {
            item: getById(state, id),
            loading: isIdFetching(state, id),
            invalidated: isIdInvalidated(state, id),
            error: getIdError(state, id),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchByIdIfNeeded(id))
        if (!shallowEqual(state, result)) setResult(state)
    })
    return state
}

export function useGetByIdExtended<
    Opts,
    RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string>(
        model: ComplexIdRestModel<Opts, RealType, any, any, IdKey>,
        opts: Opts,
        id: RealType[IdKey]
    ): PropsFromItem<RealType> {
    const { fetchByIdIfNeeded } = model.actions
    type Result = PropsFromItem<RealType>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, invalidated: true, loading: false, [name]: null })
    const { getById, isIdFetching, isIdInvalidated, getIdError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<RealType> = {
            item: getById(state, opts, id),
            loading: isIdFetching(state, opts, id),
            invalidated: isIdInvalidated(state, opts, id),
            error: getIdError(state, opts, id),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchByIdIfNeeded(opts, id))
        if (!shallowEqual(state, result)) setResult(state)
    })
    return state
}
