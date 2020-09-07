# project-template

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Kubernetli Project  Template



## Wiki





### Session Import/Export

Export current Session:

<pre><code>curl http://localhost:8080/api/dev/session > session.bak</code></pre>

Import exported Session:

<pre><code>curl -X POST http://localhost:8080/api/dev/session --data @session.bak -H "Content-Type: application/json"</code></pre>





## Contributing

We'd love to have you contribute! Please refer to our [contribution guidelines](CONTRIBUTING.md) for details.

**By making a contribution to this project, you agree to and comply with the
[Developer's Certificate of Origin](https://developercertificate.org/).**
