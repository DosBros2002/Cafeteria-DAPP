module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "5777", // Any network (default: none)
    },
  },
  compilers: {
    solc: {
      version: "0.8.7", // Specify compiler version
      settings: {
        optimizer: {
          enabled: true, // Enable the optimizer
          runs: 200,
        },
      },
    },
  },
};
