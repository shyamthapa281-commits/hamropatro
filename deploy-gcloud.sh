#!/usr/bin/env bash
set -e

# ==============================================================================
# Google Cloud Run Deployment Script for Shubha Patro
# Project: hamropatro-app-live | Region: asia-east1
# ==============================================================================

SERVICE_NAME="shubhapatro"
REGION="asia-east1"
TARGET_PROJECT="hamropatro-app-live"

echo "=========================================="
echo " Deploying Shubha Patro to Google Cloud   "
echo "=========================================="

if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is not installed."
    echo "Please run this command from Google Cloud Shell."
    exit 1
fi

echo "Setting active project to: $TARGET_PROJECT"
gcloud config set project "$TARGET_PROJECT" || true

CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
echo "Active GCP Project: $CURRENT_PROJECT"

echo "Enabling necessary Google Cloud APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project="$CURRENT_PROJECT"

echo "Deploying to Cloud Run service: $SERVICE_NAME..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region="$REGION" \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=5 \
  --set-env-vars="NODE_ENV=production,PORT=8080"

echo ""
echo "============================================================"
echo " Shubha Patro deployed successfully to Cloud Run! "
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format='value(status.url)')
echo " Live Service URL: $SERVICE_URL"
echo "============================================================"
