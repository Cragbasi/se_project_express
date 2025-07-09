module.exports = {
  apps: [
    {
      name: "app",
      script: "app.js",
      watch: true,
    },
  ],
  deploy: {
    production: {
      user: "cragbasi",
      host: "your-server-ip",
      ref: "origin/main",
      repo: "git@github.com:cragbasi/se_project_express",
      path: "/home/cragbasi/se_project_express",
      "post-deploy": "npm install && pm2 restart app",
    },
  },
};
