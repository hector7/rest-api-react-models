import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model, HttpError } from '@rest-api/redux'
import { InferableComponentEnhancerWithProps, shallowEqual, GetProps } from 'react-redux'
import { useDispatch, useSelector } from '..'

export namespace Get {
    export type PromsFromItem<Item, Name extends string = 'items'> = {
        [k in Name]: Item[];
    } & {
        loading: boolean;
        invalidated: boolean;
        error: HttpError | null;
    }
}



export function useGetPopulated<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.Type<ItemType>, Metadata>(
    model: Model<ItemType, any, Item, any, any, {}, Metadata>,
    queryString?: string
) {
    const { fetchPopulatedIfNeeded } = model.actions
    type Result = Get.PromsFromItem<Item>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, invalidated: true, loading: false, [name]: null })
    const { getPopulated, isFetching, isInvalidated, getError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: Get.PromsFromItem<Item> = {
            items: getPopulated(state, queryString),
            loading: isFetching(state, queryString),
            invalidated: isInvalidated(state, queryString),
            error: getError(state, queryString),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchPopulatedIfNeeded(queryString))
        if (!shallowEqual(state, result)) setResult(state)
    })
    return state
}


function useGetBasic<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.Type<ItemType>, Metadata>(
    model: Model<ItemType, any, Item, any, any, {}, Metadata>,
): InferableComponentEnhancerWithProps<Get.PromsFromItem<Item>, { queryString?: string }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            queryString?: string
        }
        > = (props) => {
            const result = useGetPopulated(model, props.queryString)
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}
function useGetExtended<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.Type<ItemType>, Metadata, Name extends string>(
    model: Model<ItemType, any, Item, any, any, {}, Metadata>,
    name: Name
): InferableComponentEnhancerWithProps<Get.PromsFromItem<Item, Name>, { queryString?: string }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            queryString?: string
        }
        > = (props) => {
            const { items, ...otherPropsOfResult } = useGetPopulated(model, props.queryString)
            const result: Get.PromsFromItem<Item, Name> = <any>{
                ...otherPropsOfResult,
                [name]: items,

            }
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}


export default function connectGet<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.Type<ItemType>, Metadata>(
    model: Model<ItemType, any, Item, any, any, {}, Metadata>,
): InferableComponentEnhancerWithProps<Get.PromsFromItem<Item>, { queryString?: string }>
export default function connectGet<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.Type<ItemType>, Metadata, Name extends string>(
    mmodel: Model<ItemType, any, Item, any, any, {}, Metadata>,
    name: Name
): InferableComponentEnhancerWithProps<Get.PromsFromItem<Item, Name>, { queryString?: string }>
export default function connectGet<Name extends string = 'items'>(
    model: any,
    name?: Name
) {
    {
        if (name) {
            return useGetExtended(model, name)
        }
        return useGetBasic(model)
    }
}