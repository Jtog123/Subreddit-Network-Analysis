from flask import Flask

app = Flask(__name__)

#Home route that returns below test
#when root url in accessed

#Route decoration @app.route is a decorator that associates the function below it
@app.route('/')
def hello_world():
    return "<p> Hello James </p>"

if __name__ == '__main__':
    app.run(debug=True, port=5000)

