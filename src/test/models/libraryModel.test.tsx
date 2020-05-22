import Library from './libraryModel'
import React from 'react';
import { render } from '@testing-library/react';
import { getProvider } from '../../..'
declare var global: any
import FakeXMLHttpRequest from "fake-xml-http-request";
function LibraryComponentGet() {
    const libraries = Library.useGet()
    return <React.Fragment>
        {libraries.items.map(i => <p key={i.id}>{i.name}</p>)}
    </React.Fragment>
}

test('renders learn react link', () => {
    global.XMLHttpRequest = class XMLHttpRequest extends FakeXMLHttpRequest {
        send() {
            switch (this.responseURL) {
                case '/api/library':
                    return this.respond(500, {}, 'trailing slash ignored')
                case '/api/library/':
                    return this.respond(200, {}, JSON.stringify({ count: 1, results: [{ id: 1, name: 'olivia' }] }))
            }
        }
    }
    const Provider = getProvider()
    const { getByText } = render(<Provider>
        <LibraryComponentGet />
    </Provider>);
    const linkElement = getByText(/olivia/i);
});
