module.exports = {
  apps: [
    {
      name: "party-member-platform",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 5032",
      cwd: "/root/party-member-platform",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5032,
      },
    },
  ],
};
