import os
import shutil
import sys
from flask import send_from_directory
from flask import Flask, request, send_file, jsonify
import subprocess
from werkzeug.utils import secure_filename
import json
from flask_cors import CORS, cross_origin
app = Flask(__name__, static_folder=os.path.abspath("build"))
if __name__ == '__main__':
    app.run(host='localhost', port=3000)
CORS(app, methods=['GET', 'POST', 'PUT', 'DELETE'], origins=['localhost:3000'])


@app.route('/', defaults={'path':''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder,path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
    

@app.route('/run_script')
def run_script():
    
    subprocess.call(["python3", "amsnet_1_1.py"])
    return send_file("components/export_20240510/0/0_cpnt.jpg",mimetype='image/png')

    
@app.route('/upload_and_replace', methods=['POST'])
def upload_and_replace():
    file = request.files['file']
    
    filename = secure_filename(file.filename)
    file.save(os.path.join('components', filename))
    
    old_file_path = os.path.join('components', 'testimg.png')
    new_file_path = os.path.join('components', filename)
    
    if os.path.exists(old_file_path):
        os.remove(old_file_path)
    
    os.rename(new_file_path, old_file_path)
    
    return 'Image replaced successfully!'

@app.route('/replace_json', methods=['POST'])
def replace_json():
    data = request.get_json()
    
    file_path = os.path.join("components", 'test.JSON')
    
    with open(file_path, 'w') as f:
        json.dump(data, f)
    
    return jsonify({'message': 'JSON file replaced successfully'}), 200
