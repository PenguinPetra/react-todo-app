import React, { useState } from "react";
import type { Todo } from "./types";
import dayjs from "dayjs";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { twMerge } from "tailwind-merge";

type Props = {
  todo: Todo;
  updateIsDone: (id: string, value: boolean) => void;
  updateTodo: (updated: Todo) => void;
  remove: (id: string) => void;
};

const TodoItem = (props: Props) => {
  const { todo } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...todo });
  const [timeError, setTimeError] = useState("");

  const validateTimeInput = (value: string) => {
    if (value === "") return "";
    return /^\d+$/.test(value) ? "" : "数字のみ入力してください（例：30）";
  };

  const updateTime = (val: string) => {
    setEditData({ ...editData, time: val });
    setTimeError(validateTimeInput(val));
  };

  const handleSave = () => {
    if (timeError) return;
    props.updateTodo(editData);
    setIsEditing(false);
  };

  const getRemainingTime = () => {
    if (!todo.deadline) return "期限未設定";
    const now = new Date();
    const diff = todo.deadline.getTime() - now.getTime();

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      return `残り ${days}日 ${hours}時間`;
    } else {
      const overHours = Math.abs(Math.floor(diff / (1000 * 60 * 60)));
      return `期限を ${overHours}時間過ぎています`;
    }
  };

  return (
    <div className="bg-yellow-200 border-2 border-green-700 rounded-3xl p-6 shadow-md mb-4 text-black">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="mb-2 w-full rounded-md border p-1"
          />

          <div className="flex gap-2">
            <label>期限：</label>
            <input
              type="datetime-local"
              value={
                editData.deadline
                  ? dayjs(editData.deadline).format("YYYY-MM-DDTHH:mm:ss")
                  : ""
              }
              onChange={(e) =>
                setEditData({
                  ...editData,
                  deadline: e.target.value ? new Date(e.target.value) : null,
                })
              }
              className="rounded-md border p-1"
            />
          </div>

          <div className="flex gap-2 mt-1">
            <label>提出方法：</label>
            <input
              type="text"
              value={editData.method || ""}
              onChange={(e) =>
                setEditData({ ...editData, method: e.target.value })
              }
              className="rounded-md border p-1"
            />
          </div>

          <div className="flex gap-2 mt-1">
            <label>危険度：</label>
            <select
              value={editData.danger || ""}
              onChange={(e) =>
                setEditData({ ...editData, danger: e.target.value })
              }
              className="rounded-md border p-1"
            >
              <option value="">選んでね</option>
              <option value="朝飯前">朝飯前</option>
              <option value="簡単">簡単</option>
              <option value="ふつう">ふつう</option>
              <option value="難しい">難しい</option>
              <option value="自分では解決できない">自分では解決できない</option>
            </select>
          </div>

          <div className="flex gap-2 mt-1">
            <label>時間：</label>
            <input
              type="text"
              value={editData.time || ""}
              onChange={(e) => updateTime(e.target.value)}
              className={twMerge(
                "rounded-md border p-1",
                timeError && "border-red-500 outline-red-500"
              )}
            />
          </div>

          {timeError && (
            <p className="text-red-500 text-sm font-bold ml-20">
              <FontAwesomeIcon icon={faTriangleExclamation} /> {timeError}
            </p>
          )}

          <div className="mt-3 space-x-2">
            <button
              onClick={handleSave}
              disabled={!!timeError}
              className="rounded-md bg-blue-500 text-white px-3 py-1 font-bold hover:bg-blue-600"
            >
              保存
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-md bg-gray-400 text-white px-3 py-1 font-bold hover:bg-gray-500"
            >
              キャンセル
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
              className="mr-3 w-5 h-5 cursor-pointer"
            />
            <span className="text-xl font-bold">{todo.name}</span>
          </div>

          <p>提出期限：{todo.deadline ? dayjs(todo.deadline).format("YYYY/MM/DD HH:mm") : "未設定"}</p>
          <p>提出方法：{todo.method || "未設定"}</p>
          <p>危険度：{todo.danger || "未設定"}</p>
          <p>課題にかかる時間：{todo.time || "未設定"}分</p>

          <p className="text-red-700 font-bold mt-1">{getRemainingTime()}</p>

          <div className="mt-3 space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-green-600 px-3 py-1 font-bold text-white hover:bg-green-700"
            >
              編集
            </button>
            <button
              onClick={() => props.remove(todo.id)}
              className="rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
            >
              除去
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
