import React from 'react'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model, HttpError, Callback } from '@rest-api/redux'
import { InferableComponentEnhancerWithProps, GetProps } from 'react-redux'
import { useDispatch } from '..'

export namespace Modificators {
    export type PropsFromItem<Item, IdKey extends keyof Item> = {
        post: (item: Omit<Item, IdKey> | FormData, callback: Callback<Item, HttpError>) => any,
        patch: (id: Item[IdKey], item: Partial<Item> | FormData, callback: Callback<Item, HttpError>) => any,
        put: (id: Item[IdKey], item: Item | FormData, callback: Callback<Item, HttpError>) => any,
        remove: (item: Item, callback: Callback<undefined, HttpError>) => any,
        invalidate: (queryString: string) => any,
        invalidateAll: () => any
    }
}



export function useModificators<
    RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string,
    Metadata>(
        model: Model<RealType, any, IdKey, any, {}, Metadata>,
): Modificators.PropsFromItem<RealType, IdKey> {
    const { post, put, patch, delete: remove, invalidate, invalidateAll } = model.actions
    const dispatch = useDispatch()
    return {
        invalidate: (...args) => dispatch(invalidate(...args)),
        invalidateAll: (...args) => dispatch(invalidateAll(...args)),
        patch: (...args) => dispatch(patch(...args)),
        post: (...args) => dispatch(post(...args)),
        put: (...args) => dispatch(put(...args)),
        remove: (...args) => dispatch(remove(...args)),
    }
}


export default function connectModificators<RealType, IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string, Metadata>(
    model: Model<RealType, any, IdKey, any, {}, Metadata>,
): InferableComponentEnhancerWithProps<Modificators.PropsFromItem<RealType, IdKey>, {}> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent>> = (props) => {
            const result = useModificators(model)
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}