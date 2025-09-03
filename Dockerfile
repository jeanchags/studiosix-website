# Dockerfile by Sys Forge - Studio Six
# Base: Alpine Linux for a lean and secure image.
FROM alpine:3.20

# --- IMAGE METADATA ---
LABEL maintainer="Sys Forge <sysforge@studiosix.dev>"
LABEL description="Alpine image with Apache (httpd), PHP 8.3, MySQL Client, and Composer."

# --- ENVIRONMENT VARIABLES ---
# Define PHP versions for easier updates.
ENV PHP_VERSION=8.3
# Version format required by Alpine's package manager (e.g., php83).
ENV PHP_APK_VERSION=83

# --- DEPENDENCY INSTALLATION ---
# Update package index and install Apache, PHP, and common extensions.
# --no-cache is used to keep the image size small.
RUN apk update && \
    apk add --no-cache \
    # Apache Web Server
    apache2 \
    apache2-utils \
    # PHP and its connector for Apache
    php${PHP_APK_VERSION} \
    php${PHP_APK_VERSION}-apache2 \
    # Essential PHP extensions
    php${PHP_APK_VERSION}-ctype \
    php${PHP_APK_VERSION}-curl \
    php${PHP_APK_VERSION}-dom \
    php${PHP_APK_VERSION}-fileinfo \
    php${PHP_APK_VERSION}-gd \
    php${PHP_APK_VERSION}-iconv \
    php${PHP_APK_VERSION}-intl \
    php${PHP_APK_VERSION}-json \
    php${PHP_APK_VERSION}-mbstring \
    php${PHP_APK_VERSION}-mysqli \
    php${PHP_APK_VERSION}-mysqlnd \
    php${PHP_APK_VERSION}-openssl \
    php${PHP_APK_VERSION}-pdo \
    php${PHP_APK_VERSION}-pdo_mysql \
    php${PHP_APK_VERSION}-phar \
    php${PHP_APK_VERSION}-session \
    php${PHP_APK_VERSION}-tokenizer \
    php${PHP_APK_VERSION}-xml \
    php${PHP_APK_VERSION}-xmlreader \
    php${PHP_APK_VERSION}-xmlwriter \
    php${PHP_APK_VERSION}-zip \
    # Useful tools
    curl \
    && \
    # --- COMPOSER INSTALLATION ---
    # Download and install Composer securely.
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    # --- CLEANUP ---
    # Remove unnecessary files to optimize image size.
    rm -rf /var/cache/apk/*

# --- APACHE CONFIGURATION ---
# Instead of replacing httpd.conf, we modify the default one.
# This is more robust as it preserves the package's default settings, including PHP module loading.
RUN sed -i 's#^DocumentRoot ".*#DocumentRoot "/var/www/localhost/htdocs"#' /etc/apache2/httpd.conf && \
    sed -i 's#<Directory "/var/www/localhost/htdocs">#<Directory "/var/www/localhost/htdocs">\n    AllowOverride All#' /etc/apache2/httpd.conf && \
    sed -i '/^DirectoryIndex/ s/$/ index.php/' /etc/apache2/httpd.conf && \
    # Configure logging to be Docker-friendly using printf for reliability.
    printf "\nErrorLog /dev/stderr\n" >> /etc/apache2/httpd.conf && \
    printf "CustomLog /dev/stdout combined\n" >> /etc/apache2/httpd.conf

# Set the default working directory.
WORKDIR /var/www/localhost/htdocs

# Expose the default Apache port.
EXPOSE 80

# --- STARTUP COMMAND ---
# Start Apache in the foreground to keep the container running.
CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]
