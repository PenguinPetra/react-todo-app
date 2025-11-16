export type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  deadline: Date | null;
  method?: string; // 提出方法
  danger?: string; // 危険度
  time?: string;   // 課題にかかる時間
};
