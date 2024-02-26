import React from 'react'

import * as Model from './model'
import Standard from '../Standard/Standard'

interface Props extends Model.Home {}

const Home: React.FC<Props> = props => <Standard {...props} />

export default Home
