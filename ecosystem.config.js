module.exports = {
  apps: [
    {
      name: "party-member-platform",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 5026",
      instances: "max", // Or a specific number of instances
      exec_mode: "cluster", // Uses all available CPU cores
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
