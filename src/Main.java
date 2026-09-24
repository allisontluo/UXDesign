import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

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
                if (url.equals("/search")) {
                    String query = "";
                    String raw = exchange.getRequestURI().getRawQuery();
                    if (raw != null) for (String pair : raw.split("&")) {
                        String[] parts = pair.split("=", 2);
                        if (parts[0].equals("search") && parts.length == 2) {
                            try { query = URLDecoder.decode(parts[1], StandardCharsets.UTF_8).strip(); }
                            catch (IllegalArgumentException ignored) { query = ""; }
                        }
                    }
                    if (query.replaceAll("\\s+", " ").equalsIgnoreCase("italian brainrot")) {
                        exchange.getResponseHeaders().set("Location", "/article.html");
                        exchange.sendResponseHeaders(303, -1);
                    } else {
                        String html = """
                            <!doctype html><html lang="en"><head><meta charset="utf-8">
                            <meta name="viewport" content="width=device-width,initial-scale=1">
                            <title>Search — Wikipedia project</title></head>
                            <body style="font:18px/1.6 Arial,sans-serif;max-width:700px;margin:50px auto;padding:20px">
                            <a href="/index.html">Back to homepage</a><h1>No matching article</h1>
                            <p>This website currently includes one article. Search for <strong>Italian brainrot</strong>.</p>
                            <form action="/search" method="get"><label for="search">Search this website</label><br>
                            <input id="search" name="search" type="search" style="font:inherit;padding:8px" required>
                            <button style="font:inherit;padding:8px">Search</button></form>
                            <p>Or read <a href="/article.html">Italian brainrot</a>.</p></body></html>
                            """;
                        byte[] body = html.getBytes(StandardCharsets.UTF_8);
                        exchange.getResponseHeaders().set("Content-Type", "text/html; charset=utf-8");
                        exchange.sendResponseHeaders(200, exchange.getRequestMethod().equals("HEAD") ? -1 : body.length);
                        if (!exchange.getRequestMethod().equals("HEAD")) exchange.getResponseBody().write(body);
                    }
                    return;
                }
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
