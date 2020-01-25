import React from 'react'

import bookModel from '../models/bookModel'
import BookView from '../views/bookView'
import { HttpError } from '@rest-api/redux'

class BookContainer extends React.Component<{ error: HttpError | null, loading: boolean, items: { id: number, name?: string }[] }>{
    render() {
        const { items, loading, error } = this.props
        if (error) return <p>There are an error with the request</p>
        if (loading) return <p>Loading...</p>
        return <ul>{
            items.map(i => <BookView name={i.name} />)
        }</ul>
    }
}
bookModel.connectGet()(BookContainer)

const bookContainer: React.FC<{}> = () => {
    const { items, loading, error } = bookModel.useGet()
    if (error) return <p>There are an error with the request</p>
    if (loading) return <p>Loading...</p>
    return <ul>{
        items.map(i => <BookView name={i.name} />)
    }</ul>
}