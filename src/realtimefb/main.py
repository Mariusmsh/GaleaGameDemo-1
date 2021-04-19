import flask
app = flask.Flask("__main__")


@app.route("/")
def my_index():
    return '<h1>hello<h1/>'


app.run(debug=True)
