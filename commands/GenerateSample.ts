import fs, { existsSync } from 'fs'
import fsP from 'fs/promises'
import readline from 'readline'

import prettyBytes from 'pretty-bytes'
import { BaseCommand } from '@adonisjs/core/build/standalone'

import System from 'Contracts/interfaces/System'

const MAX_DISTANCE_FROM_ORIGIN = 100

export default class GenerateSample extends BaseCommand {
  public static commandName = 'generate:sample'
  public static description = 'Extract population sample from csv file.'
  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run() {
    if (!existsSync('datas/systems.csv')) {
      await this.kernel.exec('fetch:systems', [])
    }

    const populatedSystems: System[] = []

    await new Promise<void>((resolve) => {
      const file = readline.createInterface({
        input: fs.createReadStream('datas/systems.csv'),
        output: process.stdout,
        terminal: false,
      })

      const spinner = this.logger.await('Extracting sample')
      file.on('line', (line) => {
        const [id, , name, x, y, z, , isPopulated] = line.split(',')
        const nX = Number(x)
        const nY = Number(y)
        const nZ = Number(z)
        if (nX ** 2 + nY ** 2 + nZ ** 2 < MAX_DISTANCE_FROM_ORIGIN ** 2) {
          populatedSystems.push({
            id: Number(id),
            //@ts-expect-error
            name: name.replaceAll('"', ''),
            x: nX,
            y: nY,
            z: nZ,
          })
        }
      })

      file.on('close', () => {
        spinner.stop()
        this.logger.success(`Extracted ${populatedSystems.length} systems.`)
        resolve()
      })
    })

    const spinner = this.logger.await('Writing sample')
    await fsP.writeFile('datas/populated-systems.json', JSON.stringify(populatedSystems), {
      encoding: 'utf8',
    })
    const { size } = await fsP.stat('datas/populated-systems.json')
    spinner.stop()
    this.logger.success(`Wrote ${prettyBytes(size)}.`)
  }
}
