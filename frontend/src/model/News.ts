import { ObjectId } from 'mongodb'

export default class News {
  constructor(
    public _id: ObjectId,
    public id: string,
    public id_hash: number,
    public title: string,
    public link: string,
    public emotion: string,
    public published: string
  ) {}
}
