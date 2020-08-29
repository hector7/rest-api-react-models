import bookModelOtherUrl from './bookModelOtherUrlExtended'
import { BookType } from './bookModel'
import React from 'react';
import { render } from '@testing-library/react';
import { getProvider } from '../../..'
declare var global: any
import FakeXMLHttpRequest from "fake-xml-http-request";

describe('getSearchSubmodelExtended', () => {
    test('useGet works', (d) => {
        function LibraryComponentGet() {
            const result = bookModelOtherUrl.useGet({ project: 'test' })
            return <React.Fragment>
                {result.items.map(i => <p key={i.id}>{i.name}</p>)}
            </React.Fragment>
        }
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/extended/test':
                        setTimeout(() => {
                            this.respond(200, {}, JSON.stringify([{ id: 1, name: 'pepita', library: 1 }] as BookType[]))
                        }, 40)
                }
            }
        }
        const Provider = getProvider()
        const { getByText } = render(<Provider>
            <LibraryComponentGet />
        </Provider>);
        setTimeout(() => {
            getByText(/pepita/i);
            d()
        }, 60)
    });

    test('useGetPopulated works', (d) => {
        function LibraryComponentGetPopulated() {
            const result = bookModelOtherUrl.useGetPopulated({ project: 'test' })
            return <React.Fragment>
                {result.populated && result.items.map(i => <p key={i.id}>{i.library.name}</p>)}
                {!result.populated && result.items.map(i => <p key={i.id}>{i.library.name}</p>)}
            </React.Fragment>
        }
        global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
            send() {
                switch (this.responseURL) {
                    case '/api/extended/test':
                        return setTimeout(() => {
                            this.respond(200, {}, JSON.stringify([{ id: 1, name: 'book', library: 1 }] as BookType[]))
                        }, 10)
                    case '/api/library/1/':
                        return setTimeout(() => {
                            this.respond(200, {}, JSON.stringify({ id: 1, name: 'book' } as BookType))
                        }, 10)
                }
            }
        }
        const Provider = getProvider()
        const { getByText, container } = render(<Provider>
            <LibraryComponentGetPopulated />
        </Provider>);
        setTimeout(() => {
            getByText(/book/i);
            d()
        }, 60)
    });
})
