import { expose, util } from '@chainlink/ea-bootstrap'
import { execute } from './adapter'

const NAME = 'chainlonk'

console.log(">>>>>>>>>>>>>>>>>>>>>>>AAAAAAAAAAAA\n")
export = { NAME, execute, ...expose(util.wrapExecute(execute)) }
