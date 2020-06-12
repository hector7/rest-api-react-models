import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { HttpError } from '@rest-api/redux'
import { shallowEqual } from 'react-redux'
import { useDispatch, useSelector } from '../..'
import { BasicIdRestModel } from '@rest-api/redux/src/restmodels/basic/BasicIdRestModel'
import { ComplexIdRestModel } from '@rest-api/redux/src/restmodels/ComplexIdRestModel'
import { BasicRestModel } from '@rest-api/redux/src/restmodels/basic/BasicRestModel'

export type PropsFromItem<Item> = {
    item: Item | null;
    loading: boolean;
    invalidated: boolean;
    error: HttpError | null;
}


export default function useGetById<RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string>(
        model: BasicRestModel<RealType, any, any, IdKey, any, any> | BasicIdRestModel<RealType, any, any, IdKey>,
        id: RealType[IdKey]
    ): PropsFromItem<RealType> {
    type Result = PropsFromItem<RealType>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, invalidated: true, loading: false, [name]: null })
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<RealType> = {
            item: model._utils.getById(state, id),
            loading: model._utils.isIdFetching(state, id),
            invalidated: model._utils.isIdInvalidated(state, id),
            error: model._utils.getIdError(state, id),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(model._actions.fetchByIdIfNeeded(id))
        if (!shallowEqual(state, result)) setResult(state)
    })
    return result
}

export function useGetByIdExtended<
    Opts,
    RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string>(
        model: ComplexIdRestModel<Opts, RealType, any, any, IdKey>,
        opts: Opts,
        id: RealType[IdKey]
    ): PropsFromItem<RealType> {
    type Result = PropsFromItem<RealType>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, invalidated: true, loading: false, [name]: null })
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: PropsFromItem<RealType> = {
            item: model._utils.getById(state, opts, id),
            loading: model._utils.isIdFetching(state, opts, id),
            invalidated: model._utils.isIdInvalidated(state, opts, id),
            error: model._utils.getIdError(state, opts, id),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(model._actions.fetchByIdIfNeeded(opts, id))
        if (!shallowEqual(state, result)) setResult(state)
    })
    return result
}
