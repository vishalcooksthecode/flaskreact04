# Flask + React Task Manager

## Project Structure
```
flask-react-app/
├── app.py              # Flask backend with Task & Comment APIs
├── test_api.py         # Automated tests for all APIs
├── requirements.txt    # Python dependencies
├── frontend/           # React frontend
│   ├── src/
│   │   ├── App.js     # Main React component
│   │   ├── App.css    # Styles
│   │   └── index.js   # React entry point
│   ├── public/
│   │   └── index.html # HTML template
│   └── package.json   # Node dependencies
└── README.md
```

## Setup Instructions

### Backend (Flask)
1. Install dependencies: `pip install -r requirements.txt`
2. Run server: `python app.py`
3. Run tests: `python test_api.py`

### Frontend (React)
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm start`

## API Endpoints

### Tasks
- GET /tasks - Get all tasks
- POST /tasks - Create task (requires: title)
- PUT /tasks/{id} - Update task
- DELETE /tasks/{id} - Delete task

### Comments
- GET /comments?task_id={id} - Get comments for task
- POST /comments - Create comment (requires: task_id, content)
- PUT /comments/{id} - Update comment
- DELETE /comments/{id} - Delete comment

## Key Features
- Full CRUD operations for tasks
- Task completion toggle
- Inline editing
- Responsive design
- CORS enabled for React integration
- Comprehensive test coverage

## Technical Decisions
- SQLite for simplicity
- Flask-CORS for frontend integration
- Minimal React setup without additional libraries
- In-memory testing database
- RESTful API design