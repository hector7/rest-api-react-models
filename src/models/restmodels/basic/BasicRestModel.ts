import { RestModel, RouteOpts, joinClassMethods } from "../index"
import { Schema, StringOrNumberKeys } from "../../Schema"
import BasicModel from "../../Model"
import BasicSearchRestModel from './BasicSearchRestModel'
import BasicIdRestModel from "./BasicIdRestModel"
import ComplexIdRestModel from "../ComplexIdRestModel"
import ComplexSearchRestModel from "../ComplexSearchRestModel"
type DynamicUrl = () => string
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
    get useFetchIfNeeded() {
        return this.basicSearchRestModel.useFetchIfNeeded.bind(this.basicSearchRestModel)
    }
    get useFetchPopulatedIfNeeded() {
        return this.basicSearchRestModel.useFetchPopulatedIfNeeded.bind(this.basicSearchRestModel)
    }
    get useGet() {
        return this.basicSearchRestModel.useGet.bind(this.basicSearchRestModel)
    }
    get useGetPopulated() {
        return this.basicSearchRestModel.useGetPopulated.bind(this.basicSearchRestModel)
    }
    get useGetById() {
        return this.basicIdRestModel.useGetById.bind(this.basicIdRestModel)
    }
    get useGetByIdPopulated() {
        return this.basicIdRestModel.useGetByIdPopulated.bind(this.basicIdRestModel)
    }
    get useFetchByIdIfNeeded() {
        return this.basicIdRestModel.useFetchByIdIfNeeded.bind(this.basicIdRestModel)
    }
    get useFetchByIdPopulatedIfNeeded() {
        return this.basicIdRestModel.useFetchByIdPopulatedIfNeeded.bind(this.basicIdRestModel)
    }
}
