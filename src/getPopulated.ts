import React from 'react'
import { Redux as ReducerNamespace } from '@rest-api/redux/src/ReducerStorage'
import { Redux as SchemaNamespace } from '@rest-api/redux/src/Schema'
import { Model, HttpError } from '@rest-api/redux'
import { InferableComponentEnhancerWithProps, shallowEqual, GetProps } from 'react-redux'
import { useDispatch, useSelector } from '..'

export namespace Get {
    export type PromsFromItem<PartialItem, PopulatedItem, Name extends string = 'items'> = {
        populated: true,
        invalidated: boolean;
        error: HttpError | null;
        loading: boolean;
    } & {
            [k in Name]: PopulatedItem[];
        } | {
            [k in Name]: PartialItem[];
        } & {
            loading: boolean;
            populated: false,
            invalidated: boolean;
            error: HttpError | null;
        }
}



export function useGetPopulated<
    RealType,
    PopulatedType,
    FullPopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Metadata>(
        model: Model<RealType, PopulatedType, FullPopulatedType, IdKey, any, Metadata>,
        queryString?: string | URLSearchParams
    ): Get.PromsFromItem<PopulatedType, FullPopulatedType> {
    const { fetchPopulatedIfNeeded } = model.actions
    type Result = Get.PromsFromItem<PopulatedType, FullPopulatedType> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Result>({ error: null, populated: false, invalidated: true, loading: false, items: [], state: <any>{} })
    const { getPopulated, isFetching, isPopulated, isInvalidated, getError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: Get.PromsFromItem<PopulatedType, FullPopulatedType> & { state: ReducerNamespace.ReducerType } = {
            state,
            populated: isPopulated(state, queryString?.toString()),
            items: getPopulated(state, queryString?.toString()) as any,
            loading: isFetching(state, queryString?.toString()),
            invalidated: isInvalidated(state, queryString?.toString()),
            error: getError(state, queryString?.toString()),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchPopulatedIfNeeded(queryString?.toString()))
        const { items: currentItems, ...currentState } = state
        const { items: prevItems, ...prevState } = result
        if (!shallowEqual(prevState, currentState)) setResult(state)
        else if (currentItems.length !== prevItems.length) setResult(state)
        else if (model.utils.get(currentState.state, queryString?.toString()).some(item => {
            let count = 0
            model.model.schema._getModelValues(item, (model, id) => {
                if (model.utils.getById(currentState.state, id) !== model.utils.getById(prevState.state, id)) count++
            })
            return count > 0
        })) setResult(state)
    })
    const { state: currentSate, ...other } = state
    return other
}


function useGetBasic<PopulatedType, FullPopulatedType, Metadata>(
    model: Model<any, PopulatedType, FullPopulatedType, any, {}, Metadata>,
): InferableComponentEnhancerWithProps<Get.PromsFromItem<PopulatedType, FullPopulatedType>, { queryString?: string | URLSearchParams }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            queryString?: string | URLSearchParams
        }
        > = (props) => {
            const result = useGetPopulated(model, props.queryString)
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}
function useGetExtended<PopulatedType, FullPopulatedType, Metadata, Name extends string>(
    model: Model<any, PopulatedType, FullPopulatedType, any, {}, Metadata>,
    name: Name
): InferableComponentEnhancerWithProps<Get.PromsFromItem<PopulatedType, FullPopulatedType, Name>, { queryString?: string | URLSearchParams }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            queryString?: string | URLSearchParams
        }
        > = (props) => {
            const { items, ...otherPropsOfResult } = useGetPopulated(model, props.queryString)
            const result: Get.PromsFromItem<PopulatedType, FullPopulatedType, Name> = <any>{
                ...otherPropsOfResult,
                [name]: items,

            }
            return React.createElement(ReactComponent, { ...props, ...result })
        }
        return ObjectRaising
    }
}


export default function connectGet<
    PopulatedType,
    FullPopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Metadata
>(
    model: Model<any, PopulatedType, FullPopulatedType, IdKey, any, Metadata>,
): InferableComponentEnhancerWithProps<Get.PromsFromItem<PopulatedType, FullPopulatedType>, { queryString?: string | URLSearchParams }>
export default function connectGet<
    PopulatedType,
    FullPopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Metadata,
    Name extends string
>(
    mmodel: Model<any, PopulatedType, FullPopulatedType, IdKey, any, Metadata>,
    name: Name
): InferableComponentEnhancerWithProps<Get.PromsFromItem<PopulatedType, FullPopulatedType, Name>, { queryString?: string | URLSearchParams }>
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