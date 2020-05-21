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



export function useGetPopulated<
    RealType,
    PopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<RealType> & SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Metadata>(
        model: Model<RealType, PopulatedType, any, IdKey, any, Metadata>,
        queryString?: string
    ): Get.PromsFromItem<PopulatedType> {
    const { fetchPopulatedIfNeeded } = model.actions
    type Result = Get.PromsFromItem<PopulatedType> & { state: ReducerNamespace.ReducerType }
    const [result, setResult] = React.useState<Result>({ error: null, invalidated: true, loading: false, items: [], state: <any>{} })
    const { getPopulated, isFetching, isInvalidated, getError } = model.utils
    const dispatch = useDispatch()
    const state = useSelector<ReducerNamespace.ReducerType, Result>(state => {
        const resultState: Get.PromsFromItem<PopulatedType> & { state: ReducerNamespace.ReducerType } = {
            state,
            items: getPopulated(state, queryString),
            loading: isFetching(state, queryString),
            invalidated: isInvalidated(state, queryString),
            error: getError(state, queryString),
        }
        return resultState
    })
    React.useEffect(() => {
        dispatch(fetchPopulatedIfNeeded(queryString))
        const { items: currentItems, ...currentState } = state
        const { items: prevItems, ...prevState } = result
        if (!shallowEqual(prevState, currentState)) setResult(state)
        else if (currentItems.length !== prevItems.length) setResult(state)
        else if (model.utils.get(currentState.state, queryString).some(item => {
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


function useGetBasic<PopulatedType, Metadata>(
    model: Model<any, PopulatedType, any, any, {}, Metadata>,
): InferableComponentEnhancerWithProps<Get.PromsFromItem<PopulatedType>, { queryString?: string }> {
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
function useGetExtended<PopulatedType, Metadata, Name extends string>(
    model: Model<any, PopulatedType, any, any, {}, Metadata>,
    name: Name
): InferableComponentEnhancerWithProps<Get.PromsFromItem<PopulatedType, Name>, { queryString?: string }> {
    return (ReactComponent): any => {
        const ObjectRaising: React.FunctionComponent<GetProps<typeof ReactComponent> & {
            queryString?: string
        }
        > = (props) => {
            const { items, ...otherPropsOfResult } = useGetPopulated(model, props.queryString)
            const result: Get.PromsFromItem<PopulatedType, Name> = <any>{
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
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Metadata
>(
    model: Model<any, PopulatedType, any, IdKey, any, Metadata>,
): InferableComponentEnhancerWithProps<Get.PromsFromItem<PopulatedType>, { queryString?: string }>
export default function connectGet<
    PopulatedType,
    IdKey extends SchemaNamespace.StringOrNumberKeys<PopulatedType> & string,
    Metadata,
    Name extends string
>(
    mmodel: Model<any, PopulatedType, any, IdKey, any, Metadata>,
    name: Name
): InferableComponentEnhancerWithProps<Get.PromsFromItem<PopulatedType, Name>, { queryString?: string }>
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