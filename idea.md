# CodeAtlas – AI-Powered Self-Documenting Repository Intelligence System

## Project Overview

CodeAtlas is a full-stack AI-powered system that analyzes a GitHub repository or uploaded project files, automatically generates updated documentation, suggests architectural improvements, and provides a chatbot interface to query the codebase.

The system helps developers keep documentation synchronized with code changes and enables new contributors to understand a project quickly.

---

## Problem Statement

Documentation often becomes outdated as code evolves. Developers rarely update README files and architecture documentation consistently. New contributors struggle to understand large codebases.

CodeAtlas solves this by automatically analyzing the repository and generating intelligent documentation and explanations.

---

## Core Features

- Accept public GitHub repository link
- Upload project zip file
- Clone/download repository
- Read and process source files
- Generate:
  - Updated README
  - Architecture overview
  - Code improvement suggestions
- AI-powered chatbot to query project details
- Store analysis history
- Chat history tracking

---

## Backend Architecture

The system follows a clean layered architecture:

- Controllers
- Services
- Repositories (Data Access Layer)
- AI Microservice (FastAPI)

OOP principles applied:
- Encapsulation
- Abstraction
- Separation of concerns

Design patterns:
- Singleton Logger
- Service Layer Pattern
- Repository Pattern

---

## Tech Stack

### Frontend
- React
- Axios

### Backend (Core API)
- Node.js
- Express

### AI Service
- Python
- FastAPI
- OpenAI API

### Database
- MySQL

---


