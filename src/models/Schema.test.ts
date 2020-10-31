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
            date: { type: String, required: true },
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
            date: '',
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
        expect(() => { s.getValidateErrorPretty(r) }).toThrow()


        let a: any = Object.assign({}, r)
        let b: any = Object.assign({}, r)
        b.stringRequired = null
        expect(s.validate(b), "null working as nullable=true").toBeTruthy()
        expect(() => { s.getValidateErrorPretty(b), "null working as nullable=true" }).toThrow()
        b.stringRequiredArray = null
        expect(s.validate(b), "null working as nullable=true").toBeTruthy()
        expect(() => { s.getValidateErrorPretty(b), "null working as nullable=true" }).toThrow()
        b.nullable = null
        expect(s.validate(b), "null not working on optional argument").toBeTruthy()
        expect(() => { s.getValidateErrorPretty(b), "null not working on optional argument" }).toThrow()
        b.object = null
        expect(s.validate(b), "null raises the error when is not nullable").toBeFalsy()
        expect(() => { s.getValidateErrorPretty(b), "null raises the error when is not nullable" }).not.toThrow('')
        delete a.date
        expect(s.validate('')).toBeFalsy()
        expect(s.validate(a)).toBeFalsy()
        expect(s.validate('')).toBeFalsy()
        expect(() => { s.getValidateErrorPretty(a) }).not.toThrow('')
        a = Object.assign({}, r)
        a.date = 1
        expect(s.validate(a)).toBeFalsy()
        expect(() => { s.getValidateErrorPretty(a) }).not.toThrow('')
        a = Object.assign({}, r)
        a.r = ''
        expect(s.validate(a)).toBeFalsy()
        expect(() => { s.getValidateErrorPretty(a) }).not.toThrow('')
        a = Object.assign({}, r)
        a.r = ['']
        expect(s.validate(a)).toBeFalsy()
        expect(() => { s.getValidateErrorPretty(a) }).not.toThrow('')
        a = Object.assign({}, r)
        a.stringRequiredArray = [1]
        expect(s.validate(a)).toBeFalsy()
        expect(() => { s.getValidateErrorPretty(a) }).not.toThrow('')
        expect(s.validateArray('')).toBeFalsy()
        expect(() => { s.getValidateArrayError('') }).not.toThrow('')
        expect(() => { s.getValidateArrayError([{ a: 1 }]) }).not.toThrow()
        const old_node_env = process.env.NODE_ENV
        process.env.NODE_ENV = 'production'
        expect(s.validate(a)).toBeTruthy()
        expect(s.validateArray(null)).toBeTruthy()
        expect(() => { s.getValidateErrorPretty(null) }).toThrow()
        expect(() => { s.getValidateArrayError(null) }).not.toThrow()
        process.env.NODE_ENV = old_node_env
        a = Object.assign({}, r)
        expect(d.validate({ testModel: 1 })).toBeTruthy()
        expect(() => { d.getValidateErrorPretty({ testModel: 1 }) }).toThrow()
    })
    it('Schema get data correctly', () => {
        const test = Schema({
            name: { type: String, required }
        })
        const nameLength = test.updateSchema({ name: { type: Number } })
        expect(nameLength.validate({ name: '' })).toBeFalsy()
        expect(() => { nameLength.getValidateErrorPretty({ name: '' }) }).not.toThrow('')
        expect(nameLength.validate({ name: 1 })).toBeTruthy()
        expect(() => { nameLength.getValidateErrorPretty({ name: 1 }) }).toThrow()
        const testWithExtraField = nameLength.updateSchema({ nameLength: { type: String, required } })
        expect(testWithExtraField.validate({ name: 1 })).toBeFalsy()
        expect(() => { testWithExtraField.getValidateErrorPretty({ name: 1 }) }).not.toThrow('')
        expect(testWithExtraField.validate({ name: 1, nameLength: '' })).toBeTruthy()
        expect(() => { testWithExtraField.getValidateErrorPretty({ name: 1, nameLength: '' }) }).toThrow()
        expect(testWithExtraField.deleteFields('name').validate({ nameLength: '' })).toBeTruthy()
        expect(() => { testWithExtraField.deleteFields('name').getValidateErrorPretty({ nameLength: '' }) }).toThrow()
        const otherFieldUpdated = testWithExtraField.updateField('name', name => name ? name.toString() : 'not found')
        const res = otherFieldUpdated._useUpdatedSteps({} as any, { name: 1, nameLength: 'fgss' })
        const res2 = otherFieldUpdated.updateField('nameLength', l => l.length)._useUpdatedSteps({} as any, { name: 1, nameLength: 'fgss' })
        expect(res.name).toBe('1')
        expect(res2.nameLength).toBe(4)
    })
})