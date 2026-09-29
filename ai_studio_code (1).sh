npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "ShortsGen AI" "com.shortsgen.ai" --web-dir dist
npm run build
npx cap add android
npx cap open android