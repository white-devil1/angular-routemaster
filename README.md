<div align="center">

# 🧭 Angular Router Playground

### The Interactive Classroom for Mastering Angular Navigation

[![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)

<br>

**Router Outlet Playground** is a visually interactive educational application designed to demystify the Angular Router.

[**View Live Demo**](https://your-project.web.app)

</div>

---

## ☁️ How to Publish (Auto-Deploy)

This project uses **GitHub Actions** to build and deploy itself. You do not need to run build commands locally.

### 1. Push your code
Simply commit your changes and push to the `main` branch.
```bash
git add .
git commit -m "Update application"
git push origin main
```

### 2. Watch the Pipeline
Go to the **Actions** tab in your GitHub repository. You will see a workflow running. Once it finishes (green checkmark), your site is live!

### ⚠️ Important Configuration
If the deployment fails with a "Permission denied" error:
1.  Go to your Repository **Settings**.
2.  Click **Actions** > **General**.
3.  Scroll to **Workflow permissions**.
4.  Select **Read and write permissions**.
5.  Click **Save**.

---

## 🌟 Key Features

### 1. 🎓 Gamified Learning System
The application is structured into four distinct levels of difficulty. The content, code snippets, and quizzes adapt dynamically based on the selected level:
*   **🎒 Student (Beginner)**: Focuses on `<router-outlet>`, `routerLink`, and basic navigation.
*   **💻 Intern (Intermediate)**: Covers Route Parameters (`:id`), 404 Error handling, and active styling.
*   **🛠️ Developer (Advanced)**: Dives into Guards, Lazy Loading concepts, and relative navigation.
*   **🏛️ Architect (Professional)**: Explores `UrlTree`, `RouteReuseStrategy`, internal mechanics, and performance.

### 2. 👁️ Visual Routing Visualization
*   **Live Address Bar**: A simulated browser URL bar that breaks down the URL into segments.
*   **Multiple Named Outlets**: Visually demonstrates how `primary`, `left`, and `right` outlets work simultaneously.

### 3. 🧪 Interactive Simulator
*   **Parameter Manipulation**: Click buttons to simulate changing user IDs (`/user/1` vs `/user/99`).
*   **Auxiliary Route Control**: Open and close side panels (Menu, Ads, Help, Notes).

---

## 🚀 Local Development (Optional)

If you have the environment set up, you can run:

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the Server**
    ```bash
    ng serve
    ```

---

<div align="center">
  <sub>Built with ❤️ using Angular & Tailwind CSS</sub>
</div>
