export type BunnyState = 'trapped' | 'breaking' | 'dancing' | 'roaming';

export interface Task {
  id: string;
  label: string;
  state: BunnyState;
  createdAt: number;
}
