# Use the official lightweight Nginx image
FROM nginx:alpine

# Copy all local files (index.html, script.js) into the Nginx web root directory
COPY . /usr/share/nginx/html/

# Expose port 80 (Nginx's default port)
EXPOSE 80

# The default command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]