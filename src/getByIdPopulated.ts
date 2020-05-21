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



export function useGetByIdPopulated<PopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string>(
        model: Model<any, PopulatedType, any, IdKey, any, any>,
        id: PopulatedType[IdKey]
    ): GetById.PromsFromItem<PopulatedType> {
    const { fetchByIdPopulatedIfNeeded } = model.actions
    type Result = GetById.PromsFromItem<PopulatedType>
    const [result, setResult] = React.useState<Result>(<any>{ error: null, invalidated: true, loading: false, [name]: null })
    const { getByIdPopulated, isIdFetching, isIdInvalidated, getIdError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: GetById.PromsFromItem<PopulatedType> = {
            item: getByIdPopulated(state, id),
            loading: isIdFetching(state, id),
            invalidated: isIdInvalidated(state, id),
            error: getIdError(state, id),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchByIdPopulatedIfNeeded(id))
        if (!shallowEqual(state, result)) setResult(state)
    })
    return state
}


function useGetBasic<PopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string>(
        model: Model<any, PopulatedType, IdKey, any, {}, any>,
): InferableComponentEnhancerWithProps<GetById.PromsFromItem<PopulatedType>, { id: PopulatedType[IdKey] }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            id: PopulatedType[IdKey]
        }
        > = (props) => {
            const result = useGetByIdPopulated(model, props.id)
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}
function useGetExtended<PopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string, Name extends string>(
        model: Model<any, PopulatedType, any, IdKey, any, any>,
        name: Name
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<PopulatedType, Name>, { id: PopulatedType[IdKey] }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            id: PopulatedType[IdKey]
        }
        > = (props) => {
            const { item, ...otherPropsOfResult } = useGetByIdPopulated(model, props.id)
            const result: GetById.PromsFromItem<PopulatedType, Name> = <any>{
                ...otherPropsOfResult,
                [name]: item,

            }
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}

function useGetExtendedRenamed<PopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Name extends string, idPropName extends string>(
        model: Model<any, PopulatedType, any, IdKey, any, any>,
        name: Name,
        idPropName: idPropName
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<PopulatedType, Name>, Record<idPropName, PopulatedType[IdKey]>> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & Record<idPropName, PopulatedType[IdKey]>> = (props) => {
            const { item, ...otherPropsOfResult } = useGetByIdPopulated(model, <any>props[idPropName])
            const result: GetById.PromsFromItem<PopulatedType, Name> = <any>{
                ...otherPropsOfResult,
                [name]: item,

            }
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}

export default function connectGetById<PopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string>(
        model: Model<any, PopulatedType, any, IdKey, any, any>,
): InferableComponentEnhancerWithProps<GetById.PromsFromItem<PopulatedType>, { id: PopulatedType[IdKey] }>
export default function connectGetById<PopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Name extends string>(
        model: Model<any, PopulatedType, any, IdKey, any, any>,
        propertyName: Name
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<PopulatedType, Name>, { id: PopulatedType[IdKey] }>;
export default function connectGetById<PopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Name extends string, idPropName extends string>(
        model: Model<any, PopulatedType, any, IdKey, any, any>,
        propertyName: Name,
        idPropName: idPropName
    ): InferableComponentEnhancerWithProps<GetById.PromsFromItem<PopulatedType, Name>, Record<idPropName, PopulatedType[IdKey]>>;
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