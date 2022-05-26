import * as fs from 'fs'
import { join } from 'path'

import System from 'Contracts/interfaces/System'

const systems: System[] = JSON.parse(
  fs.readFileSync(join(__dirname, '../../datas/populated-systems.json'), { encoding: 'utf8' })
)
export default systems
