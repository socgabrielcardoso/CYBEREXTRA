# Validation

## Automated

Static quality checks validate JavaScript syntax and unresolved conflict markers on pushes and pull requests.

## Manual smoke test

1. Serve the project locally.
2. Open the module catalog.
3. Run the self-test.
4. Execute representative defensive and controlled offensive scenarios.
5. Confirm all samples use synthetic data.
6. Export a report and verify that it contains useful evidence without secrets.

## Acceptance criteria

No module should require unauthorized external access. Findings must remain understandable, reproducible and tied to a defensive interpretation or remediation.
