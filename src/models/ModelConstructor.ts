import { Schema, StringOrNumberKeys } from "./Schema"
import BasicRestModel from "./restmodels/basic/BasicRestModel";

type DummyType = { someId: number, date: Date }
type DummySchema = Schema<DummyType>
export default class ModelConstructor<
    R,
    MetaData = null>{
    private itemStructure?: (el: Schema<any>) => Schema<R>
    private items?: (schema: R) => any[]
    private metaData?: (schema: R) => MetaData
    constructor(getItemsStructure?: (el: DummySchema) => Schema<R>, getItems?: (schema: R) => DummyType[], getMetaData?: (schema: R) => MetaData) {
        this.itemStructure = getItemsStructure
    }
    protected getItemsStructure<R>(schema: Schema<R>): Schema<any> {
        if (this.itemStructure) {
            return this.itemStructure(schema)
        }
        return undefined as any
    }
    protected getItems(): (schema: R) => any[] {
        if (this.items)
            return this.items
        return undefined as any
    }
    protected getMetaData(): (schema: R) => MetaData {
        if (this.metaData)
            return this.metaData
        return undefined as any
    }
    protected get routeOpts() {
        return {}
    }
    getModel<S extends Schema<any>,
        IdKey extends StringOrNumberKeys<S['RealType']> & StringOrNumberKeys<S['PopulatedType']> & string
    >(
        schema: S,
        idKey: IdKey,
        url: string): BasicRestModel<S, IdKey, any, MetaData> {
        return new BasicRestModel(schema, idKey, url, this.getItemsStructure(schema), this.getItems(), this.getMetaData(), this.routeOpts)
    }
}

const model = new ModelConstructor().getModel(Schema.getSchema({ id: { type: Number, required: true } }), 'id', '')

