import React, { useState } from "react";
import type { Todo } from "./types";
import dayjs from "dayjs";

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

  const handleSave = () => {
    props.updateTodo(editData);
    setIsEditing(false);
  };

  return (
    <div className="bg-green-200 border-2 border-green-900 rounded-3xl p-6 shadow-md mb-4">
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
            <input
              type="text"
              value={editData.danger || ""}
              onChange={(e) =>
                setEditData({ ...editData, danger: e.target.value })
              }
              className="rounded-md border p-1"
            />
          </div>
          <div className="flex gap-2 mt-1">
            <label>時間：</label>
            <input
              type="text"
              value={editData.time || ""}
              onChange={(e) =>
                setEditData({ ...editData, time: e.target.value })
              }
              className="rounded-md border p-1"
            />
          </div>
          <div className="mt-3 space-x-2">
            <button
              onClick={handleSave}
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
          <p>課題にかかる時間：{todo.time || "未設定"}</p>

          <div className="mt-3 space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-yellow-400 text-white px-3 py-1 font-bold hover:bg-yellow-500"
            >
              編集
            </button>
            <button
              onClick={() => props.remove(todo.id)}
              className="rounded-md bg-red-400 text-white px-3 py-1 font-bold hover:bg-red-600"
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
