# SnapHire Backend (FastAPI)

## Setup

### Create Virtual Environment
```bash
python -m venv venv
```

### Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── core/           # Core configuration
│   ├── models/         # Database models
│   ├── routes/         # API endpoints
│   └── schemas/        # Pydantic schemas
├── main.py            # Application entry point
├── requirements.txt   # Python dependencies
└── .gitignore
```

## Development

- Use `requirements.txt` for dependency management
- Follow PEP 8 code style
- Add new routes in `app/routes/`
- Add database models in `app/models/`
- Add Pydantic schemas in `app/schemas/`
