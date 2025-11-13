import React from "react";
import TodoItem from "./TodoItem";
import type { Todo } from "./types";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  updateTodo: (updated: Todo) => void; // ← これを追加！
  remove: (id: string) => void;
};

const TodoList = ({ todos, updateIsDone, updateTodo, remove }: Props) => {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          updateIsDone={updateIsDone}
          updateTodo={updateTodo} // ← 渡す
          remove={remove}
        />
      ))}
    </div>
  );
};

export default TodoList;
