import React from 'react'

export default ({ name }: { name?: string }) => <li>{name === undefined ? name : 'Without name.'}</li>