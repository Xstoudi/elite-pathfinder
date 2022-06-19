import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import systems from 'App/Pathfinder/systems'
import runPathfinder from 'App/Pathfinder'

export default class PathfindersController {
  private pathRequestSchema = schema.create({
    from: schema.string([rules.systemName()]),
    to: schema.string([rules.systemName()]),
    range: schema.number([rules.range(10, 80)]),
  })

  public async index({ request, response }: HttpContextContract) {
    const { from, to, range } = await request.validate({ schema: this.pathRequestSchema })
    const source = systems.find((system) => system.name === from)
    const destination = systems.find((system) => system.name === to)

    if (!source || !destination) {
      return response.badRequest({ error: 'Source or destination not found.' })
    }

    try {
      const result = await runPathfinder({ source, destination, rangeSquared: range ** 2 })
      return response.send(result)
    } catch (err) {
      return response.badRequest({ error: err.message })
    }
  }

  public async dummy({ response }: HttpContextContract) {
    return response.send({
      message: 'Hello World',
    })
  }
}
