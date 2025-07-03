# Personal Task Tracker

## Description

A simple, modern personal task management application built with React. Easily add, edit, complete, and organize your tasks with features like search, filtering, priorities, due dates, dark mode, and more. All data is stored locally in your browser for privacy and persistence.

## Features

- Simple login (username only, stored in localStorage)
- Add, edit, and delete tasks
- Required title, optional description, priority, due date, and tags
- Mark tasks as completed or pending
- Inline editing of tasks
- Confirmation before deleting a task
- Task list with creation date/time and visual status
- Filter tasks by All, Completed, or Pending
- Task counts for each filter
- Search tasks by title, description, or tags
- Task priority levels and due dates
- Task categories/tags
- Data persistence with localStorage
- Responsive design (mobile & desktop)
- Light/dark mode toggle and color themes
- Smooth animations and transitions
- Export and clear all tasks from settings

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/himanchal08/personal-task-tracker.git
   cd personal-task-tracker
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm start
   ```
4. **Open in your browser:**
   [http://localhost:3000](http://localhost:3000)

## Technologies Used

- React.js (functional components & hooks)
- CSS (with variables for theming & responsive design)
- [react-icons](https://react-icons.github.io/react-icons/) (for UI icons)

## Live Demo

[Live Demo Link](https://personal-task-tracker-azure.vercel.app/) 
## Screenshots


![Login Screen](https://github.com/user-attachments/assets/b1642c4b-2919-43c7-9b1f-ed8cff8e9e2c)
![Task Dashboard](https://github.com/user-attachments/assets/3e544e97-8b18-4067-8186-95c6a5a89e2e)


## Project Structure

```
personal-task-tracker/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── TaskForm.js
│   │   ├── TaskItem.js
│   │   ├── TaskList.js
│   │   ├── TaskFilter.js
│   │   └── Settings.js
│   ├── utils/
│   │   └── localStorage.js
│   ├── styles/
│   │   └── App.css
│   ├── App.js
│   └── index.js
├── README.md
└── package.json
```

## Sample Data for Testing

```js
const sampleTasks = [
  {
    "id": 1751536007756.7717,
    "title": "Grocery",
    "description": "Had to but milk",
    "priority": "high",
    "dueDate": "2025-07-04T09:46:00.000Z",
    "tags": [],
    "completed": true,
    "createdAt": "2025-07-03T09:46:47.756Z"
  },
  {
    "id": 1751535982977.0015,
    "title": "Bathing",
    "description": "Have to take a shower",
    "priority": "low",
    "dueDate": "2025-07-03T11:46:00.000Z",
    "tags": [],
    "completed": true,
    "createdAt": "2025-07-03T09:46:22.977Z"
  }
];
```

## Notes

- All data is stored locally in your browser for privacy. No backend or real authentication is used.
- For any issues or suggestions, feel free to open an issue or pull request.

## Bonus Features Implemented

- Search, priorities, due dates, tags, dark mode, color themes, export/clear tasks, and smooth UI animations.

## License

MIT
