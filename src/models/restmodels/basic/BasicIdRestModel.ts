import React from 'react'
import { UrlCallbackParam, RestModel } from ".."
import { Schema, StringOrNumberKeys } from "../../Schema"
import BasicIdReducer from "../../../reducers/BasicIdReducer";
import BasicIdActions from "../../../actions/BasicIdActions";
import { useDispatch, useSelector, HttpError } from '../../../../';
import { shallowEqual } from 'react-redux';
import { ReducerType } from '../../ReducerStorage';

export type UseGetByIdResult<Item> = {
    item: Item | null;
    initialized: boolean,
    loading: boolean;
    invalidated: boolean;
    error: HttpError | null;
}

export type UseGetByIdPopulatedResult<PartialItem, PopulatedItem> = {
    populated: true,
    invalidated: boolean;
    initialized: boolean,
    error: HttpError | null;
    loading: boolean;
    item: PopulatedItem;
} | {
    item: PartialItem | null;
    loading: boolean;
    initialized: boolean,
    populated: false,
    invalidated: boolean;
    error: HttpError | null;
}



export default class BasicIdRestModel<S extends Schema<any> = any,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string = any,
    > extends RestModel<{}, S, IdKey, any, any>{
    /** @internal */
    public _actions: BasicIdActions<S, IdKey>
    /** @internal */
    public _reducer: BasicIdReducer<S, IdKey>
    constructor(basicRestModel: RestModel<{}, S, any, any, any>, id: IdKey, url: UrlCallbackParam<{}>) {
        super(basicRestModel.model, id, url, {
            trailingSlash: basicRestModel.trailingSlash,
            headers: basicRestModel.headers,
            getItems: basicRestModel.getItems,
            getMetaData: basicRestModel.getMetaData,
            itemStructure: basicRestModel.itemStructure
        })
        super.addBasicIdReducer(id)
        this._actions = new BasicIdActions<S, IdKey>(this)
        this._reducer = new BasicIdReducer<S, IdKey>(this)
    }
    public useInvalidate(id: S["RealType"][IdKey]) {
        return () => {
            const dispatch = useDispatch()
            dispatch(this._actions.invalidateById(id))
        }
    }
    public useInvalidateAll() {
        return () => {
            const dispatch = useDispatch()
            dispatch(this._actions.invalidateAll())
        }
    }
    public useFetchByIdIfNeeded(id: S["RealType"][IdKey]) {
        const dispatch = useDispatch()
        React.useEffect(() => {
            dispatch(this._actions.fetchByIdIfNeeded(id))
        })
    }
    public useGetById(id: S["RealType"][IdKey]) {
        type Result = UseGetByIdResult<S["RealType"]>
        const [result, setResult] = React.useState<Result>({ error: null, initialized: false, invalidated: true, loading: false, item: null })
        const redirect = this.useInvalidate(id)
        const state = useSelector<ReducerType, Result>(state => {
            const resultState: UseGetByIdResult<S["RealType"]> = {
                item: this._reducer.getById(state, id),
                loading: this._reducer.isIdFetching(state, id),
                initialized: this._reducer.isIdInitialized(state, id),
                invalidated: this._reducer.isIdInvalidated(state, id),
                error: this._reducer.getIdError(state, id),
            }
            return resultState
        })
        this.useFetchByIdIfNeeded(id)
        React.useEffect(() => {
            if (!shallowEqual(state, result)) setResult(state)
        })
        return { ...result, redirect }
    }

    public useFetchByIdPopulatedIfNeeded(id: S["PopulatedType"][IdKey]) {
        const dispatch = useDispatch()
        React.useEffect(() => {
            dispatch(this._actions.fetchByIdPopulatedIfNeeded(id))
        })
    }
    public useGetByIdPopulated(id: S["PopulatedType"][IdKey]) {
        type Result = UseGetByIdPopulatedResult<S["PopulatedType"], S["FullPopulatedType"]>
        const [result, setResult] = React.useState<Result>({ error: null, populated: false, initialized: false, invalidated: true, loading: false, item: null })
        const redirect = this.useInvalidate(id)
        const state = useSelector<ReducerType, Result>(state => {
            const resultState: UseGetByIdPopulatedResult<S["PopulatedType"], S["FullPopulatedType"]> = {
                item: this._reducer.getByIdPopulated(state, id),
                loading: this._reducer.isIdFetching(state, id),
                populated: this._reducer.isIdPopulated(state, id),
                initialized: this._reducer.isIdInitialized(state, id),
                invalidated: this._reducer.isIdInvalidated(state, id),
                error: this._reducer.getIdError(state, id),
            }
            return resultState
        })
        this.useFetchByIdPopulatedIfNeeded(id)
        React.useEffect(() => {
            const { item: newItem, ...newOthers } = state
            const { item, ...others } = result
            if (!shallowEqual(newOthers, others) || (newItem && !item) || state.populated !== result.populated) {
                setResult(state)
            }
        })
        return { ...result, redirect }
    }
}