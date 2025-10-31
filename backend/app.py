from flask import Flask
from flask_cors import CORS

from endpoints import image_bp

def create_app():
    app = Flask(__name__)

    # # Load environment and other configurations
    # secrets_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), ".env.secrets")
    # load_dotenv(secrets_path)
    # app.config.from_prefixed_env(prefix="STUDYPLANNER_FLASK")

    # # Initialize CORS
    CORS(app)
    
    # Register Blueprints
    app.register_blueprint(image_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(port=5050, debug=True)