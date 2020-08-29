import { ModelType, Model, required, Schema } from "../..";
import 'jest-expect-message'

declare var global: any
describe('Unit test', () => {
    it('Schema is ok', () => {
        const s = Schema({
            stringRequired: { type: String, required: true, nullable: true },
            stringOptional: { type: String },
            stringSimplified: String,
            stringRequiredArray: [{ type: String, required: true, nullable: true }],
            stringOptionalArray: [String],
            id: { required: true, type: Number, },
            nullable: { type: String, nullable: true },
            name: [{ type: String, required: true }],
            date: { type: Date, required: true },
            objectType: {
                type: Schema({
                    hola: Number
                }),
                required: true
            },
            object: [Schema({
                hola: { required: true, type: Number, }
            })],
            type: {
                type: String,
                required: true
            },
            r: [{
                type: Schema({
                    jeje: Number
                }),
                required: true
            }]
        });
        type Schema = ModelType<typeof s>
        const r: Schema = {
            stringRequired: '',
            stringRequiredArray: [],
            date: new Date(),
            id: 1,
            name: [''],
            objectType: {},
            r: [],
            type: 'ddd'
        }
        const testModel = new Model(s, 'id', 'd')
        const d = Schema({
            testModel: { type: testModel, idOnly: true }
        })
        //const SubModel = testModel.getSubModel({ a: { type: String, required: true } }, (opts) => opts.a)
        //SubModel.name
        expect(s.validate(r)).toBeTruthy()


        let a: any = Object.assign({}, r)
        let b: any = Object.assign({}, r)
        b.stringRequired = null
        expect(s.validate(b), "null working as nullable=true").toBeTruthy()
        b.stringRequiredArray = null
        expect(s.validate(b), "null working as nullable=true").toBeTruthy()
        b.nullable = null
        expect(s.validate(b), "null not working on optional argument").toBeTruthy()
        b.object = null
        expect(s.validate(b), "null raises the error when is not nullable").toBeFalsy()
        delete a.date
        expect(s.validate('')).toBeFalsy()
        expect(s.validate(a)).toBeFalsy()
        a = Object.assign({}, r)
        a.date = 'dd'
        expect(s.validate(a)).toBeFalsy()
        a = Object.assign({}, r)
        a.r = ''
        expect(s.validate(a)).toBeFalsy()
        a = Object.assign({}, r)
        a.r = ['']
        expect(s.validate(a)).toBeFalsy()
        a = Object.assign({}, r)
        a.stringRequiredArray = [1]
        expect(s.validate(a)).toBeFalsy()
        expect(s.validateArray('')).toBeFalsy()
        const old_node_env = process.env.NODE_ENV
        process.env.NODE_ENV = 'production'
        expect(s.validate(a)).toBeTruthy()
        expect(s.validateArray(null)).toBeTruthy()
        process.env.NODE_ENV = old_node_env
        a = Object.assign({}, r)
        expect(d.validate({ testModel: 1 })).toBeTruthy()
    })
    it('Schema get data correctly', () => {
        const test = Schema({
            name: { type: String, required }
        })
        const nameLength = test.updateSchema({ name: { type: Number } })
        expect(nameLength.validate({ name: '' })).toBeFalsy()
        expect(nameLength.validate({ name: 1 })).toBeTruthy()
        const testWithExtraField = nameLength.updateSchema({ nameLength: { type: String, required } })
        expect(testWithExtraField.validate({ name: 1 })).toBeFalsy()
        expect(testWithExtraField.validate({ name: 1, nameLength: '' })).toBeTruthy()
        expect(testWithExtraField.deleteFields('name').validate({ nameLength: '' })).toBeTruthy()
        const otherFieldUpdated = testWithExtraField.updateField('name', { type: String, required }, name => name ? name.toString() : 'not found')
        expect(
            otherFieldUpdated.validate(
                otherFieldUpdated._useUpdatedSteps({} as any, { name: 1, nameLength: 'fgss' })
            )
        ).toBeTruthy()
    })
})