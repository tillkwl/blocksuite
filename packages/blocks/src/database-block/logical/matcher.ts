import type { TType } from './typesystem.js';
import { typesystem } from './typesystem.js';

type MatcherData<Data, Type extends TType = TType> = { type: Type; data: Data };

export class Matcher<Data, Type extends TType = TType> {
  private list: MatcherData<Data, Type>[] = [];

  constructor(private _match?: (type: TType, target: TType) => boolean) {}

  register(type: Type, data: Data) {
    this.list.push({ type, data });
  }

  match(type: TType) {
    const match = this._match ?? typesystem.isSubtype.bind(typesystem);
    for (const t of this.list) {
      if (match(t.type, type)) {
        return t.data;
      }
    }
    return;
  }

  allMatched(type: TType): MatcherData<Data>[] {
    const match = this._match ?? typesystem.isSubtype.bind(typesystem);
    const result: MatcherData<Data>[] = [];
    for (const t of this.list) {
      if (match(t.type, type)) {
        result.push(t);
      }
    }
    return result;
  }

  allMatchedData(type: TType): Data[] {
    const match = this._match ?? typesystem.isSubtype.bind(typesystem);
    const result: Data[] = [];
    for (const t of this.list) {
      if (match(t.type, type)) {
        result.push(t.data);
      }
    }
    return result;
  }

  findData(f: (data: Data) => boolean): Data | undefined {
    return this.list.find(data => f(data.data))?.data;
  }

  find(
    f: (data: MatcherData<Data, Type>) => boolean
  ): MatcherData<Data, Type> | undefined {
    return this.list.find(f);
  }

  all(): MatcherData<Data, Type>[] {
    return this.list;
  }
}
