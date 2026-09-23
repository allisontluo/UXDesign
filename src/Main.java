import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;

/** Dependency-free Java 17 web server. Run from the repository root. */
public class Main {
    public static void main(String[] args) throws Exception {
        int port = args.length > 0 ? Integer.parseInt(args[0]) : 8080;
        Path root = Path.of("public").toRealPath();
        var server = HttpServer.create(new InetSocketAddress("127.0.0.1", port), 0);
        server.createContext("/", exchange -> {
            try {
                if (!exchange.getRequestMethod().equals("GET") && !exchange.getRequestMethod().equals("HEAD")) {
                    exchange.getResponseHeaders().set("Allow", "GET, HEAD");
                    exchange.sendResponseHeaders(405, -1);
                    return;
                }
                String url = exchange.getRequestURI().getPath();
                Path file = root.resolve(url.equals("/") ? "index.html" : url.substring(1)).normalize();
                if (!file.startsWith(root) || !Files.isRegularFile(file) || !file.toRealPath().startsWith(root)) {
                    exchange.sendResponseHeaders(404, -1);
                    return;
                }
                String type = Files.probeContentType(file);
                if (type == null) type = "application/octet-stream";
                exchange.getResponseHeaders().set("Content-Type", type + "; charset=utf-8");
                exchange.getResponseHeaders().set("Cache-Control", "no-cache");
                byte[] body = Files.readAllBytes(file);
                if (exchange.getRequestMethod().equals("HEAD")) {
                    exchange.sendResponseHeaders(200, -1);
                } else {
                    exchange.sendResponseHeaders(200, body.length);
                    exchange.getResponseBody().write(body);
                }
            } finally {
                exchange.close();
            }
        });
        server.start();
        System.out.println("Italian Brainrot preview: http://localhost:" + port);
    }
}
