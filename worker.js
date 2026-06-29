// Cloudflare Worker - DoH proxy/server
// Endpoint: /dns-query

const DEFAULT_UPSTREAM_DOH = "https://cloudflare-dns.com/dns-query";
// گزینه‌های دیگر:
// https://dns.google/dns-query
// https://dns.quad9.net/dns-query

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/dns-query") {
      return new Response("Not Found", { status: 404 });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    try {
      let dnsQuery;

      if (request.method === "GET") {
        // DoH GET: /dns-query?dns=<base64url_dns_wire_message>
        const dnsParam = url.searchParams.get("dns");

        if (!dnsParam) {
          return textResponse("Missing dns query parameter", 400);
        }

        dnsQuery = base64UrlToArrayBuffer(dnsParam);
      } else if (request.method === "POST") {
        // DoH POST: body باید DNS wire-format باشد
        const contentType = request.headers.get("content-type") || "";

        if (!contentType.toLowerCase().startsWith("application/dns-message")) {
          return textResponse("Content-Type must be application/dns-message", 415);
        }

        dnsQuery = await request.arrayBuffer();
      } else {
        return textResponse("Method Not Allowed", 405, {
          Allow: "GET, POST, OPTIONS",
        });
      }

      if (!dnsQuery || dnsQuery.byteLength < 12) {
        return textResponse("Invalid DNS message", 400);
      }

      if (dnsQuery.byteLength > 65535) {
        return textResponse("DNS message too large", 413);
      }

      const upstream = env.UPSTREAM_DOH || DEFAULT_UPSTREAM_DOH;

      const upstreamResponse = await fetch(upstream, {
        method: "POST",
        headers: {
          "content-type": "application/dns-message",
          "accept": "application/dns-message",
        },
        body: dnsQuery,
      });

      if (!upstreamResponse.ok) {
        return textResponse(
          `Upstream DoH error: ${upstreamResponse.status}`,
          502
        );
      }

      return new Response(upstreamResponse.body, {
        status: 200,
        headers: {
          "content-type": "application/dns-message",
          "cache-control": "no-store",
          ...corsHeaders(),
        },
      });
    } catch (err) {
      return textResponse("Bad DNS query", 400);
    }
  },
};

function base64UrlToArrayBuffer(input) {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");

  const padding = base64.length % 4;
  if (padding) {
    base64 += "=".repeat(4 - padding);
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
  };
}

function textResponse(message, status = 200, extraHeaders = {}) {
  return new Response(message, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      ...corsHeaders(),
      ...extraHeaders,
    },
  });
}
