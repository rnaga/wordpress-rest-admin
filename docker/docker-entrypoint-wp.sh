#!/bin/bash

# Wait for mysql
wait-for-it db:3306 -- echo "mysql is up"

# Download 
wp core download --allow-root

# Create wp-config and install wordpress
wp config create --dbname=wordpress --dbuser=root --dbpass=root --dbhost=db --allow-root
wp core install --url=http://localhost --title=demo-wordpress --admin_user=demo --admin_password=demo --admin_email=demo@example.com --allow-root

# Install JWT plugin
wp plugin install https://downloads.wordpress.org/plugin/jwt-auth.zip --force --allow-root
wp plugin activate jwt-auth --allow-root

# Set permalink
wp rewrite structure '/%postname%/' --allow-root

# Add constants needed for JWT plugin
sed -i "s/<?php/\<\?php\ndefine\('JWT_AUTH_SECRET_KEY\',\'demo\');/g" /var/www/html/wp-config.php
sed -i "s/<?php/\<\?php\ndefine('JWT_AUTH_CORS_ENABLE', true);/g" /var/www/html/wp-config.php

# Set rewrite rules
cat > .htaccess <<-'EOF'
<IfModule mod_rewrite.c>
 RewriteEngine On
 RewriteBase /
 RewriteRule ^index\.php$ - [L]
 RewriteCond %{REQUEST_FILENAME} !-f
 RewriteCond %{REQUEST_FILENAME} !-d
 RewriteRule . /index.php [L]
</IfModule>
RewriteEngine on
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
EOF

# Start httpd
/etc/init.d/apache2 start

tail -f /dev/null
