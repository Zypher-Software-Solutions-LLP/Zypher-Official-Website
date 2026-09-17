import { ButtonLink } from "@/components/ui/ButtonLink";
import { RouteIntro } from "@/features/pages/RouteIntro";

type StaticPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  body?: string[];
};

export function StaticPage({
  eyebrow,
  title,
  description,
  body = [],
}: StaticPageProps): React.ReactNode {
  return (
    <main id="main-content">
      <RouteIntro eyebrow={eyebrow} title={title} description={description} />
      {body.length > 0 ? (
        <section className="site-container max-w-3xl py-20 sm:py-28">
          <div className="space-y-6 text-base leading-8 text-mist-300">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ButtonLink className="mt-10" href="/contact">
            Talk to Zypher
          </ButtonLink>
        </section>
      ) : null}
    </main>
  );
}
