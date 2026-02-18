# CodeAtlas
AI-Powered Self-Documenting Repository Intelligence System

## Overview

CodeAtlas is a full-stack application that analyzes a public GitHub repository or uploaded project files and automatically generates updated documentation, architecture summaries, and improvement suggestions. It also provides a chatbot interface that allows users to ask questions about the project.

The system is designed to help developers keep documentation aligned with code and make project onboarding easier.

## Problem Statement

Project documentation often becomes outdated as code evolves. Developers do not consistently update README files or architecture documentation. New contributors may struggle to understand large codebases.

CodeAtlas addresses this problem by analyzing repositories and generating intelligent documentation using AI.

## Core Features

- Accept public GitHub repository links
- Upload project ZIP files
- Clone and process repositories
- Extract and read source files
- Generate:
  - Updated README
  - Architecture overview
  - Improvement suggestions
- Chatbot to query project details
- Store analysis results in database
- Maintain chat history per repository

## System Architecture

Frontend:
- React

Backend:
- Node.js
- Express

AI Service:
- Python
- FastAPI
- OpenAI API

Database:
- MySQL


## Workflow

1. The user submits a GitHub repository link or uploads project files.
2. The backend clones or processes the repository.
3. Source files are filtered and analyzed.
4. The AI service generates:
   - README
   - Architecture summary
   - Suggestions
5. The results are stored in the database.
6. The user can interact with the chatbot to ask questions about the project.

