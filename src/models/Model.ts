import { Schema } from './Schema'
import ReducerStorage from './ReducerStorage'


export default class Model<S extends Schema<any, any, any>>{
    public readonly schema: S
    protected _reducerName: string
    constructor(schema: S) {
        this.schema = schema
        this._reducerName = ReducerStorage.getReducerName()
    }
    /** @internal */
    get name() {
        return this._reducerName
    }
}
export class ComplexModel<S extends Schema<any, any, any>,
    Opts> extends Model<S>{
    /** @internal */
    protected readonly opts: Schema<Opts, any, any>
    /** @internal */
    protected readonly getKey: (opts: Opts) => string
    constructor(schema: S, opts: Schema<Opts, any, any>, getKey: (optsItem: Opts) => string) {
        super(schema)
        this._reducerName = name
        this.getKey = getKey
        this.opts = opts
    }
}