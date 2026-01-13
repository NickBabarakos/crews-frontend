# OPTC Crews - Frontend Client

A community-driven platform for *One Piece Treasure Cruise* players to find, share and build strategy teams efficiently.

## Project Overview

Finding specific teams for game stages is currently time-consuming, forcing players to search Youtube videos for hours or seek help on community hubs like Reddit and Discord. **OPTC Crews** solves this by creating a centralized, searchable database where users can filter strategies based on the specific "Game Stage" and , crucially, their own character box.

**Live URL:** [https://optc-crews.vercel.app/home]

## Key Features & Technical Highlights

### 1. "My Box" Smart Filtering
Instead of showing generic teams, the application allows users to input their character collection. The UI utollizes this data to:
*   **Filter out unplayable teams:** Users can toggle a "My Box" filter to see only the crews they can actually build.
*   **Logic:** Implemented real-time client-side comparison logic to cross-reference user-owned units against crew compositions. This enables instant visual feedback (dimming units) and smart sorting based on "completable" teams without performance lag.

### 2. Interactive Team Builder & Export
A visual, slot-based editor for constructing teams. Users click individual slots to open a searchable modal and populate their crew configuration.
*   **Complex State Management:** Handles a 6-slot main team plus support characters, valdiating role restrictions (Captain, Crewmate, Support).
*   **Canvas Generation:** Integrated `html-to-image` to generate high-quality PNG exports of teams, formatted specifically for sharing on Discord or social media.

### 3. Dynamic Stage Guides
Stages in the game have complex mechanics (gimmicks). The application parses JSON guide data to render:
*   **Interactive Checklists:** Users can track turn-by-turn interactions.
*   **Dynamic Routing:** The UI adapts based on the game mode (e.g. *Grand Voyage*, *Kizuna Clash*), changing available filters and dropdown dependencies dynamically using a configuration-driven approach.

### 4. Admin Dashboard
A comprehensive protected area for content management.
*   **Features:** CRUD operations for Characters, Stages and Banners.
*   **Approval System:** A workflow for reviewing user-submitted crews before they go public.

## Tech Stack

*  **Framework:** React.js
*  **State Management & Data Fetching:** TanStack Query (React Query)
*  **Context API:** Used for global application state (User Auth, Box Data)
*  **Routing:** React Router v6
*  **Styling:** CSS Modules & CSS Variables (Theming)
   * Implemented a fully responsive design (Mobile-First approach) with custom scroll logic for horizontal pill-selectors
*  **Utilities:** Axios (API Client), React Hot Toast (Notifications)