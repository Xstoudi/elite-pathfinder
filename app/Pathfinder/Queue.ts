/**
 * TypeScript queue implementation for non-primitive objects.
 */
export default class Queue<T extends WithId> {
  private items: T[]

  constructor(...params: T[]) {
    this.items = [...params]
  }

  public enqueue(item: T) {
    this.items.push(item)
  }

  public dequeue() {
    return this.items.shift() || null
  }

  public has(item: T) {
    return this.items.find((findItem) => findItem.id === item.id) !== undefined
  }

  public getItems() {
    return this.items
  }
}
