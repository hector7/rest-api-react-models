import React from 'react'

import bookModel from '../models/bookModel'
import BookView from '../views/bookView'
import { HttpError } from '@rest-api/redux'

const bookContainer: React.FC<{}> = () => {
    const { items } = bookModel.useGet()
    const { loading, error, ...r } = bookModel.useGetPopulated()
    const { item } = bookModel.useGetById(1)
    const { ...result } = bookModel.useGetByIdPopulated(1)
    if (error) return <p>There are an error with the request</p>
    if (loading) return <p>Loading...</p>
    return <ul>
        {items.map(i => <BookView name={i.name} />)}
        {r.populated ? r.items.map(i => <BookView name={i.library.name} />) : null}
        {< li > Item: {item!.name}</li>}
        {result.item && <li>Item populated: {result.item.library.name}</li>}
    </ul>
}