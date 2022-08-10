module.exports = {
    networks: {
        development: {
            host: "127.0.0.1:",
            port: "7545",
            network_id: "*",
        },
    },
    migrations_directory: "./src/migrations/",
    contracts_directory: "./src/contracts/",
    contracts_build_directory: "./src/build/",
    compilers: {
        solc: {
            version: ">=0.4.22 <0.9.0",
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};
