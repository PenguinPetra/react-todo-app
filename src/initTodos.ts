import type { Todo } from "./types";
import { v4 as uuid } from "uuid";

export const initTodos: Todo[] = [
  {
    id: uuid(),
    name: "解析2の宿題",
    isDone: false,
    deadline: new Date(2024, 10, 2, 17, 30),
    method: "Google Classroom",
    danger: "中",
    time: "1時間",
  },
  {
    id: uuid(),
    name: "TypeScriptの復習",
    isDone: true,
    deadline: null,
    method: "自習ノート",
    danger: "低",
    time: "30分",
  },
  {
    id: uuid(),
    name: "基礎物理学3の課題",
    isDone: false,
    deadline: new Date(2024, 10, 11, 23, 59),
    method: "紙提出",
    danger: "高",
    time: "2時間",
  },
];
