import os
import shutil
import sys
from flask import send_from_directory
from flask import Flask, request, send_file, jsonify, make_response
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

@app.route('/get_bbox', methods=['GET'])
def get_bbox():
    return send_file("components/export_20240510/0/0_bbox.json",mimetype='application/json')

@app.route('/refresh_json', methods=['GET'])
def refresh_json():
    emptydata = {}
    file_path = os.path.join("components/export_20240510/0/", '0_bbox.JSON')
    
    with open(file_path, 'w') as f:
        json.dump(emptydata, f)
    
    return 'JSON file refreshed successfully!'

    
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

@app.route('/get_img_labels', methods=['GET'])
def get_img_labels():
    folder_path = os.path.join("components", 'part_img')
    imagenames = os.listdir(folder_path)
    return jsonify(imagenames)

@app.route('/delete_img', methods=['POST'])
def delete_img():
    data = request.get_json()
    file_path = os.path.join("components", 'part_img', data["name"])
    os.remove(file_path)
    jsonpath = os.path.join("components/export_20240510/0/", '0_bbox.JSON')
    with open(jsonpath, 'r', encoding='utf-8') as json_file:
        prevjson = json.load(json_file)

    specific_string = data["label"]

    if specific_string in prevjson:
        del prevjson[specific_string]

    with open(jsonpath, 'w', encoding='utf-8') as json_file:
        json.dump(prevjson, json_file)
    
    
    return send_file("components/export_20240510/0/0_bbox.json",mimetype='application/json')

@app.route('/get_netlist', methods=['GET'])
def get_netlist():
    try:
        with open('components/export_20240510/0/0.cir', 'r') as file:
            data = file.read()
            print(data)
        return jsonify({'file_content': data})
    except Exception as e:
        return str(e)
