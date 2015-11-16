import webapp2
import jinja2
import os
from models import Study
from google.appengine.ext import ndb
from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import blobstore
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.api import images

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class IndexHandler(webapp2.RequestHandler):
	def get(self):
		template=jinja_environment.get_template('index.html')
		template_values={}
		upload_url=blobstore.create_upload_url('/results')
		template_values['upload_url']=upload_url
		self.response.out.write(template.render(template_values))

class ResultsHandler(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
    	template=jinja_environment.get_template('home.html')
    	template_values={}
    	self.response.out.write(template.render(template_values))

class HomePageHandler(webapp2.RequestHandler):
	def get(self):
		template=jinja_environment.get_template('home.html')
		template_values={}
		self.response.out.write(template.render(template_values))

app = webapp2.WSGIApplication([
	('/results', ResultsHandler),
	('/index', IndexHandler),
	('/.*', HomePageHandler)
], debug=True)
