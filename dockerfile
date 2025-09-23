FROM nginx:alpine

# Copy the HTML file into the default Nginx web directory
COPY visualizer.html /usr/share/nginx/html/index.html

#  Expose port 80 (Nginx default)
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]