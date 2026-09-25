# Architecture

## Overview

CYBEREXTRA is a browser-only security laboratory that combines defensive analysis with controlled offensive demonstrations. The architecture deliberately prevents dependence on external targets.

## Main layers

1. **Module catalog**
   - Independent laboratories represent distinct security domains and techniques.

2. **Synthetic scenarios**
   - Local data models reproduce suspicious or vulnerable conditions safely.

3. **Analysis engine**
   - Client-side JavaScript evaluates scenarios and generates findings.

4. **Evidence presentation**
   - Results are translated into defensive observations, severity and remediation context.

## Safety boundary

External target access is not required for the intended workflow. Offensive examples exist to explain failure modes and defensive controls, not to automate attacks against third-party systems.

## Extension pattern

A new module should define:
- the security question being studied;
- synthetic input;
- deterministic analysis logic;
- defensive interpretation;
- remediation or control guidance.
