# syntax=docker/dockerfile:1
ARG PYTHON_VERSION=3.13
FROM python:${PYTHON_VERSION}-slim AS base

# Configure Python environment
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_NO_INTERACTION=1
ENV POETRY_VENV_IN_PROJECT=1
ENV POETRY_CACHE_DIR=/tmp/poetry_cache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    python3-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --no-cache-dir poetry==1.8.3

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy Poetry configuration files
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry config virtualenvs.create false && \
    poetry install --only=main --no-root && \
    rm -rf $POETRY_CACHE_DIR

# Production stage
FROM base AS runner
WORKDIR /app

# Create non-root user for security
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/home/appuser" \
    --shell "/sbin/nologin" \
    --uid 10001 \
    appuser

# Copy installed packages from deps stage
COPY --from=deps /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

# Copy application code
COPY --chown=appuser:appuser . .

# Ensure that any dependent models are downloaded at build-time
RUN python agent.py download-files

# Create cache directory and set permissions
RUN mkdir -p /home/appuser/.cache && \
    chown -R appuser:appuser /home/appuser/.cache && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set default PORT and expose it (Cloud Run will inject PORT env var)
ENV PORT=8080
EXPOSE $PORT

# Run the application
ENTRYPOINT ["python", "agent.py"]
CMD ["start"] 