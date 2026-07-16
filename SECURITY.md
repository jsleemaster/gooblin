# Security Policy

## Private reporting

Report suspected vulnerabilities through [GitHub private vulnerability reporting](https://github.com/jsleemaster/gooblin/security/advisories/new). Include the affected version, a minimal reproduction, the expected impact, and safe contact details for coordinated follow-up.

Do not disclose a suspected vulnerability publicly before coordinated review. This includes public issues, discussions, pull requests, and social posts.

## Supported boundary

The current source `main` branch and versions released to the npm registry are assessed separately. A fix present on `main` is not a claim that the registry package contains it, and a registry observation does not establish the state of current source.

The npm registry version 1.3.1 predates the destructive-operation refusal guard and must not be used for destructive lifecycle commands such as `install --force` or `uninstall`. Resolve and inspect the exact version before running any lifecycle command; source version 1.3.2 and newer contain the temporary refusal guard described in the release documentation.

This policy covers Gooblin source, packaged skill content, manifests, hooks, and the optional npx installer. Host-platform vulnerabilities and unmodified third-party Actions or registries should be reported to their maintainers, while integration defects caused by Gooblin remain in scope here.
