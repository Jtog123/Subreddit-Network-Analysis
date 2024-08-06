from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import source
import os

#Where hte server is going to serve the file 
# http://localhost:5000/static/bar_graph.png
app = Flask(__name__, static_folder='static')
CORS(app)

base_dir = os.path.dirname(os.path.abspath(__file__))
app.config['UPLOAD_FOLDER'] = os.path.join(base_dir, 'static')
#app.config['UPLOAD_FOLDER'] = 'static'
#app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

print("Static folder path222:", app.config['UPLOAD_FOLDER'])

#Home route that returns below test
#when root url in accessed

#c:\Users\jtog8\OneDrive\Documents\SubredditNetworkAnalysis\server\static
#c:\Users\jtog8\OneDrive\Documents\SubredditNetworkAnalysis\server\static

#Route decoration @app.route is a decorator that associates the function below it
@app.route('/')
def hello_world():
    return "<p> Hello James </p>"


#The Server then needs to send this information to source.py
@app.route('/text-and-sample-input', methods=['POST'])
def testing():
    data = request.get_json()
    print(data, ' data')
    input_text = data.get('inputText', '')
    print(input_text)
    sample_size = data.get('sampleSize', '')
    print(sample_size)

    result = source.main(input_text, int(sample_size))

    print('result is ', result)
    #print(jsonify(result))
    
    return jsonify(result)

    #return jsonify({"response": f"Recieved: {input_text}"})
    

@app.route('/static/<path:filename>')
def send_image(filename):
    #return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True, port=5000)

