# Caritat — vote counting tools

Caritat counts votes. Caritat is designed _only_ to provide the step from
ballots to results. It provides no mechanism for people to cast votes; this is
left to whatever code calls Caritat. A number of different counting mechanisms
is provided:

- Simple plurality winner

- Instant Runoff Voting

- Borda count

- Condorcet

    - Condorcet winner determination (only if one exists!)

    - Schulze method

- Single Transferable Vote

    - Meek method
