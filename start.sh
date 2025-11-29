#!/bin/bash

# Portfolio Website Startup Script
# This script starts the Flask server for Omar's portfolio website

echo "=========================================="
echo "  Omar's Portfolio Website"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null
then
    echo "❌ Error: Python is not installed"
    echo "Please install Python 3.7 or higher"
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python"
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
fi

echo "✓ Using $PYTHON_CMD"
echo ""

# Check if required packages are installed
echo "Checking dependencies..."
MISSING_DEPS=()

$PYTHON_CMD -c "import flask" 2>/dev/null || MISSING_DEPS+=("flask")
$PYTHON_CMD -c "import flask_cors" 2>/dev/null || MISSING_DEPS+=("flask-cors")
$PYTHON_CMD -c "import requests" 2>/dev/null || MISSING_DEPS+=("requests")

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    echo ""
    echo "⚠️  Missing dependencies: ${MISSING_DEPS[*]}"
    echo ""
    read -p "Would you like to install them now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing dependencies..."
        $PYTHON_CMD -m pip install flask flask-cors requests
        echo ""
    else
        echo "Please install dependencies manually:"
        echo "  $PYTHON_CMD -m pip install flask flask-cors requests"
        exit 1
    fi
fi

echo "✓ All dependencies installed"
echo ""

# Start the server
echo "Starting Flask server..."
echo ""
$PYTHON_CMD main.py
