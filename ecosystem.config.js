module.exports = {
  "apps": [
      {
          "name": "find-employee-api",
          "cwd": "./src/api",
          "script": "npm",
          "args" : "run start:dev",
          "env_development": {
            "NODE_ENV": "development"
          }
      },
      {
        "name": "find-employee-web",
        "cwd": "./src/web",
        "script": "npm",
        "args" : "run start:dev",
        "env_development": {
          "NODE_ENV": "development"
        }
    }
  ]
}

