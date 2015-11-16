import webapp2
import jinja2
import os
import logging
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

    #study_id=ndb.IntegerProperty(required=True)
    #accurate=ndb.IntegerProperty(required=True)
    #inaccurate=ndb.IntegerProperty(required=True)
    #not_applicable=ndb.IntegerProperty(required=True)


class ResultsHandler(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
    	for x in range(1, 5):
    		result = self.request.get(str(x))
    		studyQ=Study.query().filter(Study.study_id==x).fetch()
    		if (len(studyQ) == 0):
    			study = Study(study_id=x, accurate=0, inaccurate=0, not_applicable=0)
    			study.put()
    		else:
    			study = studyQ[0]

    		if (result == 'a'):
    			study.accurate = study.accurate + 1
    		elif (result == 'ia'):
    			study.inaccurate = study.inaccurate + 1
    		else:
    			study.not_applicable = study.not_applicable + 1
    		study.put()
    	template=jinja_environment.get_template('thankyou.html')
    	template_values={}
    	self.response.out.write(template.render(template_values))

class ThankYouHandler(webapp2.RequestHandler):
	def get(self):
		template=jinja_environment.get_template('thankyou.html')
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
	('/thankyou', ThankYouHandler),
	('/.*', HomePageHandler)
], debug=True)
