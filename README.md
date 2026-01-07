# 🧭 Angular Router Playground

> **The Interactive Classroom for Mastering Angular Navigation**

**Router Outlet Playground** is a visually interactive educational application designed to demystify the Angular Router. Unlike static tutorials, this project provides a live "Playground" where users can see exactly how URLs, Router Outlets (Primary & Named), and Component lifecycles interact in real-time.

Whether you are a complete beginner ("Student") or an expert ("Architect"), this application adapts its curriculum to teach you the specific mechanics of Single Page Application (SPA) routing.

---

## 🌟 Key Features

### 1. 🎓 Gamified Learning System
The application is structured into four distinct levels of difficulty. The content, code snippets, and quizzes adapt dynamically based on the selected level:
*   **🎒 Student (Beginner)**: Focuses on `<router-outlet>`, `routerLink`, and basic navigation.
*   **💻 Intern (Intermediate)**: Covers Route Parameters (`:id`), 404 Error handling, and Active styling.
*   **🛠️ Developer (Advanced)**: Dives into Guards, Lazy Loading concepts, and Relative navigation.
*   **🏛️ Architect (Professional)**: Explores `UrlTree`, `RouteReuseStrategy`, internal mechanics, and performance.

### 2. 👁️ Visual Routing Visualization
*   **Live Address Bar**: A simulated browser URL bar that breaks down the URL into segments (Primary, ID, Auxiliary Left, Auxiliary Right).
*   **Multiple Named Outlets**: Visually demonstrates how `primary`, `left`, and `right` outlets work simultaneously (e.g., `/home(left:menu//right:notes)`).
*   **Focus Highlighting**: As you learn a concept, the UI dims irrelevant sections and spotlights the specific component or URL segment being discussed.

### 3. 🗣️ Accessibility & Localization
*   **Multi-Language Support**: Complete curriculum available in **English**, **Hindi**, and **Malayalam**.
*   **Text-to-Speech (TTS)**: Built-in "Teacher" mode that reads lessons aloud using the browser's native synthesis API, respecting the selected language accent.

### 4. 🧪 Interactive Simulator
*   **Parameter Manipulation**: Click buttons to simulate changing user IDs (`/user/1` vs `/user/99`).
*   **Wildcard Testing**: Intentionally trigger broken links to observe 404 behavior.
*   **Auxiliary Route Control**: Open and close side panels (Menu, Ads, Help, Notes) independently of the main content.

### 5. 📝 Assessment Engine
*   **Dynamic Quiz**: Level-specific quizzes with multiple types of questions (MCQ, Fill-in-the-blank, Code Snippet analysis). Includes score tracking and confetti celebrations.
*   **Interview Preparation**: A curated list of real-world Angular Interview questions and answers, categorized by difficulty level.

---

## 🏗️ Technical Architecture

This project is built using modern **Angular (v18+)** standards:

*   **Standalone Components**: No `NgModule` boilerplate.
*   **Zoneless Ready**: Prepared for the future of Angular change detection.
*   **Signals**: State management relies entirely on Angular Signals for reactivity (no complex RxJS Subject patterns for local state).
*   **Tailwind CSS**: Utility-first styling with Glassmorphism effects and responsive design.
*   **Firebase Hosting**: configured for SPA routing (rewrites to `index.html`).

### Project Structure
```
src/
├── components/
│   ├── landing.component.ts    # Entry point & Level selection
│   ├── pages.component.ts      # Dummy pages (Home, Dashboard, User)
│   ├── side-components.ts      # Aux pages (Menu, Help, Notes)
│   ├── quiz.component.ts       # Gamified assessment logic
│   └── interview.component.ts  # Q&A repository
├── services/
│   ├── tutorial.service.ts     # Content engine & step logic
│   ├── quiz.service.ts         # Quiz state management
│   ├── speech.service.ts       # Text-to-Speech integration
│   └── language.service.ts     # i18n logic
└── app.component.ts            # Main layout & Orchestration
```

---

## 🚀 How to Run Locally

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/router-outlet-playground.git
    cd router-outlet-playground
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Server**
    ```bash
    ng serve
    ```

4.  **Open Browser**
    Navigate to `http://localhost:4200`

---

## 🔥 How to Deploy to Firebase

This project includes a production-ready `firebase.json` configuration.

1.  **Install Firebase Tools** (if not installed)
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**
    ```bash
    firebase login
    ```

3.  **Build the Project**
    ```bash
    ng build
    ```

4.  **Deploy**
    ```bash
    firebase deploy
    ```

---

## 📚 Curriculum Overview

| Level | Concepts Covered |
| :--- | :--- |
| **Beginner** | SPA Basics, RouterOutlet, RouterLink, avoiding `href`. |
| **Intermediate** | Route Params (`:id`), Wildcards (`**`), Active Routing classes, Auxiliary Routes setup. |
| **Advanced** | Route Guards (`CanActivate`), Resolvers, Lazy Loading syntax, Relative navigation. |
| **Professional** | `UrlTree` serialization, `RouteReuseStrategy`, `PreloadingStrategy`, `ViewContainerRef` internals. |

---

## 🤝 Contributing

Contributions are welcome! If you have a new lesson idea, a better explanation, or a new language translation:

1.  Fork the repository.
2.  Create a feature branch.
3.  Submit a Pull Request.

---

**Built with ❤️ using Angular & Tailwind**
