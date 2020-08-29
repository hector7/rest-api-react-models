import { Schema, ItemFieldWithParams } from '../Schema'
import Model from '../Model'
import ReducerStorage from '../ReducerStorage'
import { ModelState } from '../State'

export type RouteOpts = {
    trailingSlash?: boolean,
    headers?: {
        [key: string]: string;
    }
}

type ComplexUrlCallbackParam = (el: any) => string
export type UrlCallbackParam<Opts> = (opts: Opts) => string


class ReducerImplementation extends Object {
    /** @internal */
    protected readonly modelName: string
    constructor(modelName: string) {
        super()
        this.modelName = modelName
    }
    protected addBasicIdReducer<IdKey extends string>(idKey: IdKey) {
        ReducerStorage.addBasicIdReducer(this.modelName, idKey)
    }

}

export class RestModel<Opts = any,
    S extends Schema<any, any, any> = any,
    IdKey extends string = any,
    GetItem = any,
    MetaData = any> extends ReducerImplementation {
    public readonly state: ModelState<RestModel<Opts, S, IdKey, GetItem, MetaData>>
    public readonly model: Model<S>
    public readonly _id: IdKey
    public readonly getUrl: (opts: Opts) => string
    public readonly itemStructure?: Schema<GetItem>
    /** @internal */
    public readonly getItems: (item: GetItem) => S['RealType'][]
    /** @internal */
    public readonly getMetaData: (item: GetItem) => MetaData
    /** @internal */
    public readonly trailingSlash: boolean
    /** @internal */
    public readonly headers: {
        [key: string]: string;
    }

    constructor(model: Model<S>, id: IdKey, url: UrlCallbackParam<Opts>, opts: { itemStructure?: Schema<GetItem, any, any>, getItems?: (el: GetItem) => S['RealType'][], getMetaData?: (el: GetItem) => MetaData } & RouteOpts = {}) {
        super(model.name)
        this._id = id!
        this.getUrl = url
        this.model = model
        this.trailingSlash = opts.trailingSlash ? opts.trailingSlash : false
        this.headers = opts.headers ? opts.headers : {}
        this.itemStructure = opts.itemStructure
        this.getItems = opts.getItems ? opts.getItems : items => items as any
        this.getMetaData = opts.getMetaData ? opts.getMetaData : () => null as any
        super.addBasicIdReducer(id!)
        this.state = new ModelState(this)
    }
    public get validateItem(): (el: any) => el is S['RealType'] {
        return this.model.schema.validate.bind(this.model.schema)
    }
    public get validateFetch(): (el: any) => el is GetItem {
        if (this.itemStructure !== undefined) return this.itemStructure.validate.bind(this.itemStructure)
        return this.model.schema.validateArray.bind(this.model.schema) as any
    }
    /** @internal */
    public get itemType(): S['RealType'][IdKey] {
        throw new Error('Method only exist for typing reasons')
    }
    /** @internal */
    get idType() {
        return (this.model.schema._schema[this._id] as ItemFieldWithParams<StringConstructor | NumberConstructor>).type
    }
}
export type GetMethods<T extends { [key: string]: any }> = { [k in keyof T]: T[k] }

/**
* This method will extract all methods from parameters binded from each parameter.
*
* ```typescript
* const methodsClass1Binded = joinClassMethods(class1)
* const methodsClass1AndClass2Binded = joinClassMethods(class1, class2)
* ```
*/
export function joinClassMethods<A extends { [key: string]: any }>(a: A): { [k in keyof A]: A[k] }
export function joinClassMethods<A extends { [key: string]: any }, B extends { [key: string]: any }>(a: A, b: B): { [k in keyof A]: A[k] } & { [k in keyof B]: B[k] }
export function joinClassMethods(...args: { [key: string]: any }[]) {
    const res: any = {}
    args.forEach(cClass => {
        const cMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(cClass))
        cMethods.forEach(key => {
            if (key !== 'constructor') {
                res[key] = (cClass as any)[key].bind(cClass)
            }
        })
    })
    return res
}