import Book, { BookType } from './bookModel'
import React from 'react';
import { render } from '@testing-library/react';
import { getProvider } from '../../..'
declare var global: any
import FakeXMLHttpRequest from "fake-xml-http-request";

test('useGet works', (d) => {
    function LibraryComponentGet() {
        const result = Book.useGet()
        return <React.Fragment>
            {result.items.map(i => <p key={i.id}>{i.name}</p>)}
        </React.Fragment>
    }
    global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
        send() {
            switch (this.responseURL) {
                case '/api/example':
                    setTimeout(() => {
                        this.respond(200, {}, JSON.stringify([{ id: 1, name: 'book', library: 1 }] as BookType[]))
                    }, 40)
            }
        }
    }
    const Provider = getProvider()
    const { getByText } = render(<Provider>
        <LibraryComponentGet />
    </Provider>);
    setTimeout(() => {
        getByText(/book/i);
        d()
    }, 60)
});
test('useGetById works', (d) => {
    function LibraryComponentGetById() {
        const result = Book.useGetById(1)
        return <React.Fragment>
            <p>{result.item?.name}</p>
        </React.Fragment>
    }
    global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
        send() {
            switch (this.responseURL) {
                case '/api/example/1':
                    setTimeout(() => {
                        this.respond(200, {}, JSON.stringify({ id: 1, name: 'book', library: 1 } as BookType))
                    }, 40)
            }
        }
    }
    const Provider = getProvider()
    const { getByText } = render(<Provider>
        <LibraryComponentGetById />
    </Provider>);
    setTimeout(() => {
        getByText(/book/i);
        d()
    }, 60)
});
test('useGetPopulated works', (d) => {
    function LibraryComponentGetPopulated() {
        const result = Book.useGetPopulated()
        return <React.Fragment>
            {result.populated && result.items.map(i => <p key={i.id}>{i.library?.name}</p>)}
            {!result.populated && result.items.map(i => <p key={i.id}>{i.library?.name}</p>)}
        </React.Fragment>
    }
    global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
        send() {
            switch (this.responseURL) {
                case '/api/example':
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
test('useGetPopulated works with idOnly and nullable', (d) => {
    function LibraryComponentGetPopulated() {
        const result = Book.useGetPopulated()
        return <React.Fragment>
            {result.populated && result.items.map(i => <p key={i.id}>{i.library?.name ?? 'nullable'}</p>)}
            {!result.populated && result.items.map(i => <p key={i.id}>{i.library?.name ?? 'nullable'}</p>)}
        </React.Fragment>
    }
    global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
        send() {
            switch (this.responseURL) {
                case '/api/example':
                    return setTimeout(() => {
                        this.respond(200, {}, JSON.stringify([{ id: 1, name: 'book', library: null }] as BookType[]))
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
        getByText(/nullable/i);
        d()
    }, 60)
});
test('useGetPopulatedById works', (d) => {
    function LibraryComponentGetByIdPopulated() {
        const result = Book.useGetByIdPopulated(1)
        return <p>{result.item?.library?.name}</p>
    }
    global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
        send() {
            switch (this.responseURL) {
                case '/api/example/1':
                    return setTimeout(() => {
                        this.respond(200, {}, JSON.stringify({ id: 1, name: 'book', library: 1 } as BookType))
                    }, 40)
                case '/api/library/1/':
                    return setTimeout(() => {
                        this.respond(200, {}, JSON.stringify({ id: 1, name: 'book' } as BookType))
                    }, 10)
            }
        }
    }
    const Provider = getProvider()
    const { getByText } = render(<Provider>
        <LibraryComponentGetByIdPopulated />
    </Provider>);
    setTimeout(() => {
        getByText(/book/i);
        d()
    }, 60)
});

test('useGetPopulatedById with idOnly nullable and null works', (d) => {
    function LibraryComponentGetByIdPopulated() {
        const result = Book.useGetByIdPopulated(1)
        return <p>{result.item?.library?.name ?? 'nullable'}</p>
    }
    global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
        send() {
            switch (this.responseURL) {
                case '/api/example/1':
                    return setTimeout(() => {
                        this.respond(200, {}, JSON.stringify({ id: 1, name: 'book', library: null } as BookType))
                    }, 40)
                case '/api/library/1/':
                    return setTimeout(() => {
                        this.respond(200, {}, JSON.stringify({ id: 1, name: 'book' } as BookType))
                    }, 10)
            }
        }
    }
    const Provider = getProvider()
    const { getByText } = render(<Provider>
        <LibraryComponentGetByIdPopulated />
    </Provider>);
    setTimeout(() => {
        getByText(/nullable/i);
        d()
    }, 60)
});
