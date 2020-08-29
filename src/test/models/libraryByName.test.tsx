import LibraryByName from './libraryByName'
import { LibraryType } from './libraryModel'
import React from 'react';
import { render } from '@testing-library/react';
import { getProvider } from '../../..'
declare var global: any
import FakeXMLHttpRequest from "fake-xml-http-request";

describe('getSubModelWithKey', () => {
    test('useGetById works', (d) => {
        function LibraryComponentGetById() {
            const result = LibraryByName.useGetById('pepita')
            return <React.Fragment>
                <p>{result.item?.name}</p>
            </React.Fragment>
        }
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/library/pepita/':
                        setTimeout(() => {
                            this.respond(200, {}, JSON.stringify({ id: 1, name: 'pepita' } as LibraryType))
                        }, 40)
                }
            }
        }
        const Provider = getProvider()
        const { getByText } = render(<Provider>
            <LibraryComponentGetById />
        </Provider>);
        setTimeout(() => {
            getByText(/pepita/i);
            d()
        }, 80)
    });

    test('useGetPopulatedById works', (d) => {
        function LibraryComponentGetByIdPopulated() {
            const result = LibraryByName.useGetByIdPopulated('pepita')
            return <React.Fragment>
                <p>{result.item?.name}</p>
            </React.Fragment>
        }
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/library/pepita/':
                        return setTimeout(() => {
                            this.respond(200, {}, JSON.stringify({ id: 1, name: 'pepita' } as LibraryType))
                        }, 10)
                }
            }
        }
        const Provider = getProvider()
        const { getByText } = render(<Provider>
            <LibraryComponentGetByIdPopulated />
        </Provider>);
        setTimeout(() => {
            getByText(/pepita/i);
            d()
        }, 80)
    });
})