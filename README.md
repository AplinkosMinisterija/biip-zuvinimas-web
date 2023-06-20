# BĮIP Žuvinimas WEB

[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/AplinkosMinisterija/biip-zuvinimas-web/badge)](https://securityscorecards.dev/viewer/?platform=github.com&org={AplinkosMinisterija}&repo={biip-zuvinimas-web})
[![License](https://img.shields.io/github/license/AplinkosMinisterija/biip-zuvinimas-web)](https://github.com/AplinkosMinisterija/biip-zuvinimas-web/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/AplinkosMinisterija/biip-zuvinimas-web)](https://github.com/AplinkosMinisterija/biip-zuvinimas-web/issues)
[![GitHub stars](https://img.shields.io/github/stars/AplinkosMinisterija/biip-zuvinimas-web)](https://github.com/AplinkosMinisterija/biip-zuvinimas-web/stargazers)

This repository contains the source code and documentation for the BĮIP Žuvinimas WEB, developed by the Aplinkos
Ministerija.

## Table of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## About the Project

The BĮIP Žuvinimas WEB is designed to provide information and functionalities related to fish stocking activities. It
aims to support the management and conservation of fish populations, as well as the sustainability of fishing practices.

This is a client application that utilizes
the [BĮIP Žuvinimas API](https://github.com/AplinkosMinisterija/biip-zuvinimas-api).

Key features of the WEB include:

- Retrieving fish stocking data, such as planned fish stockings and historical information.
- Managing fish stocking data.

## Getting Started

To get started with the BĮIP Žuvinimas WEB, follow the instructions below.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AplinkosMinisterija/biip-zuvinimas-web.git
   ```

2. Install the required dependencies:

   ```bash
   cd biip-zuvinimas-web
   yarn install
   ```

### Usage

1. Start the WEB server:

   ```bash
   yarn start
   ```

The WEB will be available at `http://localhost:8080`.

## Deployment

### Production

To deploy the application to the production environment, create a new GitHub release:

1. Go to the repository's main page on GitHub.
2. Click on the "Releases" tab.
3. Click on the "Create a new release" button.
4. Provide a version number, such as `1.2.3`, and other relevant information.
5. Click on the "Publish release" button.

### Staging

The `main` branch of the repository is automatically deployed to the staging environment. Any changes pushed to the main
branch will trigger a new deployment.

### Development

To deploy any branch to the development environment use the `Deploy to Development` GitHub action.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a
pull request. For more information, see the [contribution guidelines](./CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](./LICENSE).
