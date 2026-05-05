export type BunnyState = 'trapped' | 'breaking' | 'dancing' | 'interactive' | 'roaming';

export interface Task {
  id: string;
  label: string;
  state: BunnyState;
  createdAt: number;
}
