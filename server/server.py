from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#Home route that returns below test
#when root url in accessed

#Route decoration @app.route is a decorator that associates the function below it
@app.route('/')
def hello_world():
    return "<p> Hello James </p>"


#The Server then needs to send this information to source.py
@app.route('/text-input', methods=['POST'])
def testing():
    data = request.get_json()
    print(data, ' data')
    input_text = data.get('inputText', '')
    print(input_text)
    sample_size = data.get('sampleSize', '')
    print(sample_size)
    return jsonify({"response": f"Recieved: {input_text}"})
    

@app.route('/test2')
def testing2():
    return "<p> blahahaha </p>"


if __name__ == '__main__':
    app.run(debug=True, port=5000)

