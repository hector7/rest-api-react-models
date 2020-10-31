import { RestModel, RouteOpts, joinClassMethods } from "../index"
import { Schema, StringOrNumberKeys, DeleteFieldSchema, SchemaWithoutKeys } from "../../Schema"
import BasicModel from "../../Model"
import BasicSearchRestModel from './BasicSearchRestModel'
import BasicIdRestModel from "./BasicIdRestModel"
import ComplexIdRestModel from "../ComplexIdRestModel"
import ComplexSearchRestModel from "../ComplexSearchRestModel"
import { useDispatch, useSelector } from "../../../.."
import { ReducerType } from "../../ReducerStorage"

type DynamicUrl = () => string
interface DeleteFieldsType<S extends Schema<any>,
    IdKey extends string,
    GetItem,
    MetaData> {
    <K extends DeleteFieldSchema<Exclude<keyof S["RealType"], IdKey>>>
        (...keys: K):
        BasicRestModel<Schema<{
            [K2 in Exclude<keyof S['RealType'], K[number]>]: S['RealType'][K2]
        }, {
                [K2 in Exclude<keyof S['PopulatedType'], K[number]>]: S['PopulatedType'][K2]
            }, {
                [K2 in Exclude<keyof S['FullPopulatedType'], K[number]>]: S['FullPopulatedType'][K2]
            }>, any, GetItem, MetaData>
}

export default class BasicRestModel<S extends Schema<any> = any,
    IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string = any,
    GetItem = any,
    MetaData = any> extends RestModel<{}, S, IdKey, GetItem, MetaData> {

    protected basicIdRestModel: BasicIdRestModel<S, IdKey>
    private basicSearchRestModel: BasicSearchRestModel<S, IdKey, GetItem, MetaData>
    /** @internal */
    public get _reducer() {
        return joinClassMethods(this.basicIdRestModel._reducer, this.basicSearchRestModel._reducer)
    }
    constructor(schema: S, id: IdKey, url: string | DynamicUrl, routeOpts?: RouteOpts)
    constructor(schema: S, id: IdKey, url: string | DynamicUrl, itemStructure: Schema<GetItem, any, any>, getItems: (el: GetItem) => S['RealType'][], routeOpts?: RouteOpts)
    constructor(schema: S, id: IdKey, url: string | DynamicUrl, itemStructure: Schema<GetItem, any, any>, getItems: (el: GetItem) => S['RealType'][], getMetaData: (el: GetItem) => MetaData,)
    constructor(schema: S, id: IdKey, url: string | DynamicUrl, itemStructure: Schema<GetItem, any, any>, getItems: (el: GetItem) => S['RealType'][], getMetaData: (el: GetItem) => MetaData, opts: RouteOpts)
    constructor(...args: any[]) {
        super(new BasicModel<S>(args[0]), args[1], typeof args[2] === 'string' ? () => args[2] : args[2], {
            ...args.length <= 4 ? args[3] : args.length === 6 && typeof args[5] === 'object' ? args[5] : args[6] ? args[6] : {},
            getItems: (args.length > 4 ? args[4] : undefined) as any,
            getMetaData: (args.length > 4 && typeof args[5] === 'function' ? args[5] : undefined) as any,
            itemStructure: (args.length > 4 ? args[3] : undefined) as any
        })
        this.basicIdRestModel = new BasicIdRestModel<S, IdKey>(this, args[1], this.getUrl)
        this.basicSearchRestModel = new BasicSearchRestModel<S, IdKey, GetItem, MetaData>(this.basicIdRestModel, this.getUrl)
    }
    hiddeFields: DeleteFieldsType<S, IdKey, GetItem, MetaData> = (...fields) => {
        const schema = this.model.schema.deleteFields(...fields)
        const model = Object.assign(BasicRestModel, this)
        model.model.schema = schema as any
        return model as any
    }
    getSubModelWithKey<
        k extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string
    >(key: k, url?: string): BasicIdRestModel<S, k>
    getSubModelWithKey<
        R,
        k extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string
    >(optSchema: Schema<R>, key: k, url: (opts: R) => string): ComplexIdRestModel<R, S, k>
    getSubModelWithKey<
        R,
        k extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string
    >(keyOrSchema: Schema<R> | k, keyOrUrl?: string | k, url?: (opts: any) => string) {
        if (typeof (keyOrSchema) === 'string')
            return new BasicIdRestModel(this, keyOrSchema, keyOrUrl ? () => keyOrUrl : this.getUrl)
        return new ComplexIdRestModel(this, keyOrUrl as k, keyOrSchema, url!)
    }
    getSearchSubModel(url: string): BasicSearchRestModel<S, IdKey, GetItem, MetaData>
    getSearchSubModel<R>(optSchema: Schema<R>, url: (opt: R) => string): ComplexSearchRestModel<R, S, IdKey, GetItem, MetaData>
    getSearchSubModel<R>(optSchemaOrUrl: Schema<R> | string, url?: (opt: R) => string) {
        if (typeof (optSchemaOrUrl) === 'string') {
            return new BasicSearchRestModel<S, IdKey, GetItem, MetaData>(this.basicIdRestModel, () => optSchemaOrUrl)
        }
        return new ComplexSearchRestModel<R, S, IdKey, GetItem, MetaData>(this.basicIdRestModel, optSchemaOrUrl, url!)
    }
    /** @internal */
    get _actions() {
        return joinClassMethods(this.basicIdRestModel._actions, this.basicSearchRestModel._actions)
    }
    /**
     * Hook used to fetch if needed to "/" path of model
     */
    useFetchIfNeeded() {
        return this.basicSearchRestModel.useFetchIfNeeded.bind(this.basicSearchRestModel)
    }
    /**
     * Hook used to get data (without fetch if needed). Not optimal. Refresh on every change of model.
     */
    useSelectorGet() {
        const state: any = useSelector<ReducerType>(state => this.basicSearchRestModel._reducer.getReducer(state))
        return (queryString?: string) => {
            return this.basicSearchRestModel._reducer.get(state, queryString)
        }
    }
    /**
     * Hook used to fetch and fetch submodels with idOnly if needed to "/" path of model
     */
    useFetchPopulatedIfNeeded() {
        return this.basicSearchRestModel.useFetchPopulatedIfNeeded.bind(this.basicSearchRestModel)
    }
    /**
     * Hook used to get populated data (without fetch if needed). Not optimal. Refresh on every change of model.
     */
    useSelectorGetPopulated() {
        const state: any = useSelector<ReducerType>(state => this.basicSearchRestModel._reducer.getReducer(state))
        return (queryString?: string) => {
            return this.basicSearchRestModel._reducer.getPopulated(state, queryString)
        }
    }
    /**
     * Hook used to get id data (without fetch if needed). Not optimal. Refresh on every change of model.
     */
    useSelectorGetById() {
        const state: any = useSelector<ReducerType>(state => this.basicSearchRestModel._reducer.getReducer(state))
        return (id: S["RealType"][IdKey]) => {
            return this.basicIdRestModel._reducer.getByIdPopulated(state, id)
        }
    }
    /**
     * Hook used to fetch if needed to "/:id" path of model
     */
    useFetchByIdIfNeeded() {
        return this.basicIdRestModel.useFetchByIdIfNeeded.bind(this.basicIdRestModel)
    }
    /**
     * Hook used to get populated id data (without fetch if needed). Not optimal. Refresh on every change of model.
     */
    useSelectorGetByIdPopulated() {
        const state: any = useSelector<ReducerType>(state => this.basicSearchRestModel._reducer.getReducer(state))
        return (id: S["RealType"][IdKey]) => {
            return this.basicIdRestModel._reducer.getByIdPopulated(state, id)
        }
    }
    /**
     * Hook used to fetch and fetch submodels with idOnly if needed to "/:id" path of model
     */
    useFetchByIdPopulatedIfNeeded() {
        return this.basicIdRestModel.useFetchByIdPopulatedIfNeeded.bind(this.basicIdRestModel)
    }
    /**
     * Hook used to get the result if there are from path "/". 
     * Internally use the hook useFetchIfNeeded with the querystring provided.
     */
    get useGet() {
        return this.basicSearchRestModel.useGet.bind(this.basicSearchRestModel)
    }

    /**
     * Uset to invalidate all requests
     */
    get useInvalidateAll() {
        return this.basicIdRestModel.useInvalidateAll.bind(this.basicIdRestModel)
    }

    /**
     * Hook used to get the result populated (populating models with idOnly if there are) if there are from path "/". 
     * Internally use the hook useFetchPopulatedIfNeeded with the querystring provided.
     */
    get useGetPopulated() {
        return this.basicSearchRestModel.useGetPopulated.bind(this.basicSearchRestModel)
    }
    /**
     * Hook used to get the result if there are from path "/:id". 
     * Internally use the hook useFetchByIdIfNeeded with the id provided.
     */
    get useGetById() {
        return this.basicIdRestModel.useGetById.bind(this.basicIdRestModel)
    }
    /**
     * Hook used to get the result if there are from path "/". 
     * Internally use the hook useFetchByIdPopulatedIfNeeded with the id provided.
     */
    get useGetByIdPopulated() {
        return this.basicIdRestModel.useGetByIdPopulated.bind(this.basicIdRestModel)
    }

    /**
     * Used to change model: post, put, patch and delete
     */
    useModificators() {
        const dispatch = useDispatch()
        const actionPost = this.basicIdRestModel._actions.post.bind(this.basicIdRestModel._actions)
        const actionPut = this.basicIdRestModel._actions.put.bind(this.basicIdRestModel._actions)
        const actionPatch = this.basicIdRestModel._actions.patch.bind(this.basicIdRestModel._actions)
        const actionDelete = this.basicIdRestModel._actions.delete.bind(this.basicIdRestModel._actions)
        const post: typeof actionPost = (item, callback) => dispatch(actionPost(item, callback))
        const put: typeof actionPut = (id, item, callback) => dispatch(actionPut(id, item, callback))
        const patch: typeof actionPatch = (id, item, callback) => dispatch(actionPatch(id, item, callback))
        const remove: typeof actionDelete = (item, callback) => dispatch(actionDelete(item, callback))
        return {
            post,
            put,
            patch,
            remove
        }
    }
    /**
     * Used to post a entry model
     */
    usePost() {
        const { post } = this.useModificators()
        return post
    }
    /**
     * Used to put a entry model
     */
    usePut() {
        const { put } = this.useModificators()
        return put
    }
    /**
     * Used to patch a entry model
     */
    usePatch() {
        const { patch } = this.useModificators()
        return patch
    }
    /**
     * Used to delete a entry model
     */
    useDelete() {
        const { remove } = this.useModificators()
        return remove
    }
}
