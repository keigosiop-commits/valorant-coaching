# gosio | Valorant Coaching LP

FPS解説者 gosio のValorantコーチング申し込み用ランディングページです。

## 概要

- **目的**: note記事からの流入を受け、コーチングの申し込みを受け付ける
- **機能**:
  - コーチング内容・料金の提示
  - 申し込みフォーム（Discord Webhook連携）
  - 日程調整機能

## デプロイ方法

このリポジトリは **GitHub Pages** で公開することを想定しています。

1. `Settings` -> `Pages` を開く
2. Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)`
4. Save

## 構成

- `index.html`: LP本体
- `style.css`: デザイン
- `script.js`: フォーム処理・Discord連携・アニメーション
