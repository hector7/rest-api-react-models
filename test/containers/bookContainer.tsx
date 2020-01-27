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
    const { items } = bookModel.useGet()
    const { items: itemsPopulated, loading, error } = bookModel.useGetPopulated()
    const { item } = bookModel.useGetById(1)
    const { item: itemPopulated } = bookModel.useGetByIdPopulated(1)
    if (error) return <p>There are an error with the request</p>
    if (loading) return <p>Loading...</p>
    return <ul>
        {items.map(i => <BookView name={i.name} />)}
        {itemsPopulated.map(i => <BookView name={i.library!.name} />)}
        {< li > Item: {item!.name}</li>}
        {<li>Item populated: {itemPopulated!.library!.id}</li>}
    </ul>
}