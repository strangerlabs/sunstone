# Plugin Manager API

## Requirements

* soft-realtime
* discoverable
* versioned
* provide app metadata and state
* provide individual plugin metadata and state
* control the app and plugin lifecycle remotely
* search for plugins
* install, start, stop, disable, enable, configure, and remove plugins
* record history of actions/state changes
* validate actions
* support web, desktop, mobile, cli, and server clients
* restrict access to authorized clients

## Summary

**App Status**

* [GET /v1/app](#app-metadata-request)
* [GET /v1/app/health](#app-health-request)
* [GET /v1/app/network](#app-network-request)

**App Lifecycle**
* [POST /v1/app/start](#app-start-request)
* [POST /v1/app/stop](#app-stop-request)
* [POST /v1/app/restart](#app-restart-request)

**App Events**

* TBD

**Plugin Listing and Search**

* [GET /v1/plugins](#installed-plugins-request)
* [GET /v1/plugins?search=term](#search-available-plugins-request)

**Plugin Status and Settings**

* [GET /v1/plugins/:uuid](#get-plugin-request)
* [GET /v1/plugins/:uuid/settings](#get-plugin-settings-request)
* [PUT /v1/plugins/:uuid/settings/:key](#update-plugin-settings-request)

**Plugin Lifecycle**

* [POST /v1/plugins/:uuid/install](#install-plugin-request)
* [POST /v1/plugins/:uuid/start](#start-plugin-request)
* [POST /v1/plugins/:uuid/stop](#stop-plugin-request)
* [POST /v1/plugins/:uuid/restart](#restart-plugin-request)
* [POST /v1/plugins/:uuid/disable](#disable-plugin-request)
* [POST /v1/plugins/:uuid/remove](#remove-plugin-request)

**Plugin Events**

* TBD


## Endpoints

### App Metadata Request

```
GET /v1/app HTTP/1.1
Host: example.com
```

### App Metadata Response

```
HTTP/1.1 200 Ok
Content-Type: application/json

{
  "name": "open-algorithms",
  "description": "MIT Open Algorithms",
  "version": "1.3.2",
  "author": "MIT Connection Science",
  "license": "MIT",
  "url": "https://localhost:3000"
}
```

### App Health Request

```
GET /v1/app/health HTTP/1.1
Host: example.com
```

### App Health Response

```
HTTP/1.1 200 Ok
Content-Type: application/json

{
  "status": "active",
  "now": <unix epoch milliseconds>,
  "started": <unix epoch milliseconds>,
  "uptime": <unix epoch milliseconds>,
  "served": 3000000,
  "average": {
    "hour": 3000,
    "second": 0.034721666666666665
  },
  "peak": {
    "today": 300
  }
}
```


### App Start Request
```
POST /v1/app/start HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### App Start Response

```
HTTP/1.1 200 OK
```

### App Stop Request
```
POST /v1/app/stop HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### App Stop Response

```
HTTP/1.1 200 OK
```


### App Restart Request
```
POST /v1/app/restart HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### App Restart Response

```
HTTP/1.1 200 OK
```


### App Network

TBD

### App Events

TBD

### Installed Plugins Request

```
GET /v1/plugins HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### Installed Plugins Response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "plugins": [
    ...
  ]
}
```

### Search Available Plugins Request


```
GET /v1/plugins?search=foo HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### Search Available Plugins Response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "plugins": [
    ...
  ]
}
```

### Get Plugin Request

```
GET /v1/plugins/uuid HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### Get Plugin Response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  ...
}
```


### Get Plugin Settings Request

```
GET /v1/plugins/uuid/settings HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### Get Plugin Settings Response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "authentication": "bearer",
  "redis": {
    "host": "localhost",
    "port": 6479
  }
}
```

### Update Plugin Settings Request

```
PUT /v1/plugins/uuid/settings/key HTTP/1.1
Content-Type: application/json
Authorization: Bearer <signed-token>
Host: example.com

"value"
```

### Update Plugin Settings Response

```
HTTP/1.1 200 OK
```

### Install Plugin Request

```
POST /v1/plugins/uuid/install HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com

package=hello-world&enabled=true
```

### Install Plugin Response

```
HTTP/1.1 202 Accepted
Location: https://example.com/v1/plugins/uuid1/install/uuid2
```

### Start Plugin Request
```
POST /v1/plugin/uuid/start HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### Start Plugin Response

```
HTTP/1.1 200 OK
```

### Stop Plugin Request
```
POST /v1/plugin/uuid/stop HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### Stop Plugin Response

```
HTTP/1.1 200 OK
```

### Restart Plugin Request
```
POST /v1/plugin/uuid/restart HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### Restart Plugin Response

```
HTTP/1.1 200 OK
```

### Disable Plugin Request
```
POST /v1/plugin/uuid/disable HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### Disable Plugin Response

```
HTTP/1.1 200 OK
```

### Remove Plugin Request

```
POST /v1/plugins/uuid/remove HTTP/1.1
Authorization: Bearer <signed-token>
Host: example.com
```

### Remove Plugin Response

```
HTTP/1.1 202 Accepted
Location: https://example.com/v1/plugins/uuid1/remove/uuid2
```

