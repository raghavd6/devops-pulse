// Azure Container Apps minimal infrastructure (Resource Group scope)

param location string = resourceGroup().location
param tags object = {
  project: 'devops-pulse'
}

@minLength(5)
@maxLength(50)
param acrName string

param containerAppsEnvName string
param apiAppName string
param webAppName string

@secure()
param mongoUrl string

resource law 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${containerAppsEnvName}-law'
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  tags: tags
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
  }
}

resource env 'Microsoft.App/managedEnvironments@2023-08-01-preview' = {
  name: containerAppsEnvName
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: law.properties.customerId
        sharedKey: law.listKeys().primarySharedKey
      }
    }
  }
}

resource api 'Microsoft.App/containerApps@2023-08-01-preview' = {
  name: apiAppName
  location: location
  tags: tags
  properties: {
    managedEnvironmentId: env.id
    configuration: {
      ingress: {
        external: false
        targetPort: 3000
        transport: 'auto'
      }
      secrets: [
        { name: 'mongo-url', value: mongoUrl }
      ]
    }
    template: {
      containers: [
        {
          name: 'api'
          image: 'placeholder'
          env: [
            { name: 'PORT', value: '3000' }
            { name: 'MONGO_URL', secretRef: 'mongo-url' }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 2
      }
    }
  }
}

resource web 'Microsoft.App/containerApps@2023-08-01-preview' = {
  name: webAppName
  location: location
  tags: tags
  properties: {
    managedEnvironmentId: env.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
        transport: 'auto'
      }
    }
    template: {
      containers: [
        {
          name: 'web'
          image: 'placeholder'
          env: [
            { name: 'VITE_API_URL', value: 'http://${apiAppName}' }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 2
      }
    }
  }
}

output webUrl string = 'https://${web.properties.configuration.ingress.fqdn}'
output apiUrl string = 'https://${api.properties.configuration.ingress.fqdn}'
