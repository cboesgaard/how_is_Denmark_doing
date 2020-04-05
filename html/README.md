# d3.js based graph

This directory contains an example of a d3.js based graph.

To test, run docker like this, *in the top directory*:

```bash
docker run -v ${PWD}:/usr/share/nginx/html:ro -d -p 80:80 nginx
```

Note, that this starts the docker in the background (even if there is is a -d option... )

Afterwards, point your browser to `http://localhost/html` - remember the `/html` part.