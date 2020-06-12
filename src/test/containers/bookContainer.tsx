import React from 'react'

import bookModel from '../models/bookModel'

export default () => {
    const { loading, error, ...result } = bookModel.useGetPopulated()
    if (error) return <p>There are an error with the request</p>
    if (loading) return <p>Loading...</p>
    return <table>
        <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Library name</th>
            </tr>
        </thead>
        <tbody>
            {
                result.populated ?
                    result.items.map(i => <React.Fragment key={i.id}>
                        <td>{i.id}</td>
                        <td>{i.name}</td>
                        <td>{i.library.name}</td>
                    </React.Fragment>) :
                    result.items.map(i => <React.Fragment key={i.id}>
                        <td>{i.id}</td>
                        <td>{i.name}</td>
                        <td>{i.library.name ? i.library.name : 'Loading ...'}</td>
                    </React.Fragment>)
            }
        </tbody>
    </table>
}