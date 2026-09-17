# Tracking plan

GTM is the only optional-script loader. GA4 is the first destination. Optional tags remain blocked
until explicit consent.

| Event                    | Properties                         | Trigger                                  |
| ------------------------ | ---------------------------------- | ---------------------------------------- |
| `cta_clicked`            | `label`, `location`, `destination` | A tracked CTA is activated               |
| `navigation_clicked`     | `label`, `destination`, `location` | Header or footer navigation is activated |
| `contact_form_started`   | `form_name`                        | First contact-field interaction          |
| `contact_form_submitted` | `form_name`                        | Resend accepts the message               |
| `contact_form_failed`    | `form_name`, `reason`              | Validation or delivery failure           |
| `blog_post_viewed`       | `slug`                             | A blog post is rendered                  |
| `outbound_link_clicked`  | `destination`, `location`          | External link is activated               |

No event may include name, email, phone, company, subject, message, tokens, or full IP addresses.
