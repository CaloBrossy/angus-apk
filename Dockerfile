FROM openjdk:17-jdk-slim

# Install Android SDK
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Download and install Android SDK
RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip \
    && mkdir -p $ANDROID_HOME/cmdline-tools \
    && unzip commandlinetools-linux-11076708_latest.zip -d $ANDROID_HOME/cmdline-tools \
    && mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest \
    && rm commandlinetools-linux-11076708_latest.zip

# Accept licenses and install required packages
RUN yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
RUN $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build web app
RUN npm run build

# Build APK
RUN npx cap sync
RUN cd android && ./gradlew assembleDebug

# The APK will be in android/app/build/outputs/apk/debug/app-debug.apk
