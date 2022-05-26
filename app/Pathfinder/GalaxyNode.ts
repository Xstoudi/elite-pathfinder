import System from 'Contracts/interfaces/System'

/**
 * Node class of the GalaxyGraph. Carry the cost and the informations about last visited node.
 */
export default class GalaxyNode {
  private value: System
  private adjacents: GalaxyNode[]
  private cost: number | null = null
  private cameFrom: GalaxyNode | null = null

  constructor(value: System) {
    this.value = value
    this.adjacents = []
  }

  public addAdjacent(node: GalaxyNode) {
    this.adjacents.push(node)
  }

  public removeAdjacent(node: GalaxyNode) {
    const index = this.adjacents.indexOf(node)
    if (index > -1) {
      this.adjacents.splice(index, 1)
      return node
    }
  }

  public getAdjacents() {
    return this.adjacents
  }

  public isAdjacent(node: GalaxyNode) {
    return this.adjacents.includes(node)
  }

  public getValue() {
    return this.value
  }

  public getCost() {
    return this.cost
  }

  public setCost(cost: number) {
    this.cost = cost
  }

  public getCameFrom() {
    return this.cameFrom
  }
  public setCameFrom(node: GalaxyNode) {
    this.cameFrom = node
  }
}
