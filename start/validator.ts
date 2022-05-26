import { validator } from '@ioc:Adonis/Core/Validator'

import systems from 'App/Pathfinder/systems'

const ruleName = 'systemName'

validator.rule(ruleName, (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  if (systems.findIndex((system) => system.name === value) === -1) {
    options.errorReporter.report(
      options.pointer,
      ruleName,
      `System "${value}" not found.`,
      options.arrayExpressionPointer
    )
  }
})
