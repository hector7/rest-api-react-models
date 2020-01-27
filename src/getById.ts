import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model, HttpError } from '@rest-api/redux'
import { InferableComponentEnhancerWithProps, shallowEqual, GetProps } from 'react-redux'
import { useDispatch, useSelector } from '..'

export namespace GetById {
    export type PromsFromItem<Item, Name extends string = 'item'> = {
        [k in Name]: Item | null;
    } & {
        loading: boolean;
        invalidated: boolean;
        error: HttpError | null;
    }
}



export function useGetById<ItemType extends SchemaNamespace.Item,
    Item extends SchemaNamespace.RealType<ItemType>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<Item> & string>(
        model: Model<ItemType, Item, any, IdKey, any, {}, any>,
        id: Item[IdKey]
    ): GetById.PromsFromItem<Item> {
    const { fetchByIdIfNeeded } = model.actions
    type Result = GetById.PromsFromItem<Item>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, invalidated: true, loading: false, [name]: null })
    const { getById, isFetchingById, isInvalidatedById, getErrorById } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: GetById.PromsFromItem<Item> = {
            item: getById(state, id),
            loading: isFetchingById(state, id),
            invalidated: isInvalidatedById(state, id),
            error: getErrorById(state, id),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchByIdIfNeeded(id))
        if (!shallowEqual(state, result)) setResult(state)
    })
    return state
}


function useGetBasic<ItemType extends SchemaNamespace.Item,
    Item extends SchemaNamespace.RealType<ItemType>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<Item> & string>(
        model: Model<ItemType, Item, any, IdKey, any, {}, any>,
): InferableComponentEnhancerWithProps<GetById.PromsFromItem<Item>, { id: Item[IdKey] }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            id: Item[IdKey]
        }
        > = (props) => {
            const result = useGetById(model, props.id)
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}
function useGetExtended<ItemType extends SchemaNamespace.Item,
    Item extends SchemaNamespace.RealType<ItemType>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<Item> & string, Name extends string>(
        model: Model<ItemType, Item, any, IdKey, any, {}, {}, any>,
        name: Name
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<Item, Name>, { id: Item[IdKey] }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            id: Item[IdKey]
        }
        > = (props) => {
            const { item, ...otherPropsOfResult } = useGetById(model, props.id)
            const result: GetById.PromsFromItem<Item, Name> = <any>{
                ...otherPropsOfResult,
                [name]: item,

            }
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}

function useGetExtendedRenamed<ItemType extends SchemaNamespace.Item,
    Item extends SchemaNamespace.RealType<ItemType>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<Item> & string,
    Name extends string, idPropName extends string>(
        model: Model<ItemType, Item, any, IdKey, any, {}, {}, any>,
        name: Name,
        idPropName: idPropName
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<Item, Name>, Record<idPropName, Item[IdKey]>> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & Record<idPropName, Item[IdKey]>> = (props) => {
            const { item, ...otherPropsOfResult } = useGetById(model, <any>props[idPropName])
            const result: GetById.PromsFromItem<Item, Name> = <any>{
                ...otherPropsOfResult,
                [name]: item,

            }
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}

export default function connectGetById<ItemType extends SchemaNamespace.Item,
    Item extends SchemaNamespace.RealType<ItemType>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<Item> & string>(
        model: Model<ItemType, Item, any, IdKey, any, any, any, any>,
): InferableComponentEnhancerWithProps<GetById.PromsFromItem<Item>, { id: Item[IdKey] }>
export default function connectGetById<ItemType extends SchemaNamespace.Item,
    Item extends SchemaNamespace.RealType<ItemType>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<Item> & string,
    Name extends string>(
        model: Model<ItemType, Item, any, IdKey, any, any, any, any>,
        propertyName: Name
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<Item, Name>, { id: Item[IdKey] }>;
export default function connectGetById<ItemType extends SchemaNamespace.Item,
    Item extends SchemaNamespace.RealType<ItemType>,
    IdKey extends SchemaNamespace.StringOrNumberKeys<Item> & string,
    Name extends string, idPropName extends string>(
        model: Model<ItemType, Item, any, IdKey, any, any, any, any>,
        propertyName: Name,
        idPropName: idPropName
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<Item, Name>, Record<idPropName, Item[IdKey]>>;
export default function connectGetById(
    model: Model<any, any, any, any, any, any, any>,
    name?: string,
    idPropName?: string
): InferableComponentEnhancerWithProps<GetById.PromsFromItem<any, any>, any> {
    if (name !== undefined && idPropName !== undefined) {
        return useGetExtendedRenamed(model, name, idPropName)
    }
    if (name) {
        return useGetExtended(model, name)
    }
    return useGetBasic(model)
}