import fs from 'fs'
import fsP from 'fs/promises'
import readline from 'readline'

import prettyBytes from 'pretty-bytes'
import { BaseCommand } from '@adonisjs/core/build/standalone'

import System from 'Contracts/interfaces/System'

export default class GenerateSample extends BaseCommand {
  public static commandName = 'generate:sample'
  public static description = 'Extract population sample from csv file.'
  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run() {
    const populatedSystems: System[] = []

    await new Promise<void>((resolve) => {
      const file = readline.createInterface({
        input: fs.createReadStream('datas/systems.csv'),
        output: process.stdout,
        terminal: false,
      })

      const spinner = this.logger.await('Extracting sample...')
      file.on('line', (line) => {
        const [id, , name, x, y, z, , isPopulated] = line.split(',')
        if (isPopulated === '1') {
          populatedSystems.push({
            id: Number(id),
            //@ts-expect-error
            name: name.replaceAll('"', ''),
            x: Number(x),
            y: Number(y),
            z: Number(z),
          })
        }
      })

      file.on('close', () => {
        spinner.stop()
        this.logger.success(`Extracted ${populatedSystems.length} systems.`)
        resolve()
      })
    })

    const spinner = this.logger.await('Writing sample...')
    await fsP.writeFile('datas/populated-systems.json', JSON.stringify(populatedSystems), {
      encoding: 'utf8',
    })
    const { size } = await fsP.stat('datas/populated-systems.json')
    spinner.stop()
    this.logger.success(`Wrote ${prettyBytes(size)}.`)
  }
}
