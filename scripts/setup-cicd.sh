#!/bin/bash

# Setup script for Trivia MCP CI/CD
# This script helps set up the necessary Google Cloud resources for automated deployment

set -e

echo "🚀 Setting up CI/CD for Trivia MCP Server"
echo "=========================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
if [ -z "$PROJECT_ID" ]; then
    echo "📝 Enter your Google Cloud Project ID:"
    read -r PROJECT_ID
fi

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID is required"
    exit 1
fi

echo "🔧 Using project: $PROJECT_ID"

# Set the project
gcloud config set project "$PROJECT_ID"

echo "✅ Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com  
gcloud services enable containerregistry.googleapis.com

echo "👤 Creating service account..."
gcloud iam service-accounts create trivia-mcp-deployer \
    --description="Service account for Trivia MCP CI/CD" \
    --display-name="Trivia MCP Deployer" || echo "Service account may already exist"

echo "🔐 Granting permissions..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:trivia-mcp-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:trivia-mcp-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:trivia-mcp-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

echo "🔑 Creating service account key..."
gcloud iam service-accounts keys create "trivia-mcp-key.json" \
    --iam-account="trivia-mcp-deployer@$PROJECT_ID.iam.gserviceaccount.com"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):"
echo ""
echo "   Secret Name: GCP_PROJECT_ID"
echo "   Value: $PROJECT_ID"
echo ""
echo "   Secret Name: GCP_SA_KEY"
echo "   Value: [Contents of trivia-mcp-key.json file]"
echo ""
echo "2. Copy the contents of trivia-mcp-key.json:"
echo "   cat trivia-mcp-key.json"
echo ""
echo "3. Delete the key file after adding it to GitHub secrets:"
echo "   rm trivia-mcp-key.json"
echo ""
echo "4. Push your code to the main branch to trigger the first deployment!"
echo ""
echo "🎉 Your CI/CD pipeline is ready!" 