import { useState, useEffect } from "react";
import type { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Confetti from "./Confetti"; 
import goodstamp from "./goodstanp.jpg";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");

  // 危険度・提出方法・時間を管理
  const [newTodoMethod, setNewTodoMethod] = useState("");
  const [newTodoDanger, setNewTodoDanger] = useState("");
  const [newTodoTime, setNewTodoTime] = useState("");

  const [initialized, setInitialized] = useState(false);
  const localStorageKey = "TodoApp";

  // 🌸 花吹雪アニメーション状態管理
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");

  // 初期化処理
  useEffect(() => {
    const todoJsonStr = localStorage.getItem(localStorageKey);
    if (todoJsonStr && todoJsonStr !== "[]") {
      const storedTodos: Todo[] = JSON.parse(todoJsonStr);
      const convertedTodos = storedTodos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(convertedTodos);
    } else {
      setTodos(initTodos);
    }
    setInitialized(true);
  }, []);

  // ローカルストレージ更新
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const uncompletedCount = todos.filter((todo: Todo) => !todo.isDone).length;

  // ✅ 完了状態更新（花吹雪機能付き）
  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isDone: value } : todo
    );
    setTodos(updatedTodos);

    if (value) {
      setMessage("やるじゃん！");
      setShowConfetti(true);
    }
  };

  // ✏️ 編集機能
  const updateTodo = (updated: Todo) => {
    const newList = todos.map((t) => (t.id === updated.id ? updated : t));
    setTodos(newList);
  };

  // 削除処理
  const remove = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 入力バリデーション
  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  // 入力更新
  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  // 期限更新
  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value;
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  // 新規タスク追加
  const addNewTodo = () => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }

    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      deadline: newTodoDeadline,
      method: newTodoMethod,
      danger: newTodoDanger,
      time: newTodoTime,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);

    // 入力欄リセット
    setNewTodoName("");
    setNewTodoDeadline(null);
    setNewTodoMethod("");
    setNewTodoDanger("");
    setNewTodoTime("");
  };

  // 完了済み削除
  const removeCompletedTodos = () => {
    setTodos(todos.filter((todo) => !todo.isDone));
  };

  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto font-hand relative overflow-hidden">
      {/* 🌸 花吹雪アニメーション */}
      {showConfetti && (
        <>
          <Confetti onEnd={() => setShowConfetti(false)} />
          <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-50 animate-bounce">
            <span className="text-5xl font-bold text-pink-500 mb-2">{message}</span>
            <img
              src={goodstamp}
              alt="Good Job!"
              className="w-40 h-auto drop-shadow-lg"
            />
          </div>
        </>
      )}

      <h1 className="text-4xl mb-4 text-center font-bold">To Do リスト</h1>
      <p className="text-center text-lg mb-1">
        こんにちは、PenguinPetraさん。今日も一日がんばろう!
      </p>
      <p className="text-center mb-8">
        未達成のタスクが「{uncompletedCount}」コあるよ。
      </p>

      <TodoList
        todos={todos}
        updateIsDone={updateIsDone}
        updateTodo={updateTodo} // ✏️ 編集機能追加
        remove={remove}
      />

      {/* 新規タスク追加フォーム */}
      <div className="mt-10 space-y-3 rounded-3xl border-2 border-green-900 bg-green-50 p-5 shadow-md">
        <h2 className="text-lg font-bold">新しいタスクの追加</h2>

        {/* タスク名 */}
        <div className="flex items-center space-x-2">
          <label className="font-bold w-20" htmlFor="newTodoName">
            名前
          </label>
          <input
            id="newTodoName"
            type="text"
            value={newTodoName}
            onChange={updateNewTodoName}
            className={twMerge(
              "grow rounded-md border p-2",
              newTodoNameError && "border-red-500 outline-red-500"
            )}
            placeholder="2文字以上、32文字以内で入力してください"
          />
        </div>

        {newTodoNameError && (
          <div className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mr-0.5" />
            <div>{newTodoNameError}</div>
          </div>
        )}

        {/* 期限 */}
        <div className="flex items-center gap-x-2">
          <label htmlFor="deadline" className="font-bold w-20">
            期限
          </label>
          <input
            type="datetime-local"
            id="deadline"
            value={
              newTodoDeadline
                ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                : ""
            }
            onChange={updateDeadline}
            className="rounded-md border border-gray-400 px-2 py-0.5"
          />
        </div>

        {/* 提出方法 */}
        <div className="flex items-center space-x-2">
          <label className="font-bold w-20" htmlFor="newTodoMethod">
            提出方法
          </label>
          <input
            id="newTodoMethod"
            type="text"
            value={newTodoMethod}
            onChange={(e) => setNewTodoMethod(e.target.value)}
            className="rounded-md border p-2 grow"
            placeholder="例：Google Classroom"
          />
        </div>

        {/* 危険度 */}
        <div className="flex items-center space-x-2">
          <label className="font-bold w-20" htmlFor="newTodoDanger">
            危険度
          </label>
          <input
            id="newTodoDanger"
            type="text"
            value={newTodoDanger}
            onChange={(e) => setNewTodoDanger(e.target.value)}
            className="rounded-md border p-2 grow"
            placeholder="例：高 / 中 / 低"
          />
        </div>

        {/* 課題時間 */}
        <div className="flex items-center space-x-2">
          <label className="font-bold w-20" htmlFor="newTodoTime">
            時間
          </label>
          <input
            id="newTodoTime"
            type="text"
            value={newTodoTime}
            onChange={(e) => setNewTodoTime(e.target.value)}
            className="rounded-md border p-2 grow"
            placeholder="例：30分、1時間など"
          />
        </div>

        <button
          type="button"
          onClick={addNewTodo}
          className={twMerge(
            "rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600",
            newTodoNameError && "cursor-not-allowed opacity-50"
          )}
        >
          追加
        </button>
      </div>

      <button
        type="button"
        onClick={removeCompletedTodos}
        className="mt-5 rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
      >
        完了済みのタスクを消去
      </button>
    </div>
  );
};

export default App;
