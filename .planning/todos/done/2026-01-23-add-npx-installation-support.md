---
created: 2026-01-23T17:55
title: Add npx installation support
area: feature
files:
  - package.json
---

## Problem

Currently esoterica doesn't support installation via npx. Users should be able to install/run with a simple `npx esoterica` command, similar to how https://github.com/glittercowboy/get-shit-done handles installation.

## Solution

Review the get-shit-done repo for their npx approach. Update package.json with proper bin configuration and ensure the package is published to npm with the right entry points for npx execution.
