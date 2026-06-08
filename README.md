# BookStream

BookStream is a platform for reading and publishing literary works, inspired by the streaming model. Readers can follow ongoing works chapter by chapter, while authors publish and manage their content directly on the platform.

## Repositories

| Repository | Description |
|---|---|
| [`bookstream-client`](https://github.com/LucasOSRodrigues/bookstream-client) | Web interface built with Next.js + TypeScript |
| [`bookstream-api`](https://github.com/LucasOSRodrigues/bookstream-api) | REST API built with Node.js + TypeScript + PostgreSQL |

## Stack

**Frontend**
- Next.js + TypeScript
- TanStack Query
- Tailwind CSS v4

**Backend**
- Node.js + TypeScript
- Express 5
- Prisma 7 + PostgreSQL
- Docker
- Jest + Zod

## Architecture

The backend is structured in layers, with clear separation between Controller, Service, and Repository. An HTTP Adapter pattern decouples the application logic from Express, allowing the framework to be replaced without impact on the domain.

| Layer | Responsibility |
|---|---|
| **Client** | Next.js interface that consumes the API over HTTP |
| **API** | Express entry point, defines routes and middlewares |
| **HTTP Adapter** | Translates the HTTP request into application types, decoupling the framework from the domain |
| **Controller** | Coordinates and validates the request, delegates to the Service and returns the response |
| **Service** | Contains the business rules, independent of framework and transport |
| **Repository** | Abstracts database access, isolating Prisma from the rest of the application |
| **Database** | PostgreSQL, accessed exclusively through the Repository |

## Features

> The project is under active development.

- [x] Works CRUD
- [ ] Chapter publishing
- [ ] Reading and recommendation system
- [ ] Reading progress
- [ ] Likes and comments system
- [ ] Authentication