python_home = '/var/www/html/flaskjepage/venv/'

import sys
import site

# Calculate path to site-packages directory.

python_version = '.'.join(map(str, sys.version_info[:2]))
site_packages = python_home + '/lib/python%s/site-packages' % python_version

# Add the site-packages directory.

site.addsitedir(site_packages)

sys.path.insert(0, '/var/www/html/flaskjepage')
from flaskjepage import app as application
