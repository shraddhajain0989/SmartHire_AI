FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (layer cache friendly)
COPY requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

EXPOSE 5000

# Use gunicorn for production; fall back to dev server only locally
CMD ["gunicorn", "backend.app:app", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120"]
