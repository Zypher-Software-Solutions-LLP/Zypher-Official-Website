# Sanity blog webhook setup

The public blog reads published `blogPost` documents from Sanity. Configure a signed webhook so a publish, update, slug change, author/category change, or site-settings change expires the relevant Next.js cache immediately.

## Environment

Set this server-only value in every deployed application instance:

```text
SANITY_REVALIDATE_SECRET=<independently-generated-long-random-value>
```

Keep it different from `SANITY_PREVIEW_SECRET` and `SANITY_API_READ_TOKEN`. Do not prefix it with `NEXT_PUBLIC_`.

## Sanity webhook

Create a POST webhook targeting:

```text
https://<production-site>/api/revalidate/sanity
```

Enable signed requests and use the exact value of `SANITY_REVALIDATE_SECRET` as the webhook secret. Trigger it for create, update, and delete events for:

- `blogPost`
- `author`
- `category`
- `pageSeo`
- `siteSettings`

Use this payload projection:

```groq
{
  "documentId": _id,
  "documentType": _type,
  "slug": slug.current,
  "previousSlug": before().slug.current,
  "pagePath": pagePath
}
```

The `pagePath` value is used when a static-page SEO document changes. The
`slug` fields are used for blog posts and categories; fields that do not apply
to a document type may be omitted by Sanity.

The application validates the signature with `parseBody` from `next-sanity/webhook`.
It requires `application/json`, bounds the request body, and validates the signed
payload before deriving cache tags. It returns `401` for an invalid signature,
`400` for malformed/unsupported content, `413` for an oversized body, `415` for a
wrong content type, `503` when the webhook secret is not configured, and `200`
after expiring all affected tags with `revalidateTag(tag, { expire: 0 })`. It also
refreshes the public blog route, affected article/category paths, `/sitemap.xml`,
and `/llms.txt` so a newly published post can appear immediately.

Use a request body projection containing only the fields above. The route logs no
signature, body, author data, or article content.

## Verification

After deployment:

1. Send a signed test delivery and confirm a `200` response.
2. Publish a post and confirm it becomes the blog hero on the next public request.
3. Change its slug and confirm the old and new article tags are both refreshed.
4. Update an author or category and confirm affected listing/article pages refresh.
5. Confirm the webhook response and logs do not contain the secret, signature, or full document.

Production builds also validate that the revalidation and preview secrets are
present, independent, and sufficiently long when `VERCEL_ENV=production` or
`VALIDATE_PRODUCTION_ENV=true` is set. See [Production environment](production-environment.md).
