# モチベーションを生むToDoアプリ

## Todoアプリをホストしている GitHub Pages の URL
https://penguinpetra.github.io/react-todo-app/

アプリの全体UI
./images/ToDo_UI.png

---

## アプリ概要・コンセプト

**「その課題、流れ星みたいに消していこう。」**  
このToDoアプリは、課題を「こなす」から「楽しむ」へと変化させることを目的として開発しました。
概要
- 夜空をイメージしたグラデーション背景  
- 星が流れる演出（Canvasを使用した流れ星UI）  
- タスクが完了すると「やるじゃん！」のスタンプ & 桜が舞うアニメーション  
- 課題ごとに提出方法や危険度、所要時間を設定可能  
- タスク内容は自由に編集可能（途中で変更OK）  
- アプリはすべてフロントエンドで完結（ユーザーのローカル環境保存）

---

## アプリの一押し・工夫ポイント

### やる気が出る「ご褒美演出」
- タスクを完了 → **桜が舞って「やるじゃん」スタンプを表示**。スタンプが表示されるときは、**ポン！**という音が鳴る。
- シンプルな達成報酬ではなく「視覚・聴覚・動き」を組み合わせたご褒美を設計。

### 独自性のある入力項目
- 提出方法 / 危険度（優先度） / 課題にかかる時間などを見通しの段階で決めておくことで、**課題の効率化をアップ**。

### 夜空UIと流れ星アニメーション
- TailwindCSSで夜空風グラデーションを再現。
- Canvas + CSSアニメーションで**ランダム生成される流れ星**を実現。

### 手書き風フォントを採用
- 手書き風フォント**yosugara**フォントを用いてリアルなToDoリストを再現。

---

## 使用技術・ライブラリ

| 分類          | 使用技術                                         |
|---------------|--------------------------------------------------|
| フロントエンド | React + TypeScript                               |
| スタイリング   | Tailwind CSS、手書き風日本語フォント（yosugara.ttf） |
| アニメーション | Framer Motion、Canvas、CSS keyframes             |
| データ管理     | localStorage                                     |
| 日時処理       | dayjs                                            |
| ID生成         | uuid                                             |
| アイコン       | Font Awesome                                     |
| 効果音         | HTML Audio（スタンプ音を再生）                   |

---

## ⏳ 開発期間

📅 **2025.10.23 ~ 2025.11.19（約30時間）**  
※授業内コーディング、チュートリアル学習、個別追加機能実装を含む

---

## ライセンス

MIT License

Copyright (c) 2025 Penguin Petra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.