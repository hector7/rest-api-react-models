import Book, { BookType } from './bookModel'
import React from 'react';
import { render } from '@testing-library/react';
import { getProvider } from '../../..'
declare var global: any
import FakeXMLHttpRequest from "fake-xml-http-request";
function LibraryComponentGet() {
    const libraries = Book.useGet()
    return <React.Fragment>
        {libraries.items.map(i => <p key={i.id}>{i.name}</p>)}
    </React.Fragment>
}

test('renders learn react link', (d) => {
    global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
        send() {
            switch (this.responseURL) {
                case '/api/example':
                    setTimeout(()=>{
                    this.respond(200, {}, JSON.stringify([{ id: 1, name: 'book', library: 1 }] as BookType[]))
                    }, 40)
            }
        }
    }
    const Provider = getProvider()
    const { getByText } = render(<Provider>
        <LibraryComponentGet />
    </Provider>);
    setTimeout(()=>{
        const linkElement = getByText(/book/i);
        d()
    }, 60)
});
