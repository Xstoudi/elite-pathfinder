import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import systems from 'App/Pathfinder/systems'

export default class SystemsController {
  public async search({ request, response }: HttpContextContract) {
    const { query } = await request.validate({
      schema: schema.create({
        query: schema.string([rules.minLength(3)]),
      }),
    })

    return response.send({
      systems: systems.filter((system) => system.name.includes(query)).slice(0, 5),
    })
  }
}
