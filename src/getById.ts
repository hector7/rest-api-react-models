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



export function useGetById<RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string>(
        model: Model<RealType, any, any, IdKey, any, any>,
        id: RealType[IdKey]
    ): GetById.PromsFromItem<RealType> {
    const { fetchByIdIfNeeded } = model.actions
    type Result = GetById.PromsFromItem<RealType>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, invalidated: true, loading: false, [name]: null })
    const { getById, isIdFetching, isIdInvalidated, getIdError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: GetById.PromsFromItem<RealType> = {
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


function useGetBasic<RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string>(
        model: Model<RealType, any, IdKey, any, {}, any>,
): InferableComponentEnhancerWithProps<GetById.PromsFromItem<RealType>, { id: RealType[IdKey] }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            id: RealType[IdKey]
        }
        > = (props) => {
            const result = useGetById(model, props.id)
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}
function useGetExtended<RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string, Name extends string>(
        model: Model<RealType, any, any, IdKey, any, any>,
        name: Name
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<RealType, Name>, { id: RealType[IdKey] }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            id: RealType[IdKey]
        }
        > = (props) => {
            const { item, ...otherPropsOfResult } = useGetById(model, props.id)
            const result: GetById.PromsFromItem<RealType, Name> = <any>{
                ...otherPropsOfResult,
                [name]: item,

            }
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}

function useGetExtendedRenamed<RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string,
    Name extends string, idPropName extends string>(
        model: Model<RealType, any, any,  IdKey, any, any>,
        name: Name,
        idPropName: idPropName
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<RealType, Name>, Record<idPropName, RealType[IdKey]>> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & Record<idPropName, RealType[IdKey]>> = (props) => {
            const { item, ...otherPropsOfResult } = useGetById(model, <any>props[idPropName])
            const result: GetById.PromsFromItem<RealType, Name> = <any>{
                ...otherPropsOfResult,
                [name]: item,

            }
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}

export default function connectGetById<RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string>(
        model: Model<RealType, any, any, IdKey, any, any>,
): InferableComponentEnhancerWithProps<GetById.PromsFromItem<RealType>, { id: RealType[IdKey] }>
export default function connectGetById<RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string,
    Name extends string>(
        model: Model<RealType, any, any, IdKey, any, any>,
        propertyName: Name
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<RealType, Name>, { id: RealType[IdKey] }>;
export default function connectGetById<RealType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & string,
    Name extends string, idPropName extends string>(
        model: Model<RealType, any, any, IdKey, any, any>,
        propertyName: Name,
        idPropName: idPropName
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<RealType, Name>, Record<idPropName, RealType[IdKey]>>;
export default function connectGetById(
    model: Model<any, any, any, any, any, any>,
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