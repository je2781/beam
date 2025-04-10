---
title: Beam
description: Beamapp
author: Joshua Eze
created:  2025 Apr 7
updated: 2025 Apr 10
---

Beam
=========

## Development
I started with the project structure, and moved the routes into the (pages) folder. Authentication followed, with storing mock data in the login page. I later onto the wallet page, with all its components, while doing its responsiveness. Finally worked on the modals, with responsive as well.

For backend I started with integrating TypeORM with the entities, before creating services/controllers/modules for each entity. Tested the routes on postman successfully, and added authentication, and data validation.

## Testing
On the frontend unit tests were done on all the page components, excluding UI components. While e2e tests were done to

## How to run the app (frontend)

Run (npm run dev) from the main directory to compile for development. To test run (npm run test). 

## How to run the app (backend)

Run (docker compose up) from the main directory to compile for development/build for production. To test run (npm run test:e2e). 






