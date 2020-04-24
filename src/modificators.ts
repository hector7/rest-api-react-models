import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model, HttpError, Callback } from '@rest-api/redux'
import { InferableComponentEnhancerWithProps, shallowEqual, GetProps } from 'react-redux'
import { useDispatch, useSelector } from '..'

export namespace Modificators {
    export type PromsFromItem<Item> = {
        post: (item: Partial<Item>, callback: Callback<Item, HttpError>) => any,
        patch: (id: Item[any], item: Partial<Item>, callback: Callback<Item, HttpError>) => any,
        put: (id: Item[any], item: Item, callback: Callback<Item, HttpError>) => any,
        remove: (item: Item, callback: Callback<undefined, HttpError>) => any,
        invalidate: (queryString: string) => any,
        invalidateAll: () => any
    }
}



export function useModificators<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.RealType<ItemType>, Metadata>(
    model: Model<ItemType, Item, any, any, any, {}, Metadata>,
): Modificators.PromsFromItem<Item> {
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


export default function connectModificators<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.RealType<ItemType>, Metadata>(
    model: Model<ItemType, Item, any, any, any, {}, Metadata>,
): InferableComponentEnhancerWithProps<Modificators.PromsFromItem<Item>, {}> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent>> = (props) => {
            const result = useModificators(model)
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}