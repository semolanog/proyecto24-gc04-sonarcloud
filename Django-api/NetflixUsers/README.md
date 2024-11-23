# Netflix users project

## Prerequisites

To configure and run this project on your computer, you need the following installed:
* **Python 3.13 or higher**: Download it from [python.org](https://www.python.org/downloads/).
* **Git**: To clone the [project repository](https://github.com/UExGPSASEE/proyecto24-gc04.git).
* **Development Environment**: Using Visual Studio Code is recommended. You can download it from [code.visualstudio.com](https://code.visualstudio.com/).

## Initial Setup

Follow these steps to clone, configure, and launch the project locally.

### Step 1: Clone the Repository

Open your terminal, navigate to the directory where you want to clone the project, and execute the following commands:
* `git clone https://github.com/UExGPSASEE/proyecto24-gc04.git`
* `cd NetflixUsers`

### Step 2: Create and Activate the Virtual Environment

To manage dependencies, create a virtual environment within the project’s root directory:
* `python -m venv .venv`

Then activate the virtual environment:
* **On Windows**: `.venv\scripts\activate`
* **On macOS/Linux**: `source .venv/bin/activate`

### Step 3: Update pip

With the virtual environment activated, make sure `pip` is updated:
* `python -m pip install --upgrade pip`

### Step 4: Install Project Dependencies

Now, install all required dependencies listed in the `requirements.txt` file:
* `pip install -r requirements.txt`

### Step 5: Set Up the Database

Before launching the server, apply migrations to configure the database:
* `python manage.py migrate`

### Step 6: Start the Development Server

To verify that everything is set up correctly, start the development server:
* `python manage.py runserver 127.0.0.1:8001`

Then open your browser and go to [http://127.0.0.1:8001](http://127.0.0.1:8001) to access the application.

## Project Structure

Here’s an overview of the main directories and files in this project:
* `manage.py`: The main script to interact with the Django project.
* `netflix_users/`: The main application folder containing settings and application files.
* `requirements.txt`: A list of all dependencies needed to run the project.
* `.gitignore`: Specifies files and folders to be ignored by Git, including the virtual environment and cache files.

## Important Notes

1. Virtual Environment: Do not share or upload the virtual environment (`.venv`) folder to the repository. Each developer should create their own virtual environment after cloning the project.
2. Database Migrations: Each time models are modified, remember to run `python manage.py makemigrations` followed by `python manage.py migrate`.
