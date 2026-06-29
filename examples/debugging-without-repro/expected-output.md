## Rubber Duck

### Expected
A user with valid credentials should log in and land in an authenticated session.

### Actual
The report says login sometimes fails, but there is no exact failing path, status code, account type, browser, timestamp, or log.

### First contradiction
We cannot tell whether the failure is credential rejection, network failure, session cookie failure, redirect failure, or client state drift.

### Minimal reproduction
Capture one failing attempt with browser, account type, timestamp, request payload shape, response status, response body, session cookie state, console logs, and server logs.

### Next check
Inspect the first boundary where expected and actual diverge: auth response, cookie/session write, or post-login redirect.

### Test to add
After the failing boundary is known, add a regression test for that exact path.
