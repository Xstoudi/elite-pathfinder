import { BaseCommand } from '@adonisjs/core/build/standalone'
import axios from 'axios'
import { createWriteStream } from 'fs'
import { Readable } from 'stream'
import pEvent from 'p-event'
import prettyBytes from 'pretty-bytes'

export default class FetchSystems extends BaseCommand {
  public static SYSTEMS_URL = 'https://eddb.io/archive/v6/systems.csv'
  public static commandName = 'fetch:systems'
  public static description = ''
  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  private getProgressBar(currentPercentage: number) {
    /**
     * Draw one cell for almost every 3%. This is to ensure the
     * progress bar renders fine on smaller terminal width
     */
    const completed = Math.ceil(currentPercentage / 3)
    const incomplete = Math.ceil((100 - currentPercentage) / 3)
    return `[${new Array(completed).join('=')}${new Array(incomplete).join(' ')}]`
  }

  public async run() {
    this.logger.info('Fetching systems...')
    const response = await axios.get(FetchSystems.SYSTEMS_URL, {
      responseType: 'stream',
      decompress: true,
    })

    // track download progression
    const totalSize = parseInt(response.headers['content-length'])
    let downloadedSize = 0

    const trackerInterval = setInterval(() => {
      const progressPercentage = (downloadedSize / totalSize) * 100
      this.logger.logUpdate(
        `downloading ${this.getProgressBar(progressPercentage)} ${progressPercentage.toFixed(2)}%`
      )
    }, 200)

    const responseReadable: Readable = response.data
    responseReadable.on('data', (chunk) => {
      downloadedSize += chunk.length
    })
    responseReadable.pipe(createWriteStream('datas/systems.csv'))
    await pEvent(responseReadable, 'end', { rejectionEvents: ['error'] })

    clearInterval(trackerInterval)
    this.logger.logUpdatePersist()
    this.logger.success(`Successfully downloaded systems. Wrote ${prettyBytes(totalSize)}.`)
  }
}
