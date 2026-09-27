# Sanity blog authoring

The public blog reads only published Sanity content. Drafts stay out of the public site, sitemap, metadata, and category counts until they are published.

## Create categories first

1. Open the Studio at `/studio`.
2. Select `Category` in the left-hand Content menu.
3. Choose `Create new`.
4. Enter the category title. Sanity will suggest the slug; keep it lowercase and URL-friendly.
5. Add an optional description and publish the category.

Categories are intentionally managed in Sanity rather than hardcoded in the website. A published category appears in the public filter immediately; if it does not have a post yet, its page will show an empty state until the first matching post is published.

## Create an author

1. Select `Author` in the left-hand Content menu.
2. Create the author, add their name, role, bio, and optional profile image, then publish.

## Create a blog post

1. Select `Blog Post` and choose `Create new`.
2. Fill in the required `Title`, `Slug`, and `Excerpt`. The excerpt is used in the hero and post previews, so keep it between 40 and 240 characters.
3. Select one published `Author` and at least one `Category`.
4. Upload the `Featured image` and provide descriptive `Alt text`. This is the thumbnail, hero image, article header image, Open Graph image, and sitemap image.
5. If the author has a public profile, add it in the optional `Profile URL` field. This is used for article author structured data.
6. Set `Published at`. A post is visible only when this value is present and is not in the future.
7. Write the `Body` using `Normal`, `Heading 2`, and `Heading 3` blocks. The website automatically builds the article's sticky table of contents from Heading 2 and Heading 3 blocks.
8. Use the editor's bullet-list and numbered-list controls whenever the article needs points. Links, quotes, and inline images are also supported.
9. Add optional SEO title and description overrides when the search result needs copy different from the visible title and excerpt.
10. Publish the post.

## What happens after publishing

The Sanity webhook calls `/api/revalidate/sanity` and invalidates the blog list, category pages, the article route, metadata, and sitemap immediately. If the webhook is not configured yet, the content will still appear after the normal cache lifetime, but the instant update path will not be available.

For the webhook setup and signing secret, see [sanity-blog-webhook.md](./sanity-blog-webhook.md).
