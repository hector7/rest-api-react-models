import React from 'react'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { HttpError, Callback } from '@rest-api/redux'
import { useDispatch } from '../..'
import { BasicRestModel } from '@rest-api/redux/src/restmodels/basic/BasicRestModel'

export type PropsFromItem<Item, IdKey extends keyof Item> = {
    post: (item: Omit<Item, IdKey> | FormData, callback: Callback<Item, HttpError>) => any,
    patch: (id: Item[IdKey], item: Partial<Item> | FormData, callback: Callback<Item, HttpError>) => any,
    put: (id: Item[IdKey], item: Item | FormData, callback: Callback<Item, HttpError>) => any,
    remove: (item: Item, callback: Callback<undefined, HttpError>) => any,
    invalidate: (queryString: string | URLSearchParams) => any,
    invalidateById: (id: Item[IdKey]) => any,
    invalidateAll: () => any
}



export default function useModificators<
    RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string,
    Metadata>(
        model: BasicRestModel<RealType, any, any, IdKey, any, Metadata>,
): PropsFromItem<RealType, IdKey> {
    const { post, put, patch, delete: remove, invalidate, invalidateById, invalidateAll } = model._actions
    const dispatch = useDispatch()
    return {
        invalidate: (...args) => dispatch(invalidate(args[0]?.toString())),
        invalidateById: (...args) => dispatch(invalidateById(...args)),
        invalidateAll: (...args) => dispatch(invalidateAll(...args)),
        patch: (...args) => dispatch(patch(...args)),
        post: (...args) => dispatch(post(...args)),
        put: (...args) => dispatch(put(...args)),
        remove: (...args) => dispatch(remove(...args)),
    }
}

