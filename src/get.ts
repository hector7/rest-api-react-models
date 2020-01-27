import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model, HttpError } from '@rest-api/redux'
import { InferableComponentEnhancerWithProps, shallowEqual, GetProps } from 'react-redux'
import { useDispatch, useSelector } from '..'

export namespace Get {
    export type PromsFromItem<Item, Name extends string = 'items'> = {
        [k in Name]: NonNullable<Item>[];
    } & {
        loading: boolean;
        invalidated: boolean;
        error: HttpError | null;
    }
}



export function useGet<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.RealType<ItemType>, Metadata>(
    model: Model<ItemType, Item, any, any, any, {}, Metadata>,
    queryString?: string
): Get.PromsFromItem<Item> {
    const { fetchIfNeeded } = model.actions
    type Result = Get.PromsFromItem<Item> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Result>({ error: null, invalidated: true, loading: false, items: [], state: <any>{} })
    const { get, isFetching, isInvalidated, getError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: Get.PromsFromItem<Item> & { state: ReducerNamespace.ReducerType } = {
            state,
            items: get(state, queryString),
            loading: isFetching(state, queryString),
            invalidated: isInvalidated(state, queryString),
            error: getError(state, queryString),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchIfNeeded(queryString))
        const { items: currentItems, ...currentState } = state
        const { items: prevItems, ...prevState } = result
        if (!shallowEqual(prevState, currentState)) setResult(state)
        else if (currentItems.length !== prevItems.length) setResult(state)
        else if (currentItems.some((item, key) => {
            return item !== model.utils.get(prevState.state, queryString)[key]
        })) setResult(state)
    })
    const { state: currentSate, ...other } = state
    return other
}


function useGetBasic<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.RealType<ItemType>, Metadata>(
    model: Model<ItemType, Item, any, any, any, {}, Metadata>,
): InferableComponentEnhancerWithProps<Get.PromsFromItem<Item>, { queryString?: string }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            queryString?: string
        }
        > = (props) => {
            const result = useGet(model, props.queryString)
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}
function useGetExtended<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.RealType<ItemType>, Metadata, Name extends string>(
    model: Model<ItemType, Item, any, any, any, {}, Metadata>,
    name: Name
): InferableComponentEnhancerWithProps<Get.PromsFromItem<Item, Name>, { queryString?: string }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            queryString?: string
        }
        > = (props) => {
            const { items, ...otherPropsOfResult } = useGet(model, props.queryString)
            const result: Get.PromsFromItem<Item, Name> = <any>{
                ...otherPropsOfResult,
                [name]: items,

            }
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}


export default function connectGet<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.RealType<ItemType>, Metadata>(
    model: Model<ItemType, Item, any, any, any, {}, Metadata>,
): InferableComponentEnhancerWithProps<Get.PromsFromItem<Item>, { queryString?: string }>
export default function connectGet<ItemType extends SchemaNamespace.Item, Item extends SchemaNamespace.RealType<ItemType>, Metadata, Name extends string>(
    mmodel: Model<ItemType, Item, any, any, any, {}, Metadata>,
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