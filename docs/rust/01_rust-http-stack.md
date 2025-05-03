---
tags:
  - Rust
---

# Rust HTTP Stack Overview

This article answers the question: *How does HTTP protocol implement in Rust?*

We summarized the core crates that make up the Rust web development stack: `httparse`, `http`, `http-body`, `hyper`, `tower`, `tower-http`, and `axum`, including their **purpose**, **functionality**, and **direct dependencies**.

## Crates

### 📦 1. [`httparse`](https://docs.rs/httparse)

- **Purpose**: Minimal, high-performance HTTP request/response parser.
- **Functionality**:
  - Parses raw TCP bytes into HTTP headers (excluding body).
  - Supports basic structure parsing of HTTP/1.1 requests and responses.
- **Direct Dependencies**: None.
- **Used by**: `hyper` for low-level HTTP parsing.

### 📦 2. [`http`](https://docs.rs/http)

- **Purpose**: Provides common HTTP type definitions (no logic implementation).
- **Functionality**:
  - Defines generic `Request<T>` / `Response<T>` types.
  - Includes `Method`, `HeaderMap`, `StatusCode`, etc.
- **Direct Dependencies**: Standard library only.
- **Used by**: `hyper`, `tower`, `axum`, `http-body`, and more.

### 📦 3. [`http-body`](https://docs.rs/http-body)

- **Purpose**: Defines traits for streaming HTTP bodies.
- **Functionality**:
  - The `Body` trait describes async body sources.
  - Supports incremental data consumption (e.g., file downloads, streaming responses).
- **Direct Dependencies**:
  - `http` (for `HeaderMap` and types)
  - `bytes` (for `Buf` trait)
- **Used by**: `hyper`, `axum`, some tower middleware.

### 📦 4. [`hyper`](https://docs.rs/hyper)

- **Purpose**: High-performance, asynchronous HTTP client and server.
- **Functionality**:
  - Full HTTP/1.1 and HTTP/2 support.
  - Based on `http` and `http-body` types.
- **Direct Dependencies** (core parts):
  - `http`, `http-body`, `httparse`
  - `tokio`, `bytes`, `futures`
- **Used by**: `axum`, `warp`, and other frameworks.

### 📦 5. [`tower`](https://docs.rs/tower)

- **Purpose**: Composable middleware abstraction layer.
- **Functionality**:
  - Defines the `Service<Request> -> Future<Response>` trait.
  - Supports composing middleware, retries, load balancing, etc.
- **Direct Dependencies**:
  - `futures`, `pin-project`, `tracing`
- **Used by**: `axum`, `tower-http`.

### 📦 6. [`tower-http`](https://docs.rs/tower-http)

- **Purpose**: A set of HTTP-focused middleware built on `tower`.
- **Functionality**:
  - Provides CORS, compression, timeout, rate limiting, tracing, etc.
- **Direct Dependencies**:
  - `tower`
  - `http`
  - `http-body`
  - `headers`, `tokio`, `bytes`, etc.
- **Used by**: `axum`

### 📦 7. [`axum`](https://docs.rs/axum)

- **Purpose**: Modern, type-safe Rust web framework.
- **Functionality**:
  - Provides routing, request extractors, response wrappers, state management.
  - Built on `tower` middleware and uses `hyper` as the underlying server.
- **Direct Dependencies**:
  - `hyper`
  - `tower`, `tower-http`
  - `http`, `http-body`
  - `tokio`, `futures`, `bytes`, `serde`

## Composition Overview

```scss
┌──────────────┐
│  Your App    │  → axum handlers, routes, extractors
└──────┬───────┘
       ↓
   [axum (web framework)]
       ↓
[tower + tower-http (middleware stack)]
       ↓
  hyper (http server/client)
       ↓
 http (types) + http-body (Body trait)
       ↓
    httparse (parsing)
       ↓
    TcpStream(provided by tokio)
```
