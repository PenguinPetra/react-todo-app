import { useState, useEffect } from "react";
import type { Todo } from "./types";
import { initTodos } from "./initTodos";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Confetti from "./Confetti";
import Stars from "./Stars";
import goodstamp from "./goodstamp.jpg";
import stampSound from "./stamp-sound.mp3";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [newTodoMethod, setNewTodoMethod] = useState("");
  const [newTodoDanger, setNewTodoDanger] = useState("");
  const [newTodoTime, setNewTodoTime] = useState("");
  const [newTodoTimeError, setNewTodoTimeError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");
  const localStorageKey = "TodoApp";

  const [sortKey, setSortKey] = useState<"deadline" | "danger" | "time">("deadline");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sound = new Audio(stampSound);

  const validateTimeInput = (value: string) => {
    if (value === "") return "";
    return /^\d+$/.test(value) ? "" : "数字のみ入力してください（例：30）";
  };

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

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isDone: value } : todo
    );
    setTodos(updatedTodos);

    if (value) {
      setMessage("やるじゃん！");
      setShowConfetti(true);

      setTimeout(() => {
        sound.currentTime = 0;
        sound.play();
      }, 300);
    }
  };

  const updateTodo = (updated: Todo) => {
    const newList = todos.map((t) => (t.id === updated.id ? updated : t));
    setTodos(newList);
  };

  const remove = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  const updateNewTodoTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTodoTime(value);
    setNewTodoTimeError(validateTimeInput(value));
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value;
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const addNewTodo = () => {
    const err = isValidTodoName(newTodoName);
    if (err) {
      setNewTodoNameError(err);
      return;
    }
    if (newTodoTimeError) return;

    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      deadline: newTodoDeadline,
      method: newTodoMethod,
      danger: newTodoDanger,
      time: newTodoTime,
    };

    setTodos([...todos, newTodo]);

    setNewTodoName("");
    setNewTodoDeadline(null);
    setNewTodoMethod("");
    setNewTodoDanger("");
    setNewTodoTime("");
  };

  const removeCompletedTodos = () => {
    setTodos(todos.filter((todo) => !todo.isDone));
  };

  const uncompletedCount = todos.filter((todo: Todo) => !todo.isDone).length;

  const sortedTodos = [...todos].sort((a, b) => {
    let aValue: number = 0;
    let bValue: number = 0;

    if (sortKey === "deadline") {
      aValue = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      bValue = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    } else if (sortKey === "danger") {
      const dangerRank: Record<string, number> = {
        "朝飯前": 1,
        "簡単": 2,
        "ふつう": 3,
        "難しい": 4,
        "自分では解決できない": 5,
      };
      aValue = dangerRank[a.danger || ""] ?? 0;
      bValue = dangerRank[b.danger || ""] ?? 0;
    } else if (sortKey === "time") {
      const extractNumber = (str?: string) => {
        if (!str) return Infinity;
        const m = str.match(/(\d+)/);
        return m ? parseInt(m[1], 10) : Infinity;
      };
      aValue = extractNumber(a.time);
      bValue = extractNumber(b.time);
    }
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="relative min-h-screen text-white font-hand overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-linear-to-b from-[#1b2e6d] via-[#30458e] to-[#4a6ab5]" />
      <Stars />

      {/* 🎉 完了演出 */}
      {showConfetti && (
        <>
          <Confetti onEnd={() => setShowConfetti(false)} />
          <AnimatePresence>
            <motion.div
              key="yay"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="fixed top-1/3 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-50"
            >
              <motion.span className="text-5xl font-bold text-pink-400 mb-2 font-hand">
                {message}
              </motion.span>
              <motion.img
                src={goodstamp}
                alt="Good Job!"
                className="w-40 h-auto drop-shadow-xl"
                initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                animate={{ opacity: 1, scale: [0.6, 1.2, 1], rotate: [15, 0, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              />
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {/* メインUI */}
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          To Do リスト
        </h1>
        <p className="text-center mb-8">
          未達成のタスクが「{uncompletedCount}」コあるよ。
        </p>

        {/* 並び替え */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <label className="font-bold">並び替え：</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as "deadline" | "danger" | "time")}
            className="rounded-md p-1 text-black bg-white"
          >
            <option value="deadline">提出期限順</option>
            <option value="danger">危険度順</option>
            <option value="time">課題にかかる時間順</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="rounded-md p-1 text-black bg-white"
          >
            <option value="asc">昇順</option>
            <option value="desc">降順</option>
          </select>
        </div>

        {/* タスクリスト */}
        <TodoList todos={sortedTodos} updateIsDone={updateIsDone} updateTodo={updateTodo} remove={remove} />

        {/* 新規追加フォーム */}
        <div className="mt-8 space-y-4 rounded-3xl border-2 border-green-700 bg-green-100/90 p-5 shadow-md">
          <h2 className="text-lg font-bold text-black text-center">新しいタスクの追加</h2>

          {/* 課題名 */}
          <div>
            <label className="font-bold text-black block mb-1">課題</label>
            <input
              type="text"
              value={newTodoName}
              onChange={updateNewTodoName}
              className={twMerge(
                "w-full rounded-md border p-2 text-black",
                newTodoNameError && "border-red-500 outline-red-500"
              )}
              placeholder="例：レポートまとめ"
            />
          </div>

          {newTodoNameError && (
            <p className="text-red-500 text-sm font-bold flex items-center">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
              {newTodoNameError}
            </p>
          )}

          {/* 提出期限 */}
          <div>
            <label className="font-bold text-black block mb-1">提出期限</label>
            <input
              type="datetime-local"
              value={newTodoDeadline ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss") : ""}
              onChange={updateDeadline}
              className="w-full rounded-md border p-2 text-black"
            />
          </div>

          {/* 提出方法 */}
          <div>
            <label className="font-bold text-black block mb-1">提出方法</label>
            <input
              type="text"
              value={newTodoMethod}
              onChange={(e) => setNewTodoMethod(e.target.value)}
              className="w-full rounded-md border p-2 text-black"
              placeholder="例：Classroom"
            />
          </div>

          {/* 危険度 */}
          <div>
            <label className="font-bold text-black block mb-1">危険度</label>
            <select
              value={newTodoDanger}
              onChange={(e) => setNewTodoDanger(e.target.value)}
              className="w-full rounded-md border p-2 text-black"
            >
              <option value="">選んでね</option>
              <option value="朝飯前">朝飯前</option>
              <option value="簡単">簡単</option>
              <option value="ふつう">ふつう</option>
              <option value="難しい">難しい</option>
              <option value="自分では解決できない">自分では解決できない</option>
            </select>
          </div>

          {/* 時間 */}
          <div>
            <label className="font-bold text-black block mb-1">課題にかかる時間（分）</label>
            <input
              type="text"
              value={newTodoTime}
              onChange={updateNewTodoTime}
              className={twMerge("w-full rounded-md border p-2 text-black", newTodoTimeError && "border-red-500 outline-red-500")}
              placeholder="例：30"
            />
          </div>

          {newTodoTimeError && (
            <p className="text-red-500 text-sm font-bold flex items-center">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
              {newTodoTimeError}
            </p>
          )}

          {/* 追加ボタン */}
          <button
            type="button"
            onClick={addNewTodo}
            disabled={!!newTodoTimeError || !!newTodoNameError}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md font-bold"
          >
            追加
          </button>
        </div>

        {/* 完了済削除 */}
        <button
          type="button"
          onClick={removeCompletedTodos}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-bold"
        >
          完了済みタスクを削除
        </button>
      </div>
    </div>
  );
};

export default App;
