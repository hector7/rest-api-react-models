import { Model, required, Schema } from "../../../../";
import 'jest-expect-message'
import FakeXMLHttpRequest from "fake-xml-http-request";
import { createStore, applyMiddleware } from "redux";
import ReducerStorage from "../../ReducerStorage";
import thunkMiddleware from 'redux-thunk'

declare var global: any
describe('IT', () => {
    it('fetch get the correct data from a identifier', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                this.respond(200, {}, JSON.stringify({ id: 1 }))
            }
        }
        const s = Schema({
            id: { required: true, type: Number }
        });
        const ss = new Model(s, 'id', '/api/rest')

        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(ss._actions.fetchByIdIfNeeded(1))
        const obj = ss._reducer.getById(root.getState(), 1)
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(obj.hasOwnProperty('id')).toBeTruthy()
            expect(obj.id).toBe(1)
            let called = false
            global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
                send() {
                    called = true
                }
            }
            root.dispatch(ss._actions.fetchByIdIfNeeded(1))
            expect(called, 'this not will be called').toBe(false)
        }
    })
    it('fetch fails', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                this.respond(500, {}, 'here the error')
            }
        }
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],
            date: { type: Date, required: true },
            objectType: {
                type: Schema({
                    hola: Number
                }),
                required: true
            },
            object: Schema({
                hola: { required: true, type: Number, }
            }),
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
        const ss = new Model(s, 'id', '/api/rest')

        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(ss._actions.fetchIfNeeded())
        const obj = ss._reducer.getError(root.getState())
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(obj.codeNumber).toBe(500)
            expect(obj.message).toBe('here the error')
        }
    })
    it('fetch by id fails', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                this.respond(500, {}, 'here the error')
            }
        }
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],
            date: { type: Date, required: true },
            objectType: {
                type: Schema({
                    hola: Number
                }),
                required: true
            },
            object: Schema({
                hola: { required: true, type: Number, }
            }),
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
        const ss = new Model(s, 'id', '/api/rest')

        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(ss._actions.fetchByIdIfNeeded(<any>1))
        const obj = ss._reducer.getIdError(root.getState(), 1)
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(obj.codeNumber).toBe(500)
            expect(obj.message).toBe('here the error')
        }
    })
    it('invalidate works', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                this.respond(200, {}, JSON.stringify([
                    { id: 1, name: ['jose'] },
                    { id: 2, name: ['hector'] },
                    { id: 3, name: ['pepito'] },
                    { id: 4, name: ['albert'] }
                ]))
            }
        }
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const ss = new Model(s, 'id', '/api/rest')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(ss._actions.fetchIfNeeded())
        const obj = ss._reducer.get(root.getState())
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(Array.isArray(obj), 'response is an array').toBe(true)
            expect(obj.length).toBe(4)
            expect(obj[0].id).toBe(1)
            expect(Array.isArray(obj[0].name), 'name is an array').toBe(true)
            expect(obj[0].name.length).toBe(1)
            expect(obj[0].name[0]).toBe('jose')
            let called = false
            global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
                send() {
                    called = true
                }
            }
            root.dispatch(ss._actions.fetchIfNeeded())
            expect(called, 'this not will be called').toBe(false)
            expect(ss._reducer.isInvalidated(root.getState())).toBeFalsy()
            root.dispatch(ss._actions.invalidate())
            expect(ss._reducer.isInvalidated(root.getState())).toBeTruthy()
        }
    })
    it('fetch get the correct data from all objects', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                this.respond(200, {}, JSON.stringify([
                    { id: 1, name: ['jose'] },
                    { id: 2, name: ['hector'] },
                    { id: 3, name: ['pepito'] },
                    { id: 4, name: ['albert'] }
                ]))
            }
        }
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const ss = new Model(s, 'id', '/api/rest')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(ss._actions.fetchIfNeeded())
        const obj = ss._reducer.get(root.getState())
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(Array.isArray(obj), 'response is an array').toBe(true)
            expect(obj.length).toBe(4)
            expect(obj[0].id).toBe(1)
            expect(Array.isArray(obj[0].name), 'name is an array').toBe(true)
            expect(obj[0].name.length).toBe(1)
            expect(obj[0].name[0]).toBe('jose')
            let called = false
            global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
                send() {
                    called = true
                }
            }
            root.dispatch(ss._actions.fetchIfNeeded())
            expect(called, 'this not will be called').toBe(false)
        }
    })
    it('simple fetch populate is working', () => {
        let called_global = false
        let called_populated = false
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/generalResponse':
                        called_global = true
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, model: 1 }
                        ]))
                    case '/populatedResponse/1':
                        called_populated = true
                        return this.respond(200, {}, JSON.stringify({ id: 1, name: ['jose'] }))
                }
            }
        }
        const ss = new Model(Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        }), 'id', '/populatedResponse')
        const cc = new Model(Schema({ id: { required: true, type: Number }, model: { type: ss, idOnly: true } }), 'id', '/generalResponse')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        const obj = ss._reducer.get(root.getState())
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(called_global).toBeTruthy()
            expect(called_populated).toBeTruthy()
        }
    })
    it('simple fetch with schema populate is working', () => {
        let called_populated = false
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/generalResponse':
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, model: { model: 1 } }
                        ]))
                    case '/populatedResponse/1':
                        called_populated = true
                        return this.respond(200, {}, JSON.stringify({ id: 1, name: ['jose'] }))
                }
            }
        }
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const ss = new Model(s, 'id', '/populatedResponse')
        const cc = new Model(Schema({ id: { required: true, type: Number }, model: Schema({ model: { type: ss, idOnly: true } }) }), 'id', '/generalResponse')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        const obj = ss._reducer.get(root.getState())
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(called_populated, 'populate calls by id inside a schema').toBe(true)
        }
    })
    it('populate of populate is working', () => {
        let called_populated = false
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/generalResponse':
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, model: [1] }
                        ]))
                    case '/populatedResponse/1':
                        return this.respond(200, {}, JSON.stringify({ id: 1, model: 2 }))
                    case '/populatedResponse2/2':
                        called_populated = true
                        return this.respond(200, {}, JSON.stringify({ id: 2, name: ['jose'] }))
                }
            }
        }
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const tt = new Model(s, 'id', '/populatedResponse2')
        const ss = new Model(Schema({ id: { required: true, type: Number }, model: { type: tt, idOnly: true } }), 'id', '/populatedResponse')
        const cc = new Model(Schema({ id: { required: true, type: Number }, model: [{ type: ss, required: true, idOnly: true }] }), 'id', '/generalResponse')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        const obj1 = ss._reducer.getPopulated(root.getState())
        expect(ss._reducer.isPopulated(root.getState())).toBeTruthy()
        //first time is not in redux, so is not fetched.
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        const obj = ss._reducer.get(root.getState())
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(called_populated, 'populate call model of model is not working').toBe(true)
        }
    })
    it('populated in progress is working', () => {
        let called_populated = false
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/generalResponse':
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, model: [1, 2] }
                        ]))
                    case '/populatedResponse/1':
                        return this.respond(200, {}, JSON.stringify({ id: 1, model: 2 }))
                }
            }
        }
        const s = Schema({
            id: { required: true, type: Number },
            name: [{ type: String, required: true }],

        });
        const tt = new Model(s, 'id', '/populatedResponse2')
        s.updateSchema({ d: { type: s, } })
        const ss = new Model(Schema({ id: { required: true, type: Number }, model: { type: tt, idOnly: true } }), 'id', '/populatedResponse')
        const cc = new Model(Schema({ id: { required: true, type: Number }, model: [{ type: ss, required: true, idOnly: true }] }), 'id', '/generalResponse')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        const obj1 = cc._reducer.getPopulated(root.getState())
        expect(cc._reducer.isPopulated(root.getState())).toBeFalsy()
        //first time is not in redux, so is not fetched.
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        const obj = cc._reducer.getPopulated(root.getState())
        expect(cc._reducer.isPopulated(root.getState())).toBeFalsy()
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(obj[0].model[0].model!.id, 'id is not equal to id').toBe(2)
            expect(obj[0].model[0].model!.name, 'this should be undefined as not a fetched object').toBe(undefined)
        }
    })
    it('getItems is working', () => {
        let called_populated = false
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/generalResponse/':
                        called_populated = true
                        return this.respond(200, {}, JSON.stringify({
                            count: 100,
                            results: [{ id: 1 }, { id: 2 }]
                        }))
                }
            }
        }
        const s = Schema({
            id: { required: true, type: Number },
            name: [{ type: String, required: true }],

        });
        const tt = new Model(s, 'id', '/generalResponse', Schema({ count: Number, results: [{ type: s, required }] }), (el) => el.results, (el) => el.count, { trailingSlash: true })
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(tt._actions.fetchIfNeeded())
        expect(called_populated).toBeTruthy()
        const obj = tt._reducer.get(root.getState())
        const metadata = tt._reducer.getMetadata(root.getState())
        expect(obj.length).toBe(2)
        expect(metadata).toBe(100)
    })
    it('simple get populate is working', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/generalResponse':
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, model: 1 }
                        ]))
                    case '/populatedResponse/1':
                        return this.respond(200, {}, JSON.stringify({ id: 1, name: ['jose'] }))
                }
            }
        }
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const ss = new Model(s, 'id', '/populatedResponse')
        const cc = new Model(Schema({ id: { required: true, type: Number }, model: { type: ss, idOnly: true } }), 'id', '/generalResponse')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        //second call 
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        const obj = cc._reducer.getPopulated(root.getState())
        expect(cc._reducer.isPopulated(root.getState())).toBeTruthy()
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(obj.length).toBe(1)
            const first = obj[0]
            expect(first.id).toBe(1)
            expect(first.model, 'model is undefined?').not.toBe(undefined)
            expect(first.model!.id, 'expecting populate id').toBe(1)
            expect(Array.isArray(first.model!.name)).toBeTruthy()
        }
    })
    it('simple get populate is working with trailing slash', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/generalResponse/':
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, model: 1 }
                        ]))
                    case '/populatedResponse/1':
                        return this.respond(200, {}, JSON.stringify({ id: 1, name: ['jose'] }))
                }
            }
        }
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const ss = new Model(s, 'id', '/populatedResponse')
        const cc = new Model(Schema({ id: { required: true, type: Number }, model: { type: ss, idOnly: true } }), 'id', '/generalResponse', { trailingSlash: true })
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        //second call 
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        const obj = cc._reducer.getPopulated(root.getState())
        expect(cc._reducer.isPopulated(root.getState())).toBeTruthy()
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(obj.length).toBe(1)
            const first = obj[0]
            expect(first.id).toBe(1)
            expect(first.model, 'model is undefined?').not.toBe(undefined)
            expect(first.model!.id, 'expecting populate id').toBe(1)
            expect(Array.isArray(first.model!.name)).toBeTruthy()
        }
    })
    it('simple get with schema populate is working', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/generalResponse':
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, model: { model: 1 } }
                        ]))
                    case '/populatedResponse/1':
                        return this.respond(200, {}, JSON.stringify({ id: 1, name: ['jose'] }))
                }
            }
        }
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const ss = new Model(s, 'id', '/populatedResponse')
        const cc = new Model(Schema({ id: { required: true, type: Number }, model: Schema({ model: { type: ss, idOnly: true } }) }), 'id', '/generalResponse')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        const obj = cc._reducer.getPopulated(root.getState())
        expect(cc._reducer.isPopulated(root.getState())).toBeTruthy()
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(obj.length).toBe(1)
            const first = obj[0]
            expect(first.id).toBe(1)
            expect(first.model, 'model is undefined?').not.toBe(undefined)
            expect(first.model!.model, 'model is undefined?').not.toBe(undefined)
            expect(first.model!.model!.id, 'expecting populate id').toBe(1)
            expect(Array.isArray(first.model!.model!.name)).toBeTruthy()
        }
    })
    it('get populate of populate is working', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/generalResponse':
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, subType: { model: 1 } }
                        ]))
                    case '/populatedResponse/1':
                        return this.respond(200, {}, JSON.stringify({ id: 1, model: 2 }))
                    case '/populatedResponse2/2':
                        return this.respond(200, {}, JSON.stringify({ id: 2, name: ['jose'] }))
                }
            }
        }
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const tt = new Model(s, 'id', '/populatedResponse2')
        const ss = new Model(Schema({ id: { required: true, type: Number }, model: { type: tt, idOnly: true } }), 'id', '/populatedResponse')
        const cc = new Model(Schema({ id: { required: true, type: Number }, subType: { type: Schema({ model: { type: ss, idOnly: true } }), required } }), 'id', '/generalResponse')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        //first time is not in redux, so is not fetched.
        root.dispatch(cc._actions.fetchPopulatedIfNeeded())
        const obj = cc._reducer.getPopulated(root.getState())
        expect(cc._reducer.isPopulated(root.getState())).toBeTruthy()
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(obj.length).toBe(1)
            const first = obj[0]
            expect(first.id).toBe(1)
            expect(first.subType.model, 'model is undefined?').not.toBe(undefined)
            expect(first.subType.model!.model, 'model is undefined?').not.toBe(undefined)
            expect(first.subType.model!.model!.id, 'expecting populate id').toBe(2)
            expect(Array.isArray(first.subType.model!.model!.name)).toBeTruthy()
        }
    })
    it('get populate of populate is working on real case', (d) => {
        let called_faculty = false
        let called_level = false
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/user_has_level/':
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, name: 'test', levels: [{ faculty: 1, level: 1 }] }
                        ]))
                    case '/api/faculty/1/':
                        return setTimeout(() => {
                            called_faculty = true
                            this.respond(200, {}, JSON.stringify({ id: 1, name: 'e' }))
                        }, 20)
                    case '/api/level/1/':
                        return setTimeout(() => {
                            called_level = true
                            this.respond(200, {}, JSON.stringify({ id: 1, name: 'e' }))
                        }, 20)
                }
            }
        }
        const FacultySchema = Schema({
            id: { type: Number, required },
            name: { type: String, required }
        })


        const levelSchema = Schema({
            id: { type: Number, required },
            name: { type: String, required }
        })

        const Level = new Model(levelSchema, 'id', '/api/level', { trailingSlash: true })
        const Faculty = new Model(FacultySchema, 'id', '/api/faculty', { trailingSlash: true })
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const subUserHasLevelSchema = Schema({
            faculty: { type: Faculty, required: true, idOnly: true },
            faculty_name: String,
            level: { type: Level, required: true, idOnly: true },
            level_name: String
        })
        const UserHasLevelSchema = Schema({
            id: { type: Number, required },
            name: { type: String },
            levels: [{ type: subUserHasLevelSchema, required }]
        })

        const UserHasLevel = new Model(UserHasLevelSchema, 'id', '/api/user_has_level', { trailingSlash: true })
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(UserHasLevel._actions.fetchPopulatedIfNeeded())
        expect(UserHasLevel._reducer.isPopulated(root.getState())).toBeFalsy()
        root.dispatch(UserHasLevel._actions.fetchPopulatedIfNeeded())
        setTimeout(() => {
            expect(UserHasLevel._reducer.isPopulated(root.getState())).toBeTruthy()
            const obj = UserHasLevel._reducer.getPopulated(root.getState())
            expect(obj).not.toBe(null)
            if (obj !== null) {
                expect(obj.length).toBe(1)
                const first = obj[0]
                expect(first.id).toBe(1)
                expect(Array.isArray(first.levels)).toBeTruthy()
                d()
            }
        }, 30)
    })
    it('get populate of populate is working on real case', (d) => {
        let called_faculty = false
        let called_level = false
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/user_has_level/':
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, name: 'test', level: { faculty: 1, level: 1 } }
                        ]))
                    case '/api/faculty/1/':
                        return setTimeout(() => {
                            called_faculty = true
                            this.respond(200, {}, JSON.stringify({ id: 1, name: 'e' }))
                        }, 20)
                    case '/api/level/1/':
                        return setTimeout(() => {
                            called_level = true
                            this.respond(200, {}, JSON.stringify({ id: 1, name: 'e' }))
                        }, 20)
                }
            }
        }
        const FacultySchema = Schema({
            id: { type: Number, required },
            name: { type: String, required }
        })


        const levelSchema = Schema({
            id: { type: Number, required },
            name: { type: String, required }
        })

        const Level = new Model(levelSchema, 'id', '/api/level', { trailingSlash: true })
        const Faculty = new Model(FacultySchema, 'id', '/api/faculty', { trailingSlash: true })
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const subUserHasLevelSchema = Schema({
            faculty: { type: Faculty, required: true, idOnly: true },
            faculty_name: String,
            level: { type: Level, required: true, idOnly: true },
            level_name: String
        })
        const UserHasLevelSchema = Schema({
            id: { type: Number, required },
            name: { type: String },
            level: { type: subUserHasLevelSchema, required }
        })

        const UserHasLevel = new Model(UserHasLevelSchema, 'id', '/api/user_has_level', { trailingSlash: true })
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(UserHasLevel._actions.fetchPopulatedIfNeeded())
        expect(UserHasLevel._reducer.isPopulated(root.getState())).toBeFalsy()
        root.dispatch(UserHasLevel._actions.fetchPopulatedIfNeeded())
        setTimeout(() => {
            expect(UserHasLevel._reducer.isPopulated(root.getState())).toBeTruthy()
            const obj = UserHasLevel._reducer.getPopulated(root.getState())
            expect(obj).not.toBe(null)
            if (obj !== null) {
                expect(obj.length).toBe(1)
                const first = obj[0]
                expect(first.id).toBe(1)
                d()
            }
        }, 30)
    })
    it('get populate of populate is working on real case (autopopulated)', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/user_has_level/':
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, name: 'test', levels: [{ faculty: { id: 1, name: 'e' }, level: { id: 1, name: 'e' } }] }
                        ]))
                    case '/api/faculty/1/':
                        return this.respond(500, {}, JSON.stringify({ id: 1, name: 'e' }))
                    case '/api/level/1/':
                        return this.respond(500, {}, JSON.stringify({ id: 1, name: 'e' }))
                }
            }
        }
        const FacultySchema = Schema({
            id: { type: Number, required },
            name: { type: String, required }
        })


        const levelSchema = Schema({
            id: { type: Number, required },
            name: { type: String, required }
        })

        const Level = new Model(levelSchema, 'id', '/api/level', { trailingSlash: true })
        const Faculty = new Model(FacultySchema, 'id', '/api/faculty', { trailingSlash: true })
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const subUserHasLevelSchema = Schema({
            faculty: { type: Faculty, required: true, },
            faculty_name: String,
            level: { type: Level, required: true, },
            level_name: String
        })
        const UserHasLevelSchema = Schema({
            id: { type: Number, required },
            name: { type: String },
            levels: [{ type: subUserHasLevelSchema, required }]
        })

        const UserHasLevel = new Model(UserHasLevelSchema, 'id', '/api/user_has_level', { trailingSlash: true })
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(UserHasLevel._actions.fetchPopulatedIfNeeded())
        expect(UserHasLevel._reducer.isPopulated(root.getState())).toBeTruthy()
        const obj = UserHasLevel._reducer.getPopulated(root.getState())
        expect(obj).not.toBe(null)
        if (obj !== null) {
            expect(obj.length).toBe(1)
            const first = obj[0]
            expect(first.id).toBe(1)
            expect(Array.isArray(first.levels)).toBeTruthy()
        }
    })
    it('invalidate is working', () => {
        let called = 0
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/generalResponse':
                        called++
                        return this.respond(200, {}, JSON.stringify([
                            { id: 1, model: 1 }
                        ]))
                }
            }
        }
        const s = Schema({
            id: { required: true, type: Number, },
            name: [{ type: String, required: true }],

        });
        const cc = new Model(Schema({ id: { required: true, type: Number } }), 'id', '/generalResponse')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(cc._actions.fetchIfNeeded())
        root.dispatch(cc._actions.invalidateAll())
        root.dispatch(cc._actions.fetchIfNeeded())
        expect(called).toBe(2)
    })
    it('getItem without metadata and routeopts works', () => {

        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/example':
                        return this.respond(200, {}, JSON.stringify({
                            items: [
                                { id: 1, name: 'Book 1' }
                            ]
                        }))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: String,
        })
        const model = new Model(bookSchema, 'id', '/api/example', Schema({ items: [{ type: bookSchema, required: true }] }), d => d.items)
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchIfNeeded())
        expect(model._reducer.get(root.getState())[0].id).toBe(1)
        expect(model._reducer.getMetadata(root.getState())).toBe(null)
    })
    it('getItem without metadata but with routeopts works', () => {

        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/example/':
                        return this.respond(200, {}, JSON.stringify({
                            items: [
                                { id: 1, name: 'Book 1' }
                            ]
                        }))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: String,
        })
        const model = new Model(bookSchema, 'id', '/api/example', Schema({ items: [{ type: bookSchema, required: true }] }), d => d.items, { trailingSlash: true })
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchIfNeeded())
        expect(model._reducer.get(root.getState())[0].id).toBe(1)
        expect(model._reducer.getMetadata(root.getState())).toBe(null)
    })
    it('getItem with metadata and without routeopts works', () => {

        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/example':
                        return this.respond(200, {}, JSON.stringify({
                            items: [
                                { id: 1, name: 'Book 1' }
                            ]
                        }))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: String,
        })
        const model = new Model(bookSchema, 'id', '/api/example', Schema({ items: [{ type: bookSchema, required: true }] }), d => d.items, d => d.items.length)
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchIfNeeded())
        expect(model._reducer.get(root.getState())[0].id).toBe(1)
        expect(model._reducer.getMetadata(root.getState())).toBe(1)
    })
    it('getItem with metadata but with routeopts works', () => {

        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/example/':
                        return this.respond(200, {}, JSON.stringify({
                            items: [
                                { id: 1, name: 'Book 1' }
                            ]
                        }))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: String,
        })
        const model = new Model(bookSchema, 'id', '/api/example', Schema({ items: [{ type: bookSchema, required: true }] }), d => d.items, d => d.items.length, { trailingSlash: true })
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchIfNeeded())
        expect(model._reducer.get(root.getState())[0].id).toBe(1)
        expect(model._reducer.getMetadata(root.getState())).toBe(1)
    })
    it('getSubModel with key works', () => {

        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/example/Book 1':
                        return this.respond(200, {}, JSON.stringify({ id: 1, name: 'Book 1' }))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
        })
        const model = new Model(bookSchema, 'id', '/api/example').getSubModelWithKey('name')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchByIdIfNeeded('Book 1'))
        expect(model._reducer.getById(root.getState(), 'Book 1')!.id).toBe(1)
    })
    it('getSubModel root with key works', () => {

        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/example/Book 1':
                        return this.respond(200, {}, JSON.stringify({ id: 1, name: 'Book 1' }))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
        })
        const model = new Model(bookSchema, 'id', '/api/example').getSubModelWithKey('name')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchByIdIfNeeded('Book 1'))
        expect(model._reducer.getById(root.getState(), 'Book 1')!.id).toBe(1)
    })
    it('getSubModel with key and url works', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/example/Book 1':
                        return this.respond(200, {}, JSON.stringify({ id: 1, name: 'Book 1' }))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
        })
        const model = new Model(bookSchema, 'id', '/api/example').getSubModelWithKey('name', '/api/example')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchByIdIfNeeded('Book 1'))
        expect(model._reducer.getById(root.getState(), 'Book 1')!.id).toBe(1)
    })
    it('getSubModel root with key and url works', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/example/Book 1':
                        return this.respond(200, {}, JSON.stringify({ id: 1, name: 'Book 1' }))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
        })
        const model = new Model(bookSchema, 'id', '/api/example').getSubModelWithKey('name', '/api/example')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchByIdIfNeeded('Book 1'))
        expect(model._reducer.getById(root.getState(), 'Book 1')!.id).toBe(1)
    })
    it('getSubModel with key and opts works', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/example1/Book 1/':
                        return this.respond(200, {}, JSON.stringify({ id: 1, name: 'Book 1' }))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
        })
        const model = new Model(bookSchema, 'id', '/api/example', { trailingSlash: true }).getSubModelWithKey(Schema({ project: { type: String, required: true } }), 'name', opts => `/api/${opts.project}`)
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchByIdIfNeeded({ project: 'example1' }, 'Book 1'))
        expect(model._reducer.getById(root.getState(), 'Book 1')!.id).toBe(1)
    })
    it('getSubModel root with key and opts works', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/example1/Book 1/':
                        return this.respond(200, {}, JSON.stringify({ id: 1, name: 'Book 1' }))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
        })
        const model = new Model(bookSchema, 'id', '/api/example', { trailingSlash: true }).getSubModelWithKey(Schema({ project: { type: String, required: true } }), 'name', opts => `/api/${opts.project}`)
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchByIdIfNeeded({ project: 'example1' }, 'Book 1'))
        expect(model._reducer.getById(root.getState(), 'Book 1')!.id).toBe(1)
    })
    it('getSearchSubModel root works', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/new/submodel/':
                        return this.respond(200, {}, JSON.stringify([{ id: 1, name: 'Book 1' }]))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
        })
        const model = new Model(bookSchema, 'id', '/api/example', { trailingSlash: true }).getSearchSubModel('/new/submodel')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchIfNeeded())
        expect(model._reducer.get(root.getState())[0].id).toBe(1)
    })
    it('getSearchSubModel works', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/new/submodel/':
                        return this.respond(200, {}, JSON.stringify([{ id: 1, name: 'Book 1' }]))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
        })
        const model = new Model(bookSchema, 'id', '/api/example', { trailingSlash: true }).getSearchSubModel('/new/submodel')
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchIfNeeded())
        expect(model._reducer.get(root.getState())[0].id).toBe(1)
    })
    it('getSearchSubmodel with opts works', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/submodel1/':
                        return this.respond(200, {}, JSON.stringify([{ id: 1, name: 'Book 1' }]))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
        })
        const model = new Model(bookSchema, 'id', '/api/example', { trailingSlash: true }).getSearchSubModel(Schema({ project: { type: String, required: true } }), opts => `/api/${opts.project}`)
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchIfNeeded({ project: 'submodel1' }))
        expect(model._reducer.get({ project: 'submodel1' }, root.getState())[0].id).toBe(1)
    })
    it('getSearchSubmodel root with opts works', () => {
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/submodel1/':
                        return this.respond(200, {}, JSON.stringify([{ id: 1, name: 'Book 1' }]))
                }
            }
        }
        const bookSchema = Schema({
            id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
        })
        const model = new Model(bookSchema, 'id', '/api/example', { trailingSlash: true }).getSearchSubModel(Schema({ project: { type: String, required: true } }), opts => `/api/${opts.project}`)
        const root = createStore(ReducerStorage.generalReducer, {}, applyMiddleware(thunkMiddleware))
        root.dispatch(model._actions.fetchIfNeeded({ project: 'submodel1' }))
        expect(model._reducer.get({ project: 'submodel1' }, root.getState())[0].id).toBe(1)
    })
})