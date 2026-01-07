# Azure setup checklist (quick)

You will authenticate GitHub Actions to Azure using **OpenID Connect (OIDC)**.

## GitHub Secrets (Repository settings)
- AZURE_CLIENT_ID
- AZURE_TENANT_ID
- AZURE_SUBSCRIPTION_ID

## GitHub Variables (Repository settings)
- AZURE_RESOURCE_GROUP
- AZURE_ACR_NAME
- AZURE_API_APP_NAME
- AZURE_WEB_APP_NAME

## Bicep parameters
Edit `infra/parameters.dev.json` and replace:
- REPLACE_ME_ACR_NAME
- REPLACE_ME_MONGO_URL (use MongoDB Atlas connection string or Cosmos DB Mongo API)

> Do not commit real secrets into git.
