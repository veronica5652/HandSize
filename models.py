from google.appengine.ext import ndb
from google.appengine.ext import db

class Study(ndb.Model):
    study_id=ndb.IntegerProperty(required=True)
    accurate=ndb.IntegerProperty(required=True)
    inaccurate=ndb.IntegerProperty(required=True)
    not_applicable=ndb.IntegerProperty(required=True)
