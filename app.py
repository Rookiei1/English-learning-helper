from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def do_GET(self):
        if self.path in ('/', '/index.html'):
            self.path = '/templates/index.html'
        return super().do_GET()


if __name__ == '__main__':
    server = ThreadingHTTPServer(('0.0.0.0', 5000), AppHandler)
    print('Server running at http://0.0.0.0:5000')
    server.serve_forever()
