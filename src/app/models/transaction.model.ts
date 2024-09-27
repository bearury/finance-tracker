export class TransactionModel {
  constructor(
    public readonly id: string,
    public readonly type: Types,
    public readonly category: Categories,
    public readonly amount: number,
    public readonly date: string,
    public readonly description: string | null
  ) {}
}

export const types = ['доход', 'расход'] as const;

export type Types = (typeof types)[number];

export const categories = [
  'Заработная плата',
  'Фриланс',
  'Инвестиции',
  'Коммунальные услуги',
  'Продукты',
  'Путешествия',
] as const;

export type Categories = (typeof categories)[number];
