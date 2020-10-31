import { createAction } from ".."

describe('index test', () => {
    it('createAction(type)', () => {
        const action = createAction('EEE')
        expect(action.type).toBe('EEE')
        expect(Object.keys(action).length).toBe(1)
    })
    it('createAction(type, payload)', () => {
        const action = createAction('EEE', { jeje: 1 })
        expect(action.type).toBe('EEE')
        expect(Object.keys(action).length).toBe(2)
        expect(action.jeje).toBe(1)
    })
})