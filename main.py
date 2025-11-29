import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from portfolio import portfolio_bp

# Create Flask app with current directory as static folder
app = Flask(__name__, static_folder=os.path.dirname(__file__))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app, origins="*")

# Register the portfolio API blueprint
app.register_blueprint(portfolio_bp, url_prefix='/api')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve static files and index.html"""
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    # If a specific file is requested and exists, serve it
    if path != "":
        file_path = os.path.join(static_folder_path, path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return send_from_directory(static_folder_path, path)

    # Otherwise serve index.html (for SPA routing)
    index_path = os.path.join(static_folder_path, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(static_folder_path, 'index.html')
    else:
        return "index.html not found", 404


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Starting Omar's Portfolio Website")
    print("=" * 60)
    print("📍 Server running at: http://localhost:5001")
    print("📍 API endpoints at: http://localhost:5001/api/")
    print("=" * 60)
    print("\nAvailable API endpoints:")
    print("  GET  /api/scholar/lw70gLkAAAAJ")
    print("  GET  /api/github/omaratef3221")
    print("  GET  /api/github/omaratef3221/pinned")
    print("  GET  /api/github/omaratef3221/starred")
    print("  POST /api/contact")
    print("  GET  /api/cache/status")
    print("  POST /api/cache/clear")
    print("=" * 60)
    print("\n✨ Press Ctrl+C to stop the server\n")

    app.run(host='0.0.0.0', port=5001, debug=True)
