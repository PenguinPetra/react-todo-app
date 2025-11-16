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
  const [initialized, setInitialized] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState("");
  const localStorageKey = "TodoApp";

  const sound = new Audio(stampSound);

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

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value;
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

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

  return (
    <div className="relative min-h-screen text-white font-hand overflow-hidden">
      {/* 夜空グラデーション背景 */}
      <div className="fixed inset-0 -z-10 bg-linear-to-b from-[#1b2e6d] via-[#30458e] to-[#4a6ab5]" />

      {/* 流れ星（UIの背面） */}
      <Stars />

      {/* 花びら + スタンプ */}
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
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1.05 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.8,
                }}
                className="text-5xl font-bold text-pink-400 mb-2 font-hand"
              >
                {message}
              </motion.span>

              <motion.img
                src={goodstamp}
                alt="Good Job!"
                className="w-40 h-auto drop-shadow-xl"
                initial={{ opacity: 0, scale: 0.2, rotate: -25 }}
                animate={{
                  opacity: 1,
                  scale: [0.2, 1.3, 1],
                  rotate: [-25, 0, 0],
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {/* メインUI */}
      <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
        <h1 className="text-4xl mb-4 text-center font-bold">To Do リスト</h1>
        <p className="text-center text-lg mb-1">
          こんにちは、PenguinPetraさん。今日も一日がんばろう！
        </p>
        <p className="text-center mb-8">
          未達成のタスクが「{uncompletedCount}」コあるよ。
        </p>

        <TodoList
          todos={todos}
          updateIsDone={updateIsDone}
          updateTodo={updateTodo}
          remove={remove}
        />

        {/* 新規追加フォーム */}
        <div className="mt-10 space-y-3 rounded-3xl border-2 border-green-700 bg-green-100/90 p-5 shadow-md">
          <h2 className="text-lg font-bold text-black">新しいタスクの追加</h2>

          {/* タスク名 */}
          <div className="flex items-center space-x-2">
            <label className="font-bold w-20 text-black" htmlFor="newTodoName">
              名前
            </label>
            <input
              id="newTodoName"
              type="text"
              value={newTodoName}
              onChange={updateNewTodoName}
              className={twMerge(
                "grow rounded-md border p-2 text-black",
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
            <label htmlFor="deadline" className="font-bold w-20 text-black">
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
              className="rounded-md border border-gray-400 px-2 py-0.5 text-black"
            />
          </div>

          {/* 提出方法 */}
          <div className="flex items-center space-x-2">
            <label className="font-bold w-20 text-black" htmlFor="newTodoMethod">
              提出方法
            </label>
            <input
              id="newTodoMethod"
              type="text"
              value={newTodoMethod}
              onChange={(e) => setNewTodoMethod(e.target.value)}
              className="rounded-md border p-2 grow text-black"
              placeholder="例：Google Classroom"
            />
          </div>

          {/* 危険度 */}
          <div className="flex items-center space-x-2">
            <label className="font-bold w-20 text-black" htmlFor="newTodoDanger">
              危険度
            </label>
            <input
              id="newTodoDanger"
              type="text"
              value={newTodoDanger}
              onChange={(e) => setNewTodoDanger(e.target.value)}
              className="rounded-md border p-2 grow text-black"
              placeholder="例：高 / 中 / 低"
            />
          </div>

          {/* 課題時間 */}
          <div className="flex items-center space-x-2">
            <label className="font-bold w-20 text-black" htmlFor="newTodoTime">
              時間
            </label>
            <input
              id="newTodoTime"
              type="text"
              value={newTodoTime}
              onChange={(e) => setNewTodoTime(e.target.value)}
              className="rounded-md border p-2 grow text-black"
              placeholder="例：30分、1時間など"
            />
          </div>

          {/* 追加ボタン */}
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

        {/* 完了タスク削除ボタン */}
        <button
          type="button"
          onClick={removeCompletedTodos}
          className="mt-5 rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
        >
          完了済みのタスクを消去
        </button>
      </div>
    </div>
  );
};

export default App;
