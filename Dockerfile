FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Create startup script with seeding
RUN echo '#!/bin/sh\n\
if [ "$SEED_ONLY" = "true" ]; then\n\
  echo "Running database seed only..."\n\
  npm run seed\n\
else\n\
  echo "Starting application with seeding..."\n\
  npm run seed && npm run start:dev\n\
fi\n\
' > /app/startup.sh && chmod +x /app/startup.sh

# Start the app with the startup script
CMD ["/app/startup.sh"] 