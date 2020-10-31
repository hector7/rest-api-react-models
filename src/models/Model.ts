import { Schema } from './Schema'
import ReducerStorage from './ReducerStorage'


export default class Model<S extends Schema<any, any, any>>{
    public schema: S
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
/*
Not used... used in a newar future
export class ComplexModel<S extends Schema<any, any, any>,
    Opts> extends Model<S>{
    protected readonly opts: Schema<Opts, any, any>
    protected readonly getKey: (opts: Opts) => string
    constructor(schema: S, opts: Schema<Opts, any, any>, getKey: (optsItem: Opts) => string) {
        super(schema)
        this._reducerName = name
        this.getKey = getKey
        this.opts = opts
    }
}
*/