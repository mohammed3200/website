
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** website
- **Date:** 2026-01-25
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 get_all_active_published_strategic_plans
- **Test Code:** [TC001_get_all_active_published_strategic_plans.py](./TC001_get_all_active_published_strategic_plans.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 10, in test_get_all_active_published_strategic_plans
  File "/var/task/requests/models.py", line 1024, in raise_for_status
    raise HTTPError(http_error_msg, response=self)
requests.exceptions.HTTPError: 500 Server Error: Internal Server Error for url: http://localhost:3000/api/strategic-plan/public

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 43, in <module>
  File "<string>", line 41, in run
  File "<string>", line 12, in test_get_all_active_published_strategic_plans
AssertionError: Request to GET /public failed: 500 Server Error: Internal Server Error for url: http://localhost:3000/api/strategic-plan/public

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/80e5707f-ef30-4ae1-a0e4-d112e386c1ed/9a36f62b-b542-456d-8ae5-b91502fe50ca
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 get_strategic_plan_by_id_or_slug
- **Test Code:** [TC002_get_strategic_plan_by_id_or_slug.py](./TC002_get_strategic_plan_by_id_or_slug.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 45, in <module>
  File "<string>", line 13, in test_get_strategic_plan_by_id_or_slug
AssertionError: Expected 200 OK but got 500

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/80e5707f-ef30-4ae1-a0e4-d112e386c1ed/bb43ce33-6b5f-4ae4-a4a1-c6dc2fd86538
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 admin_get_all_strategic_plans
- **Test Code:** [TC003_admin_get_all_strategic_plans.py](./TC003_admin_get_all_strategic_plans.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/urllib3/connectionpool.py", line 534, in _make_request
    response = conn.getresponse()
               ^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/connection.py", line 565, in getresponse
    httplib_response = super().getresponse()
                       ^^^^^^^^^^^^^^^^^^^^^
  File "/var/lang/lib/python3.12/http/client.py", line 1430, in getresponse
    response.begin()
  File "/var/lang/lib/python3.12/http/client.py", line 331, in begin
    version, status, reason = self._read_status()
                              ^^^^^^^^^^^^^^^^^^^
  File "/var/lang/lib/python3.12/http/client.py", line 292, in _read_status
    line = str(self.fp.readline(_MAXLINE + 1), "iso-8859-1")
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/lang/lib/python3.12/socket.py", line 720, in readinto
    return self._sock.recv_into(b)
           ^^^^^^^^^^^^^^^^^^^^^^^
TimeoutError: timed out

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/var/task/requests/adapters.py", line 667, in send
    resp = conn.urlopen(
           ^^^^^^^^^^^^^
  File "/var/task/urllib3/connectionpool.py", line 841, in urlopen
    retries = retries.increment(
              ^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/util/retry.py", line 474, in increment
    raise reraise(type(error), error, _stacktrace)
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/util/util.py", line 39, in reraise
    raise value
  File "/var/task/urllib3/connectionpool.py", line 787, in urlopen
    response = self._make_request(
               ^^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/connectionpool.py", line 536, in _make_request
    self._raise_timeout(err=e, url=url, timeout_value=read_timeout)
  File "/var/task/urllib3/connectionpool.py", line 367, in _raise_timeout
    raise ReadTimeoutError(
urllib3.exceptions.ReadTimeoutError: HTTPConnectionPool(host='tun.testsprite.com', port=8080): Read timed out. (read timeout=30)

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "<string>", line 30, in admin_get_all_strategic_plans
  File "/var/task/requests/sessions.py", line 637, in post
    return self.request("POST", url, data=data, json=json, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/requests/sessions.py", line 589, in request
    resp = self.send(prep, **send_kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/requests/sessions.py", line 703, in send
    r = adapter.send(request, **kwargs)
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/requests/adapters.py", line 713, in send
    raise ReadTimeout(e, request=request)
requests.exceptions.ReadTimeout: HTTPConnectionPool(host='tun.testsprite.com', port=8080): Read timed out. (read timeout=30)

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 54, in <module>
  File "<string>", line 51, in admin_get_all_strategic_plans
AssertionError: Request failed: HTTPConnectionPool(host='tun.testsprite.com', port=8080): Read timed out. (read timeout=30)

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/80e5707f-ef30-4ae1-a0e4-d112e386c1ed/03eac229-7a83-4e70-8a40-56edee1cb440
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 admin_create_strategic_plan_with_validation_and_slug_uniqueness
- **Test Code:** [TC004_admin_create_strategic_plan_with_validation_and_slug_uniqueness.py](./TC004_admin_create_strategic_plan_with_validation_and_slug_uniqueness.py)
- **Test Error:** Traceback (most recent call last):
  File "<string>", line 35, in get_auth_session
Exception: Session cookie not found in authentication response

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 122, in <module>
  File "<string>", line 43, in test_admin_create_strategic_plan_with_validation_and_slug_uniqueness
  File "<string>", line 39, in get_auth_session
Exception: Authentication failed: Session cookie not found in authentication response

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/80e5707f-ef30-4ae1-a0e4-d112e386c1ed/31455ba6-7a1a-4a29-b86d-54e2c56e30e2
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 admin_update_strategic_plan_with_validation_and_slug_uniqueness
- **Test Code:** [TC005_admin_update_strategic_plan_with_validation_and_slug_uniqueness.py](./TC005_admin_update_strategic_plan_with_validation_and_slug_uniqueness.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/urllib3/connectionpool.py", line 534, in _make_request
    response = conn.getresponse()
               ^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/connection.py", line 565, in getresponse
    httplib_response = super().getresponse()
                       ^^^^^^^^^^^^^^^^^^^^^
  File "/var/lang/lib/python3.12/http/client.py", line 1430, in getresponse
    response.begin()
  File "/var/lang/lib/python3.12/http/client.py", line 331, in begin
    version, status, reason = self._read_status()
                              ^^^^^^^^^^^^^^^^^^^
  File "/var/lang/lib/python3.12/http/client.py", line 292, in _read_status
    line = str(self.fp.readline(_MAXLINE + 1), "iso-8859-1")
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/lang/lib/python3.12/socket.py", line 720, in readinto
    return self._sock.recv_into(b)
           ^^^^^^^^^^^^^^^^^^^^^^^
TimeoutError: timed out

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/var/task/requests/adapters.py", line 667, in send
    resp = conn.urlopen(
           ^^^^^^^^^^^^^
  File "/var/task/urllib3/connectionpool.py", line 841, in urlopen
    retries = retries.increment(
              ^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/util/retry.py", line 474, in increment
    raise reraise(type(error), error, _stacktrace)
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/util/util.py", line 39, in reraise
    raise value
  File "/var/task/urllib3/connectionpool.py", line 787, in urlopen
    response = self._make_request(
               ^^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/connectionpool.py", line 536, in _make_request
    self._raise_timeout(err=e, url=url, timeout_value=read_timeout)
  File "/var/task/urllib3/connectionpool.py", line 367, in _raise_timeout
    raise ReadTimeoutError(
urllib3.exceptions.ReadTimeoutError: HTTPConnectionPool(host='tun.testsprite.com', port=8080): Read timed out. (read timeout=30)

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "<string>", line 31, in authenticate_admin
  File "/var/task/requests/sessions.py", line 637, in post
    return self.request("POST", url, data=data, json=json, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/requests/sessions.py", line 589, in request
    resp = self.send(prep, **send_kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/requests/sessions.py", line 703, in send
    r = adapter.send(request, **kwargs)
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/requests/adapters.py", line 713, in send
    raise ReadTimeout(e, request=request)
requests.exceptions.ReadTimeout: HTTPConnectionPool(host='tun.testsprite.com', port=8080): Read timed out. (read timeout=30)

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 137, in <module>
  File "<string>", line 63, in admin_update_strategic_plan_with_validation_and_slug_uniqueness
  File "<string>", line 39, in authenticate_admin
RuntimeError: Admin authentication failed: HTTPConnectionPool(host='tun.testsprite.com', port=8080): Read timed out. (read timeout=30)

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/80e5707f-ef30-4ae1-a0e4-d112e386c1ed/976d6b54-e47e-44dd-b1a1-fe01168fee4a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 admin_delete_strategic_plan
- **Test Code:** [TC006_admin_delete_strategic_plan.py](./TC006_admin_delete_strategic_plan.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/urllib3/connectionpool.py", line 534, in _make_request
    response = conn.getresponse()
               ^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/connection.py", line 565, in getresponse
    httplib_response = super().getresponse()
                       ^^^^^^^^^^^^^^^^^^^^^
  File "/var/lang/lib/python3.12/http/client.py", line 1430, in getresponse
    response.begin()
  File "/var/lang/lib/python3.12/http/client.py", line 331, in begin
    version, status, reason = self._read_status()
                              ^^^^^^^^^^^^^^^^^^^
  File "/var/lang/lib/python3.12/http/client.py", line 292, in _read_status
    line = str(self.fp.readline(_MAXLINE + 1), "iso-8859-1")
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/lang/lib/python3.12/socket.py", line 720, in readinto
    return self._sock.recv_into(b)
           ^^^^^^^^^^^^^^^^^^^^^^^
TimeoutError: timed out

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/var/task/requests/adapters.py", line 667, in send
    resp = conn.urlopen(
           ^^^^^^^^^^^^^
  File "/var/task/urllib3/connectionpool.py", line 841, in urlopen
    retries = retries.increment(
              ^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/util/retry.py", line 474, in increment
    raise reraise(type(error), error, _stacktrace)
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/util/util.py", line 39, in reraise
    raise value
  File "/var/task/urllib3/connectionpool.py", line 787, in urlopen
    response = self._make_request(
               ^^^^^^^^^^^^^^^^^^^
  File "/var/task/urllib3/connectionpool.py", line 536, in _make_request
    self._raise_timeout(err=e, url=url, timeout_value=read_timeout)
  File "/var/task/urllib3/connectionpool.py", line 367, in _raise_timeout
    raise ReadTimeoutError(
urllib3.exceptions.ReadTimeoutError: HTTPConnectionPool(host='tun.testsprite.com', port=8080): Read timed out. (read timeout=30)

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 91, in <module>
  File "<string>", line 71, in test_admin_delete_strategic_plan
  File "<string>", line 30, in authenticate_admin
  File "/var/task/requests/sessions.py", line 637, in post
    return self.request("POST", url, data=data, json=json, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/requests/sessions.py", line 589, in request
    resp = self.send(prep, **send_kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/requests/sessions.py", line 703, in send
    r = adapter.send(request, **kwargs)
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/var/task/requests/adapters.py", line 713, in send
    raise ReadTimeout(e, request=request)
requests.exceptions.ReadTimeout: HTTPConnectionPool(host='tun.testsprite.com', port=8080): Read timed out. (read timeout=30)

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/80e5707f-ef30-4ae1-a0e4-d112e386c1ed/a6bf52ef-2e7d-4c35-87dc-ef666513f67a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **0.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---