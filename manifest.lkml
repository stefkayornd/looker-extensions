
project_name: "self-service-dashboard-builder"

extension {
  file: "src/index.tsx"
}

application: self-service-dashboard-builder {
  label: "self-service-dashboard-builder"
  url: "https://localhost:5175/bundle.js"
  # file: "bundle.js
  entitlements: {
    core_api_methods: ["me"] #Add more entitlements here as you develop new functionality
  }
}
