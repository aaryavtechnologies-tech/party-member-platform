module.exports = {
  apps: [
    {
      name: "party-member-platform",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 5032",
      instances: "1", // Or a specific number of instances
      exec_mode: "cluster", // Uses all available CPU cores
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
