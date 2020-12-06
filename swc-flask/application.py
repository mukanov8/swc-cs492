from flask import Flask, render_template, request
import main5

application = Flask(__name__)

@application.route('/')
def index():
    return render_template("index.html")
application.add_url_rule('/','index',index)

@application.route('/generate', methods=['POST'])
def contact_generator():
    print("entered generator")
    if request.method == 'POST':
        print("entered POST")
        json_received = request.get_json()
        json_message = json_received['msg']
        # json_message = json_body['msg']
        result = main5.get_json_clusters(json_message)
        return result
    else:
        print("Did not recieve a post request")
#application.add_url_rule('/generate','contact_generator',contact_generator)

if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.run()
