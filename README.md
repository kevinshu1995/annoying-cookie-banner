# 🎮 The Most Annoying Cookie Banner Game 🍪

For more info on how to participate, go here: https://docs.opensaas.sh/blog/

## 概述

這個專案是針對一場 Hackathon 的參賽作品，主題是設計出「最惱人的 Cookie Banner」。我們決定用一個有趣的遊戲來滿足這個挑戰：玩家需要在洗亂的杯子中找出那顆球，只有贏得比賽才能拒絕網站的 Cookie！不過，別以為這麼簡單，挑戰隨著每一局會變得越來越難！

## 🎮 遊戲規則

1. 遊戲開始時，有三個杯子，裡面隱藏了一顆球。
2. 一開始會展示有球的杯子，然後所有杯子會被迅速洗亂（每一回合的杯子調換次數與速度會隨著玩家進度逐漸增加）。
3. 玩家必須在 5 秒鐘內 從洗亂後的杯子中找出那顆球。每回合玩家只有 3 次機會，機會用完就遊戲結束。
4. 玩家每贏得一局，遊戲難度就會提高，杯子的調換速度和次數會增多。

## 🛠 技術細節

這個專案基於官方的 React 和 Tailwind CSS 開發。我們在這個基礎上，進一步利用 JavaScript Canvas 製作了遊戲中的杯子和球，讓遊戲界面更加靈活可控。

- React + Tailwind：為網站提供基礎框架和樣式設計。
- JavaScript Canvas：實現遊戲邏輯，將洗杯子、顯示球等元素進行動態處理。

## 🚀 快速上手

1. 請直接打開網頁，然後開始遊戲吧！
   點擊開始遊戲，並準備好找出那顆隱藏的球！

2. 如果你想啟動特殊模式，試試在網址後加上以下參數：

- ?cheater=transparent：讓杯子變得透明，讓你更容易找到球！💡
- ?cheater=easyAF：簡單模式，杯子的調換速度與次數大幅減少，適合需要輕鬆過關的玩家。

## 🎨 設計風格

遊戲界面以 扁平化設計 為主，簡潔而不失趣味。每一個杯子和球都是通過 Canvas 動態繪製，打造出一個乾淨、直觀且充滿挑戰的視覺體驗。

---

# 🎮 The Most Annoying Cookie Banner Game 🍪

## Overview

This project is a Hackathon submission, themed around creating the most annoying cookie banner. We decided to take a playful approach to this challenge by designing a game where players must find a hidden ball from a shuffled cup in order to reject the website's cookies! But don’t think it’s that simple—each round of the game gets harder as you progress!

## 🎮 Game Rules

- At the start of the game, there are three cups, and one of them has a hidden ball inside.
- The ball-bearing cup will be shown first, and then all three cups will be shuffled (the speed and frequency of shuffling will increase as the player progresses).
- Players must find the ball within 5 seconds after the shuffle. You only have 3 chances per round, and if you run out of chances, the game is over.
- After every victory, the difficulty of the game increases—cups will be shuffled faster and more frequently.

##🛠 Technical Details

This project is built on an official React and Tailwind CSS foundation. From there, we’ve further extended it by using JavaScript Canvas to create the cups and balls in the game, making the gameplay more dynamic and engaging.

- React + Tailwind: Provides the basic structure and styling of the website.
- JavaScript Canvas: Handles the game logic, including cup shuffling and ball display.

## 🚀 Getting Started

1. Simply open the website and start playing!
   Click the start button, and get ready to find the hidden ball!

2. Want to enable cheat modes? Add one of the following parameters to the URL:

- ?cheater=transparent : Makes the cups transparent so you can spot the ball more easily! 💡
- ?cheater=easyAF : Easy mode! Slows down the shuffling speed and reduces the number of shuffles. Perfect for players who want a more relaxed experience.

## 🎨 Design Style

The game interface uses flat design as the main style—simple yet fun. Every cup and ball is dynamically drawn using Canvas, creating a clean, intuitive, and challenging visual experience.

---

本篇 README 是在 ChatGPT 的協助下完成的——畢竟，就連最惱人的 Cookie Banner 也需要點 AI 魔法！😉

This README was crafted with the help of ChatGPT—because even the most annoying cookie banners deserve a little AI magic! 😉

---

Check out these resources if you're interested to learn more about:

- [Open SaaS](https://opensaas.sh) - free, open-source SaaS starter
- [Wasp](https://wasp.sh) - batteries-included, React/NodeJS/Prisma full-stack framework

